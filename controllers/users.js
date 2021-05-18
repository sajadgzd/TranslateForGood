const User = require("../models/user");
const Request = require("../models/request");
const Subscription = require("../models/subscription");
const bcrypt = require("bcryptjs");
const moment = require('moment-timezone');
const webPush = require("web-push");
const weigths = {timezoneW: 0.7, activityW: 0.3};
const nUrgent = 4;
const nNotUrgent = 2;


let allPotentialTranslators = []; 

// Secure push notifications
const publicVapidKey = "BLeogzDBodY_tQFm-HGNxdttRxLIsW-NMLW6AUhFWpj7EYcGWodIQDjFwh4MIFkI3sPTafdgfflRV0DVZBjOb9E";
const privateVapidKey = "uvwXQFqV6DQbNs-4G7qX8dJY8n3-Hs7HbkFHp6RW9QA";
webPush.setVapidDetails(
  'mailto:someemail@gmail.com',
  publicVapidKey,
  privateVapidKey 
);

const getUtilityFunctionScore = (activityScore, translatorTZ, requesterTZ) => { 
  try{
    let acceptanceScore = 1 - activityScore;
    let timeZoneDiff = (2600 - Math.abs(parseInt(moment().tz(requesterTZ).format('ZZ')) - parseInt(moment().tz(translatorTZ).format('ZZ'))))/2600;
    let UF = weigths.timezoneW*timeZoneDiff + weigths.activityW*acceptanceScore;
    return UF;
  } catch (error) {
    return res.status(400).json({ error: err.message });
  }
};

const timeActivityTable = (day, hour) => {
  if (hour >= 0 && hour < 6) { //any day of week 12am-6am
    return 0;
  } else if (day != 0 && day != 6 && hour >= 8 && hour < 17){ // weekday 8am-5pm
    return 0.7;
  } else if ((day != 0 && day != 6 && hour >= 17 && hour < 22) || ((day == 0 || day == 6) && (hour >= 8 && hour < 22))){ // weekday 5pm-10pm or weekend 8am-10pm
    return 1;
  } else {
    return 0.3;
  }
};

const parseDueDate = (requestDueDate) => {
  var today = moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]');
  console.log(today);
};
const getTimeActivityScore = (translatorTZ) => {
  try {
    let addH = parseInt(moment.tz(moment.tz.guess()).format('ZZ'))/100; // current timezone offset
    let subH = parseInt(moment.tz(translatorTZ).format('ZZ'))/100; // translator timezone offset
    let [convertedWeekday, convertedHour] = moment().subtract(addH, 'h').add(subH, 'h').format('d,HH').split(',');
    let timeActivityScore = timeActivityTable(parseInt(convertedWeekday), parseInt(convertedHour));
    // console.log("In translator's timezone: weekday is", convertedWeekday, ", hour is ", convertedHour);
    // console.log("S score is ", timeActivityScore);
    return timeActivityScore;
  } catch (error) {
    return res.status(400).json({ error: err.message });
  }
  
};


const isPastDue = (dueTimeString) => {
  // console.log(moment(dueTimeString, moment.ISO_8601), 'compare to ', moment());
  return moment(dueTimeString, moment.ISO_8601) < moment();
}

let UserController = {  

  // get user by id
  getById: async (req, res) => {
    try {
      let found = await User.findOne({_id: req.query.id});
      res.json(found);
    } catch (error) {
      return res.status(400).json({ error: err.message }); 
    }
  },
 
  // get all existing users
  getAll: async (req, res) => { 
    try {
      let allUsers = await User.find();
      res.json(allUsers);
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  },

  getMatchedTranslators: async (req, res) => {
      
    let requestID = req.query.newRequestID;
    let pointerToNotNotified;
    let matchedTranslators;
    let request;

    

    try {
      request = await Request.findOne({_id: requestID}).populate("author");
      let authorID = request.author._id;
      let active = true;
      // run loop until due time passes or request is accepted by someone
      while (!isPastDue(req.query.dueDateTime)) {
        if (!(await Request.findOne({_id: requestID}))){
          break;
        }
        let request_ = await Request.findOne({_id: requestID});
        active = request_.isActive;
        
        if (!active) { 
          break;
        }
        pointerToNotNotified = 0;

        // Filter by basic parameters
        if(req.query.femaleTranslatorBool == "true" && req.query.documentProofReadingBool == "false"){
          console.log("Female translation requested");
          matchedTranslators = await User.find({languageFrom: req.query.languageFrom, languageTo: req.query.languageTo, femaleTranslator: req.query.femaleTranslatorBool});
        }else if(req.query.femaleTranslatorBool == "true" && req.query.documentProofReadingBool == "true"){
          console.log("Female translation requested and Document profreading requested");
          matchedTranslators = await User.find({languageFrom: req.query.languageFrom, languageTo: req.query.languageTo, femaleTranslator: req.query.femaleTranslatorBool, proofRead: req.query.languageFrom});
        }else if(req.query.femaleTranslatorBool == "false" && req.query.documentProofReadingBool == "true"){
          console.log("Document profreading requested");
          matchedTranslators = await User.find({languageFrom: req.query.languageFrom, languageTo: req.query.languageTo, proofRead: req.query.languageFrom});
        } else {
          console.log("No female, No profread - requested");
          matchedTranslators = await User.find({languageFrom: req.query.languageFrom, languageTo: req.query.languageTo})
        }

        // calculate UF, S for each translator
        let potentialTranslators = [];
        
        for (let i = 0; i < matchedTranslators.length; i++) {
          let UF = getUtilityFunctionScore(matchedTranslators[i].translationActivity.acceptanceRate, matchedTranslators[i].timezone, request.author.timezone);
          let S = getTimeActivityScore(matchedTranslators[i].timezone);
          potentialTranslators.push({translator: matchedTranslators[i], Sscore: S, UFscore: UF});
        }

        // sort translators by S. If S is equal sort by UF
          potentialTranslators.sort(function (a, b) {   
            return b.Sscore - a.Sscore || b.UFscore - a.UFscore;
        });
        allPotentialTranslators = matchedTranslators;

        // notify batches of translators 
        //figure out if request is urgent - currently less than 5 hours
        let isUrgentRequest = req.query.isUrgent;
        let urgentConsoleLog = isUrgentRequest === "true" ? "Urgent" : "Not urgent";
        console.log(urgentConsoleLog, "request was submitted.");
        let N = isUrgentRequest === 'true' ? nUrgent : nNotUrgent;

        while (pointerToNotNotified < potentialTranslators.length) {
          //before notifying make sure request is still active and date is not past due
          if (!(await Request.findOne({_id: requestID}))){
            break;
          }
          let request_ = await Request.findOne({_id: requestID})
          active = request_.isActive;
          if (!active || isPastDue(req.query.dueDateTime)) {
            //console.log('Someone accepted the request or the time is past due!');
            break;
          }

          // Notify N translators. If less than N less, notify that less number of translators
          let diff = pointerToNotNotified + N > potentialTranslators.length ? potentialTranslators.length - pointerToNotNotified : N;

          for (let k = pointerToNotNotified; k < pointerToNotNotified + diff; k++){
            try {
              // check if translator already declined this request or was already notified
              if (!potentialTranslators[k].translator.translationActivity.declined.includes(requestID) && !potentialTranslators[k].translator.matchedRequests.includes(requestID)){
                console.log('.....Notifying the following translator: ', potentialTranslators[k].translator._id, "with S = ", potentialTranslators[k].Sscore, "and UF = ", potentialTranslators[k].UFscore);
                // update matchedRequests for every matchedTranslators found.
                if (!(await Request.findOne({_id: requestID}))){
                  break;
                }
                potentialTranslators[k].translator.matchedRequests.push(request);
                await potentialTranslators[k].translator.save();
                // update matchedTranslators for the new matchedRequest found.
                request.matchedTranslators.push(potentialTranslators[k].translator._id);
                await request.save();

                //send push notification only to people with push not. subscription
                let userID = potentialTranslators[k].translator._id;
                let subscription = await Subscription.findOne({user: userID});
                if (subscription) {
                    webPush.sendNotification(subscription.subscription, JSON.stringify({title: 'TranslateForGood', body: 'You have a new matched request. Please click this notification to check it out.'}))
                  .then(function() {
                    console.log('Push Application Server - Notification sent to translator', userID);
                  }).catch(function() {
                    console.log('ERROR in sending Notification to translator', userID);
                  }); 
                }
                               
                
              }
            } catch (err) {
              console.log(err);
              return res.status(400).json({ error: err.message });
            }     
          }
          // wait for 5 seconds
          console.log('Waiting 5 sec before notifying next batch.');
          await new Promise(resolve => setTimeout(resolve, 5000)); 
  
          pointerToNotNotified += diff;
        }

        //before waiting for the next cycle starts check again if request is active
        if (!(await Request.findOne({_id: requestID}))){
          break;
        }
        request_ = await Request.findOne({_id: requestID})
        active = request_.isActive;
        if (!active || isPastDue(req.query.dueDateTime)) {
          //console.log('Someone accepted the request or the time is past due!');
          break;
        }

        // wait for a 10 sec before repeating the cycle (in case someone new registers)
        console.log('Waiting 10sec before starting a new cycle.');
        await new Promise(resolve => setTimeout(resolve, 10000));
      } 
      if (!(await Request.findOne({_id: requestID}))){
        console.log('User Deleted This Request!');
      } else if (!active) { 
        console.log('Yay, someone accepted this request!');

        //let translatorWhoAcceptedRequest = await Request.findOne({_id: requestID}).populate("acceptedTranslator");
      } else {
        console.log('We were not able to find a matching translator before request due date.');
        //TO_DO: add function here
        try {
          //time out - handle expired request
          console.log("REQUEST TO DEACTIVATE:", requestID);

          // send push notification to request's author about their request's expiration
          let subscription = await Subscription.findOne({user: authorID});
          if (subscription) {

              webPush.sendNotification(subscription.subscription, JSON.stringify({title: 'TranslateForGood', body: 'Your request has expired. Please click this notification to check it out.'}))
            .then(function() {
              console.log('Push Application Server - Notification about expiration was sent to user', authorID);
            }).catch(function() {
              console.log('ERROR in sending Notification about expiration to user', authorID);
            }); 
          }


          await Request.updateOne( {_id: requestID}, {$set: {"isActive": false}});
          //console.log("TOTAL TRANSLATORS: ", allPotentialTranslators.length);
            for (let i = 0; i < allPotentialTranslators.length; i++) {
              let translator_id = allPotentialTranslators[i]._id;
              //console.log("Translator_id of all potential translators: ", translator_id);
              //add requestID to ignored field og translationActivity
              await User.findOneAndUpdate( {_id: translator_id}, {$push: {"translationActivity.ignored": [requestID]}});
              //calculate new acceptanceRate
              let total = 1 + allPotentialTranslators[i].translationActivity.accepted.length + allPotentialTranslators[i].translationActivity.declined.length + allPotentialTranslators[i].translationActivity.ignored.length;
              let acceptanceRate = total != 0 ? allPotentialTranslators[i].translationActivity.accepted.length/total : 0;
              //console.log("Acceptance rate: ", acceptanceRate);
              //add new acceptanceRate to translationActivity
              await User.findOneAndUpdate( {_id: translator_id}, {$set: {"translationActivity.acceptanceRate": acceptanceRate}});
              await User.updateOne( {_id: translator_id}, {$pull: {"matchedRequests": requestID}});
              
            }
            console.log("DEACTIVATION OF REQUEST COMPLETE!");
          return res.status(201).json({ message: "Request deactivated succesfully!" });
        } catch (error) {
          return res.status(400).json({ error: err.message });
        }
      } 
      return res.status(201).json({ message: "Done running matching algorithm! Request was accepted/resubmitted/terminated/deleted " });
      //   console.log("The matchedTranslators for particular request: ", matchedTranslators);
      //   console.log("The matchedRequest for all matchedTranslators: ", request);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: err.message });
    }
    
  },

  // given user's id get all the requests they created
  // actually returns the whole user object with list of requests objects.
  // to get requests just do .request on the result of this query
  getUserRequests: async (req, res) => {
    try {
      //console.log("------- UserID: ", req.query.userID);
      let requests = await User.findOne({_id: req.query.userID}).populate("requests");
      //console.log("Submitted Requests", requests.requests);
      for (let i = 0; i < requests.requests.length; i++) {
        if(isPastDue(requests.requests[i].dueDateTime)) {
          let requestID = requests.requests[i]._id; 
          expiredRequest_ = await Request.findOne({_id: requestID})
          expiredRequest_.isActive = false;
          await expiredRequest_.save();
        }
      }
      res.json(requests.requests);
    } catch (error) {
      console.log("");
      // return res.status(400).json({ error: err.message });
    }
  },

  getTranslatorAcceptedRequests: async (req, res) => {
    try {
      // console.log("------- UserID: ", req.query.userID);
      let accepted = await User.findOne({_id: req.query.userID}).populate([{
        path: 'translationActivity.accepted',
        model: 'Request',
        populate: {
          path: 'author',
          model: 'User'
        }
      }]);
      // console.log("Accepted Requests", accepted.translationActivity.accepted);
      res.json(accepted.translationActivity.accepted);
    } catch (error) {
      console.log("Error getting the accepted requests");
      return res.status(400).json({ error: err.message });
    }
  },

  getUserAcceptedRequests: async (req, res) => {
    try {
      let userRequests = await User.findOne({_id: req.query.userID})
      .populate({
        path : 'requests',
        match : {'acceptedTranslator' : {$ne: null}}
        , populate : {
          path: 'acceptedTranslator',
          model: 'User'
        }
      });
      res.json(userRequests.requests);
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  },

  getTranslatorsMatchedRequests: async(req, res) => {
    try {
      //get matchedRequests that are active to the particular translators
      let matchedRequests = await User.findOne({_id: req.query.userID})
      .populate([{
        path: 'matchedRequests',
        model: 'Request',
        populate: {
          path: 'author',
          model: 'User'
        }
      }]);
      res.json(matchedRequests.matchedRequests);
      // console.log("matchedRequests for a particular user:\t", matchedRequests.matchedRequests)
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  updateUserInfo: async (req, res) => {
    try {
      const { user, name, email, password, languageFrom, 
            languageTo, proofRead, femaleTranslator, image, timezone } = req.body;
      
      const hashed_password = await bcrypt.hash(password, 10);
      
      await User.updateOne( {_id: user._id}, {$set: {"name": name, "email": email, "password": hashed_password, "languageFrom": languageFrom, "languageTo": languageTo, "proofRead": proofRead, "femaleTranslator": femaleTranslator, "image": image, "timezone": timezone}});
      return res.status(201).json({ message: "User updated succesfully!" });
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  },

  subscribe: async (req, res) => {
    const { subscription, userId } = req.body;
    // console.log(subscription, userId);
    try {
      let newSubscription = new Subscription({
        user: userId,
        subscription: subscription
      });
      await newSubscription.save();
      return res.status(201).json({ message: "Push Notifications subscription added succesfully!" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

}

module.exports = UserController;
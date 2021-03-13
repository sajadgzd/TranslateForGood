const User = require("../models/user");
const Request = require("../models/request");
const bcrypt = require("bcryptjs");
const moment = require('moment-timezone');
const weigths = {timezoneW: 0.7, activityW: 0.3};
const N = 1;

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

const isStillActive = async (requestID) => {
  try {
    let request = await Request.findOne({_id: requestID});
    return request.isActive;
  } catch (error) {
    return res.status(400).json({ error: err.message });
  }
  
}

const isPassedDue = (dueTimeString) => {
  console.log('isPassedDue returns ', moment(dueTimeString, moment.HTML5_FMT.DATETIME_LOCAL_MS) < moment());
  return moment(dueTimeString, moment.HTML5_FMT.DATETIME_LOCAL_MS) < moment();
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
      } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
      }
      
      
      while (isStillActive(requestID) && !isPassedDue(req.query.dueDateTime)) {
        pointerToNotNotified = 0;

        try {
          // Filter by basic parameters
          if(req.query.femaleTranslatorBool == "true" && req.query.documentProofReadingBool == "false"){
            console.log("female translation requested");
            matchedTranslators = await User.find({languageFrom: req.query.languageFrom, languageTo: req.query.languageTo, femaleTranslator: req.query.femaleTranslatorBool});
            // res.json(matchedTranslators);
            // console.log("The matchedTranslators for particular request: ", matchedTranslators);
          }else if(req.query.femaleTranslatorBool == "true" && req.query.documentProofReadingBool == "true"){
            console.log("female translation requested and document profreading requested");
            matchedTranslators = await User.find({languageFrom: req.query.languageFrom, languageTo: req.query.languageTo, femaleTranslator: req.query.femaleTranslatorBool, proofRead: req.query.languageFrom});
            // res.json(matchedTranslators);
          }else if(req.query.femaleTranslatorBool == "false" && req.query.documentProofReadingBool == "true"){
            console.log("document profreading requested");
            matchedTranslators = await User.find({languageFrom: req.query.languageFrom, languageTo: req.query.languageTo, proofRead: req.query.languageFrom});
            // res.json(matchedTranslators);
          } else {
            console.log("no female, no profread - requested");
            matchedTranslators = await User.find({languageFrom: req.query.languageFrom, languageTo: req.query.languageTo})
            console.log('ERR_HTTP_HEADERS_SENT appears on line 119');
            // res.json(matchedTranslators);
          }
        } catch (err) {
          console.log(err);
          return res.status(400).json({ error: err.message });
        }
        
        let potentialTranslators = [];
        // calculate UF, S for each translator
        for (let i = 0; i < matchedTranslators.length; i++) {
          let UF = getUtilityFunctionScore(matchedTranslators[i].translationActivity.acceptanceRate, matchedTranslators[i].timezone, request.author.timezone);
          let S = getTimeActivityScore(matchedTranslators[i].timezone);
          potentialTranslators.push({translator: matchedTranslators[i], Sscore: S, UFscore: UF});
        }
        // sort translators by S. If S is equal sort by UF
          potentialTranslators.sort(function (a, b) {   
            return b.Sscore - a.Sscore || b.UFscore - a.UFscore;
        });
        // notify batches of translators 
        while (pointerToNotNotified < potentialTranslators.length) {
          let diff = pointerToNotNotified + N > potentialTranslators.length ? potentialTranslators.length - pointerToNotNotified : N;

          for (let k = pointerToNotNotified; k < pointerToNotNotified + diff; k++){
            try {
              // check if translator already declined this request or was already notified
              if (!potentialTranslators[k].translator.translationActivity.declined.includes(requestID) && !potentialTranslators[k].translator.matchedRequests.includes(requestID)){
                console.log('Notifying the following translator: ', potentialTranslators[k].translator._id);
                // update matchedRequests for every matchedTranslators found.
                potentialTranslators[k].translator.matchedRequests.push(request);
                await potentialTranslators[k].translator.save();
                // update matchedTranslators for the new matchedRequest found.
                request.matchedTranslators.push(potentialTranslators[k].translator._id);
                await request.save();
              }
            } catch (err) {
              console.log(err);
              return res.status(400).json({ error: err.message });
            }     
          }
          // wait for 5 seconds
          console.log('waiting 5 sec before notifying next batch.');
          await new Promise(resolve => setTimeout(resolve, 5000)); 
  
          if (!isStillActive(requestID)) {
            console.log("Request accepted by someone");
            break;
          } 
          pointerToNotNotified += diff;
        }

        // wait for a 10 sec before repeating the cycle
        console.log('waiting 10sec before starting a new cycle.');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
      
      if (!isStillActive(requestID)) {
        console.log('Yay, someone accepted this request!');
      } else {
        console.log('Currently we are not able to find a matching translator. Would you like to resubmit or cancel?');
      }

    //   console.log("The matchedTranslators for particular request: ", matchedTranslators);
    //   console.log("The matchedRequest for all matchedTranslators: ", request);
  },

  // given user's id get all the requests they created
  // actually returns the whole user object with list of requests objects.
  // to get requests just do .request on the result of this query
  getUserRequests: async (req, res) => {
    try {
      let requests = await User.findOne({_id: req.params.id}).populate("requests"); 
      res.json(requests);
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
            languageTo, femaleTranslator, timezone } = req.body;
      
      const hashed_password = await bcrypt.hash(password, 10);
      
      await User.updateOne( {_id: user._id}, {$set: {"name": name, "email": email, "password": hashed_password, "languageFrom": languageFrom, "languageTo": languageTo, "femaleTranslator": femaleTranslator, "timezone": timezone}});
      return res.status(201).json({ message: "User updated succesfully!" });
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  }

}

module.exports = UserController;
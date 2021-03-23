const Request = require("../models/request");
const User = require("../models/user");
const Subscription = require("../models/subscription");
const webPush = require("web-push");

// Secure push notifications
const publicVapidKey = "BLeogzDBodY_tQFm-HGNxdttRxLIsW-NMLW6AUhFWpj7EYcGWodIQDjFwh4MIFkI3sPTafdgfflRV0DVZBjOb9E";
const privateVapidKey = "uvwXQFqV6DQbNs-4G7qX8dJY8n3-Hs7HbkFHp6RW9QA";
webPush.setVapidDetails(
  'mailto:someemail@gmail.com',
  publicVapidKey,
  privateVapidKey 
);


let RequestController = {

  getRequestById: async (req, res) => {
    try {
      let found = await Request.findOne({_id: req.params.id});
      console.log(found);
      res.json(found);
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  },

  getActive: async (req, res) => {
    try {
      let allRequests = await Request.find({isActive: true}).populate('author');
      res.json(allRequests);
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      let allRequests = await Request.find();
      res.json(allRequests);
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  },
 
  create: async(req, res) => {
    const { user, languageFrom, languageTo, dueDateTime,
            femaleTranslatorBool, documentProofReadingBool, 
            previousTranslatorInfo, isActive } = req.body;
    try {
      let request = new Request({
        author: user,
        languageFrom: languageFrom, 
        languageTo: languageTo,
        dueDateTime: dueDateTime,
        femaleTranslator: femaleTranslatorBool, 
        documentProofreading: documentProofReadingBool,
        isActive: isActive
      });
      let requestID;
      await request.save(function(err,doc) {
        requestID = doc.id;
        console.log("NEWLY CREATED REQUEST ID:\t", doc.id);
      });

      // update user's requests array
      let updatedUser = await User.findOne({_id: user._id});
      updatedUser.requests.push(request);
      await updatedUser.save();

      return res.status(201).json({ message: "New request created successfully!", requestID: requestID });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  onDeclined: async(req, res) => {
    const {requestID, declinedUserID} = req.body;
    try {
      // remove request from this translator's matching requests
      // add request to translator's declined requests
      let declinedTranslator = await User.findOne({_id: declinedUserID});
      declinedTranslator.matchedRequests.pull({_id: requestID });
      declinedTranslator.translationActivity.declined.push(requestID);   

      // recalculate translator's acceptance rate
      let total = declinedTranslator.translationActivity.accepted.length + declinedTranslator.translationActivity.declined.length + declinedTranslator.translationActivity.ignored.length;
      declinedTranslator.translationActivity.acceptanceRate = total != 0 ? declinedTranslator.translationActivity.accepted.length/total : 0;
      await declinedTranslator.save();
      return res.status(201).json({ message: "Request was declined successfully"});
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  onAccepted: async(req, res) => {
    const { requestID, acceptedUserID} = req.body;
    try {

      // update request from active to not active
      // update request: add acceptedTranslator
      let updatedRequest = await Request.findOne({_id: requestID}).populate('matchedTranslators');
      let authorID = updatedRequest.author;
      updatedRequest.isActive = false;
      updatedRequest.acceptedTranslator = acceptedUserID;
      await updatedRequest.save();

      // update Translator: add accepted request to translation activity
      let updatedAcceptedTranslator = await User.findOne({_id: acceptedUserID});
      updatedAcceptedTranslator.translationActivity.accepted.push(updatedRequest);
      await updatedAcceptedTranslator.save();

      // for each of the matched translators: remove request from matchedRequests list
      // and check if request is in declined/accepted. If yes - nothing. If no - add to 'ignored'
      let newlyUpdatedRequest = await Request.findOne({_id: requestID}).populate('matchedTranslators');
      let targetTranslators = newlyUpdatedRequest.matchedTranslators;

      for (let i = 0; i < targetTranslators.length; i++) {
        targetTranslators[i].matchedRequests.pull({_id: requestID });
        if (!targetTranslators[i].translationActivity.declined.includes(requestID) && !targetTranslators[i].translationActivity.accepted.includes(requestID) ){
          targetTranslators[i].translationActivity.ignored.push(requestID);   
        } 
        // calculate Activity Rate
        let total = targetTranslators[i].translationActivity.accepted.length + targetTranslators[i].translationActivity.declined.length + targetTranslators[i].translationActivity.ignored.length;
        targetTranslators[i].translationActivity.acceptanceRate = total != 0 ? targetTranslators[i].translationActivity.accepted.length/total : 0;
        await targetTranslators[i].save();
      }

      // send push notification to request's author
      let subscription = await Subscription.findOne({user: authorID});
      if (subscription) {

          webPush.sendNotification(subscription.subscription, JSON.stringify({title: 'TranslateForGood', body: 'Your request was accepted! Please click this notification to check it out.'}))
        .then(function() {
          console.log('Push Application Server - Notification sent to user', userID);
        }).catch(function() {
          console.log('ERROR in sending Notification to user', userID);
        }); 
      }

      return res.status(201).json({ message: "Request was accepted successfully"});
    } catch (err) {
      // console.log(err);
      return res.status(400).json({ error: err.message });
    }
  },

  deleteExpired: async(req, res) => {
    const { requestID } = req.body;
    try {
      await Request.deleteOne({_id: requestID});
      return res.status(201).json({ message: "Request deleted sucsessfully!"});
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

}


module.exports = RequestController;
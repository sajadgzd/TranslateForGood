const Request = require("../models/request");
const User = require("../models/user");


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
      // console.log(err);
      return res.status(400).json({ error: err.message });
    }
  },

  onAccepted: async(req, res) => {
    const { requestID, acceptedUserID} = req.body;
    try {

      // update request from active to not active
      // update request: add acceptedTranslator
      let updatedRequest = await Request.findOne({_id: requestID}).populate('matchedTranslators');
      updatedRequest.isActive = false;
      updatedRequest.acceptedTranslator = acceptedUserID;
      await updatedRequest.save();

      // update Translator: add accepted request to translation activity
      let updatedAcceptedTranslator = await User.findOne({_id: acceptedUserID});
      updatedAcceptedTranslator.translationActivity.accepted.push(updatedRequest);
      await updatedAcceptedTranslator.save();

      // for each of the matched translators: remove request from matchedRequests list
      // and check if request is in declined/accepted. If yes - nothing. If no - add to 'ignored'
      let targetTranslators = updatedRequest.matchedTranslators;
      for (let i = 0; i < targetTranslators.length; i++) {
        targetTranslators[i].matchedRequests.pull({_id: requestID });
        if (!targetTranslators[i].translationActivity.declined.includes(requestID) && !targetTranslators[i].translationActivity.accepted.includes(requestID) ){
          targetTranslators[i].translationActivity.ignored.push(requestID);   
        } 
        await targetTranslators[i].save();
      }

      return res.status(201).json({ message: "Request was accepted successfully"});
    } catch (err) {
      // console.log(err);
      return res.status(400).json({ error: err.message });
    }
  }

}


module.exports = RequestController;
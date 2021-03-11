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
      console.log('.....updating req');
      let updatedRequest = await Request.findOne({_id: requestID}).populate('matchedTranslators');
      updatedRequest.isActive = false;
      updatedRequest.acceptedTranslator = acceptedUserID;
      await updatedRequest.save();

      // update Translator: add accepted request to translation activity
      console.log('.....updating accepted user');
      let updatedAcceptedTranslator = await User.findOne({_id: acceptedUserID});
      console.log('updatedAcceptedTranslator is', updatedAcceptedTranslator);
      updatedAcceptedTranslator.translationActivity.accepted.push(updatedRequest);
      await updatedAcceptedTranslator.save();

      // // for each of the matched translators: remove request from matchedRequests list
      // // and check if request is in declined. If yes - nothing. If no - add to 'ignored'
      // console.log('.....updating matched users');
      // matchedTranslators = updatedRequest.matchedTranslators;
      // console.log('retrieved matched users are: ', matchedTranslators);
      // for (i = 0; i < matchedTranslators.length(); i++) {
      //   matchedTranslators[i].matchedRequests.pull({_id: requestID });
      //   if (!matchedTranslators[i].translationActivity.declined.includes(requestID)){
      //     matchedTranslators[i].translationActivity.accepted.push(requestID);
      //     await matchedTranslators[i].save();
      //   } 

      // }


      return res.status(201).json({ message: "Request was accepted successfully"});
    } catch (err) {
      // console.log(err);
      return res.status(400).json({ error: err.message });
    }
  }

}


module.exports = RequestController;
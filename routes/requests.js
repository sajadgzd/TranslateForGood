const router = require("express").Router();
const Request = require("../models/request");
const User = require("../models/user")


let RequestController ={
  getById: async (req, res) => {
    try {
      let request = await Request.find({_id: req.params.requestsId});
      res.json(request);
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

  getActive: async (req, res) => {
    try {
      let active = await Request.find({isActive: true});
      res.json(active);
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  },

  create: async(req, res) => {
    const { user, languageFrom, languageTo, femaleTranslatorBool, 
            urgentTranslatorBool, documentProofReadingBool,
            previousTranslatorInfo, isActive } = req.body;
    try {
      let request = new Request({
        author: user,
        languageFrom: languageFrom, 
        languageTo: languageTo,
        urgentTranslation: urgentTranslatorBool, 
        femaleTranslator: femaleTranslatorBool, 
        documentProofreading: documentProofReadingBool,
        isActive: isActive
      });
      await request.save();

      // update user's requests array
      let updatedUser = await User.findOne({_id: user._id});
      updatedUser.requests.push(request);
      await updatedUser.save();

      return res.status(201).json({ message: "New request created successfully!" });
    } catch (err) {
      // console.log(err);
      return res.status(400).json({ error: err.message });
    }
  }

}


module.exports = RequestController;
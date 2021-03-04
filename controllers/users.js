const User = require("../models/user");

let UserController = { 

  // get user by id
  getById: async (req, res) => {
    try {
      let found = await User.findOne({_id: req.params.id});
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
    try {
      if(req.query.femaleTranslatorBool == true){
      let matchedTranslators = await User.find({languageFrom: req.query.languageFrom, languageTo: req.query.languageTo, femaleTranslator: req.query.femaleTranslatorBool})
      res.json(matchedTranslators);
      console.log("The matchedTranslators for particular request: ",matchedTranslators);
      }
      else{
      let matchedTranslators = await User.find({languageFrom: req.query.languageFrom, languageTo: req.query.languageTo})
      res.json(matchedTranslators);
      console.log("The matchedTranslators for particular request: ",matchedTranslators);
      }
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
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

  updateUserInfo: async (req, res) => {
    try {
      const { user, name, email, languageFrom, 
            languageTo, femaleTranslator, timezone } = req.body;
      await User.updateOne( {_id: user._id}, {$set: {"name": name, "email": email, "languageFrom": languageFrom, "languageTo": languageTo, "femaleTranslator": femaleTranslator, "timezone": timezone}});
      return res.status(201).json({ message: "User updated succesfully!" });
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  }

}

module.exports = UserController;
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

  // get all existing users
  getTest: async (req, res) => {
    try {
      let allUsers = await User.find({femaleTranslator: false});
      res.json(allUsers);
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  },
  // given user's id get all the requests they created
  getUserRequests: async (req, res) => {
    try {
      let requests = await User.findOne({_id: req.params.userId}).populate("requests");
      res.json(requests);
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  }
}

module.exports = UserController; 
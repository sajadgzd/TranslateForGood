const router = require("express").Router();
const User = require("../models/user");


let UserController = {
  getById: async (req, res) => {
    try {
      let found = await User.find({_id: req.params.userId});
      res.json(found);
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      let allUsers = await User.find();
      res.json(allUsers);
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  },

  getUserRequests: async (req, res) => {
    try {
      let requests = await User.find({_id: req.params.userId}).populate("requests");
      res.json(requests);
    } catch (error) {
      return res.status(400).json({ error: err.message });
    }
  }
}

module.exports = UserController; 
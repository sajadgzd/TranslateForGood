const User = require("../models/user");
const Request = require("../models/request");
const bcrypt = require("bcryptjs");

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
      // let userEmail = JSON.parse(req.query.user).email;
      let requestID = req.query.newRequestID;
      console.log("req.query.newRequestID", requestID);

      if(req.query.femaleTranslatorBool == true){
        let matchedTranslators = await User.find({languageFrom: req.query.languageFrom, languageTo: req.query.languageTo, femaleTranslator: req.query.femaleTranslatorBool})
        
        let request = await Request.findOne({_id: requestID});
        
        // update matchedRequests for every matchedTranslators found.
        for (let i = 0; i < matchedTranslators.length; i++) {
            matchedTranslators[i].matchedRequests.push(request);
            await matchedTranslators[i].save();
        }

        res.json(matchedTranslators);
        // console.log("The matchedTranslators for particular request: ", matchedTranslators);
      }
      else {
        let matchedTranslators = await User.find({languageFrom: req.query.languageFrom, languageTo: req.query.languageTo})

        let request = await Request.findOne({_id: requestID});
        
        // update matchedRequests for every matchedTranslators found.
        for (let i = 0; i < matchedTranslators.length; i++) {
            matchedTranslators[i].matchedRequests.push(request);
            await matchedTranslators[i].save();
        }

        // update matchedTranslators for the new matchedRequest found.
        for (let i = 0; i < matchedTranslators.length; i++) {
          request.matchedTranslators.push(matchedTranslators[i]._id);
        }
        await request.save();


        res.json(matchedTranslators);
        console.log("The matchedTranslators for particular request: ", matchedTranslators);
        console.log("The matchedRequest for all matchedTranslators: ", request);

      }
    } catch (err) {
      console.log(err);
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
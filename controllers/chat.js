const Request = require("../models/request");
const User = require("../models/user");
const Chatroom = require("../models/chatroom");

let ChatroomController = {
 
  create: async(req, res) => {
    console.log("In CREATE");
    const { requestID } = req.body;
    let request = await Request.findOne({_id: requestID}).populate("author");
    let requester = request.author.name;
    let languageFrom = request.languageFrom;
    let languageTo = request.languageTo;
    request = await Request.findOne({_id: requestID}).populate("acceptedTranslator"); 
    let translator = request.acceptedTranslator.name;
    let name = requester + " - "+ translator + " (" + languageFrom+" - "+ languageTo+")";
    console.log(name);
    try {
      let chatroom = new Chatroom({
        name: name,
        request: requestID
      });
      await chatroom.save(function(err,doc) {
        let chatroomID = doc.id;
        console.log("NEWLY CREATED chatroom ID:\t", chatroomID);
      });

      return res.status(201).json({ message: "New chatroom created successfully!" });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  filterByRequest: async(req,res) => {
    
    try{
      let list = req.query.requestsList;
      let chatrooms = await Chatroom.find({request: { $in: list}, complete: {$eq: false}});
      // console.log("Accepted Requests", accepted.translationActivity.accepted);
      res.json(chatrooms);
      // return res.status(201).json({ message: "Filtered chatrooms by requests id sucsessfully!"});
    } catch (err){
      return res.status(400).json({error: err.message});
    }
  },

  deleteExpired: async(req, res) => {
    const { chatroomID } = req.body;
    try {
      await Chatroom.deleteOne({_id: chatroomID});
      return res.status(201).json({ message: "Chatroom deleted sucsessfully!"});
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  getAllChatrooms: async(req, res) => {
    const chatrooms = await Chatroom.find({});

    res.json(chatrooms);
  },

  getById: async(req, res) => {
    try{
      const chatroom = await Chatroom.findOne({_id: req.query.chatroomId});
      res.json(chatroom);
    } catch(err){
      return res.status(400).json({error: err.message});
    }
  },

  markComplete: async(req, res) => {
    const { chatroomId} = req.body;
    try {
      let chatroom = await Chatroom.findOne({_id: chatroomId});
      chatroom.complete = true;
      await chatroom.save();
      return res.status(201).json({ message: "Chatroom marked as complete sucsessfully!"});
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

}


module.exports = ChatroomController;
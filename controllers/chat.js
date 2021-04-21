const Request = require("../models/request");
const User = require("../models/user");
const Chatroom = require("../models/chatroom");

let ChatroomController = {
 
  create: async(req, res) => {
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

  deleteExpired: async(req, res) => {
    const { chatroomID } = req.body;
    try {
      await Chatroom.deleteOne({_id: chatroomID});
      return res.status(201).json({ message: "Chatroom deleted sucsessfully!"});
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

}


module.exports = ChatroomController;
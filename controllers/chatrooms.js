const Chatroom = require("../models/chatroom");

let ChatroomController = {
    createChatroom : async (req, res) => {
        const {name} = req.body;

        const chatroom = new Chatroom({
            name, 
        })

        await chatroom.save();

        res.json({
            message: "Chatroom created!"
         })
    },

    getAllChatrooms : async (req, res) => {
        const chatrooms = await Chatroom.find({});

        res.json({
            chatrooms
        })
    }
}

module.exports = ChatroomController;

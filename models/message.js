const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema(
  { 
    chatroom:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Chatroom'
    },

    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    message:{
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", MessageSchema);

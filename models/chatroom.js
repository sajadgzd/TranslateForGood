const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ChatroomSchema = new mongoose.Schema(
  { 
    name:{
        type: String
    },

    request: {
        type: Schema.Types.ObjectId, 
        ref: 'Request'
    },

    complete: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chatroom", ChatroomSchema);

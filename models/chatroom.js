const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ChatroomSchema = new mongoose.Schema(
  { 
      name : { 
        type : String,
        required : true,
        }
    }
);

module.exports = mongoose.model("Chatroom", ChatroomSchema);
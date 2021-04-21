const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema(
  { 
    chatroom : { 
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    user : { 
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: "User",
    },
    message : { 
        type : String,
        required : true,
    }
  }
);

module.exports = mongoose.model("Message", MessageSchema);
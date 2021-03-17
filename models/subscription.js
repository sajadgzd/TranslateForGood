const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const SubscriptionSchema = new mongoose.Schema(
    { 
        user:{
            type: Schema.Types.ObjectId, 
            ref: 'User'
        },

        endpoint: {
            type: String,
            unique: true,
            required: true
        },

        keys: {
            auth: String,
            p256dh: String,
          }
    }, 
    { timestamps: true }
);

module.exports = mongoose.model("subscriptions", SubscriptionSchema);

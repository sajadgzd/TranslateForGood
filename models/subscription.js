const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const SubscriptionSchema = new mongoose.Schema(
    { 
        user:{
            type: Schema.Types.ObjectId, 
            ref: 'User'
        },

        subscription: Schema.Types.Mixed
    }, 
    { timestamps: true }
);

module.exports = mongoose.model("subscriptions", SubscriptionSchema);

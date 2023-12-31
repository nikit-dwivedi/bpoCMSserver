const mongoose = require('mongoose');
const Schema = mongoose.Schema

const leadSchema = new Schema({
    leadId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        default: ""
    },
    serial: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    zone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "call_back", "not_answered", "completed", "failed"],
        default: "pending"
    },
    remark: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

const leadModel = mongoose.model("lead", leadSchema);
module.exports = leadModel;
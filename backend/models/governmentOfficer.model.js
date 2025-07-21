import mongoose, { Mongoose } from "mongoose";

Mongoose.schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /.+\@.+\..+/
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^\d{10}$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    role: {
        type: String,
        enum: ['worker', 'officer'],
        default: 'officer'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
const GovernmentOfficer = mongoose.model('GovernmentOfficer', Mongoose.schema);
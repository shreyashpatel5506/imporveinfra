import mongoose from 'mongoose';


const civilianSchema = new mongoose.Schema({
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
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
const civilians = mongoose.model('civilians', civilianSchema);
export default civilians;

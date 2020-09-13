const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const exerciseSchema = new mongoose.Schema({
    _id: { type: String, default: function genUUID() {
        return uuidv4();
    }},
    name: {
        type: String,
        required: true
    },
    calPerMin: {
        type: Number,
        required: true
    },
    met: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Exercise', exerciseSchema);
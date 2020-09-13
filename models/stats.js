const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const statsSchema = new mongoose.Schema({
    _id: { type: String, default: function genUUID() {
        return uuidv4();
    }},
    food: {
        type: Number,
        required: true
    },
    exercise: {
        type: Number,
        required: true
    },
    base: {
        type: Number,
        required: true
    },
    cico: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Stats', statsSchema);
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const foodSchema = new mongoose.Schema({
    _id: { type: String, default: function genUUID() {
        return uuidv4();
    }},
    food: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Food', foodSchema);
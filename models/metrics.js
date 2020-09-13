const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const metricsSchema = new mongoose.Schema({
    _id: { type: String, default: function genUUID() {
        return uuidv4();
    }},
    weight: {
        type: Number,
        required: true
    },
    goal: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    dob: {
        type: Number,
        required: true
    },
    activity: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Metrics', metricsSchema);
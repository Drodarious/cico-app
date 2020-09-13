const express = require('express');
const router = express.Router();
const MetricsModel = require('../models/metrics');


// Search Metrics
/*router.post('/', async (request, response) => {
    try {
        const stats = await MetricsModel.find(request.body.query);
        response.json(stats);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});*/


// Add Metrics
router.post('/add', async (request, response) => {

    const metrics = new MetricsModel({
        id: request.body.id,
        weight: request.body.weight,
        goal: request.body.goal,
        height: request.body.height,
        dob: request.body.dob,
        activity: request.body.activity
    });

    const update = {
        weight: request.body.weight,
        goal: request.body.goal,
        height: request.body.height,
        dob: request.body.dob,
        activity: request.body.activity
    };

    const options = {
        upsert: true
    };

    const callback = (err, docs) => {

        if (err) {
            console.log('err',err);
        } else {
            console.log('docs',docs);
        }

    };

    console.log('request.body.query',request.body.query);
    console.log('update',update);

    try {
        const newStats = await MetricsModel.findOneAndUpdate(request.body.query, update, options, callback);
        response.status(201).json(newStats);
    } catch (error) {
        response.status(400).json({ message: error.message });
    }

});

module.exports = router;
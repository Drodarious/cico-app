const express = require('express');
const router = express.Router();
const StatsModel = require('../models/stats');


// Search Stats
router.post('/', async (request, response) => {
    try {
        const stats = await StatsModel.find(request.body.query);
        response.json(stats);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


// Add Stats
router.post('/add', async (request, response) => {

    const stats = new StatsModel({
        id: request.body.id,
        food: request.body.food,
        exercise: request.body.exercise,
        base: request.body.base,
        cico: request.body.cico,
        date: request.body.date
    });

    const update = {
        food: request.body.food,
        exercise: request.body.exercise,
        base: request.body.base,
        cico: request.body.cico,
        date: request.body.date
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
        const newStats = await StatsModel.findOneAndUpdate(request.body.query, update, options, callback);
        response.status(201).json(newStats);
    } catch (error) {
        response.status(400).json({ message: error.message });
    }

});

module.exports = router;
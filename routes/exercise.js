const express = require('express');
const router = express.Router();
const ExerciseModel = require('../models/exercise');


// Search Exercise
router.post('/', async (request, response) => {
    try {
        const exercise = await ExerciseModel.find(request.body.query);
        response.json(exercise);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


// Add Exercise
router.post('/add', async (request, response) => {

    const exercise = new ExerciseModel({
        name: request.body.name,
        calPerMin: request.body.calPerMin,
        met: request.body.met,
        duration: request.body.duration,
        photo: request.body.photo
    });

    try {
        const newExercise = await exercise.save();
        response.status(201).json(newExercise);
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
});


// Remove Exercise
router.post('/remove', async (request, response) => {
    try {
        const success = await ExerciseModel.findByIdAndDelete(request.body.id);
        response.status(200).json(success);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

module.exports = router;
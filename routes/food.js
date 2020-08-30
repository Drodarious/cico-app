const express = require('express');
const router = express.Router();
const FoodModel = require('../models/food');


// Search Food
router.post('/', async (request, response) => {
    try {
        console.log(request.body.query);
        //const query = JSON.parse(request.body.query);
        const food = await FoodModel.find(request.body.query);
        response.json(food);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


// Add Food
router.post('/add', async (request, response) => {

    const food = new FoodModel({
        id: request.body.id,
        food: request.body.food,
        date: request.body.date,
    });

    try {
        const newFood = await food.save();
        response.status(201).json(newFood);
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
});

module.exports = router;
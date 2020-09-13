require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => { console.log(error); });
db.once('open', () => { console.log('Connected to Database'); });

app.listen(3000, () => console.log('Server started on port 3000'));

app.use(cors())
app.use(express.json());

const foodRouter = require('./routes/food');
app.use('/food', foodRouter);

const exerciseRouter = require('./routes/exercise');
app.use('/exercise', exerciseRouter);

const statsRouter = require('./routes/stats');
app.use('/stats', statsRouter);
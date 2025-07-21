import dotenv from 'dotenv';
import express from 'express';
import connectDB from './lib/db.js';
import cors from 'cors';

const app = express();
// Load environment variables
dotenv.config();

//connect with mongodb
connectDB();

app.use('/', express.static('public'));
app.use(cors());

app.send((req, res) => {
    res.send('Welcome to the Improve Infra Backend!');
});
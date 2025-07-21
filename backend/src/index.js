import dotenv from 'dotenv';
import express from 'express';
import connectDB from '../lib/db.js'; // Adjust the path as necessary
import cors from 'cors';

const app = express();
//ANCHOR Load environment variables
dotenv.config();

//LINK connect with mongodb
connectDB();

app.use('/', express.static('public'));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to the Improve Infra Backend!');
});
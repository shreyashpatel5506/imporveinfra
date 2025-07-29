import dotenv from 'dotenv';
import express from 'express';
import connectDB from './lib/db.js'; // Adjust the path as necessary
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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;

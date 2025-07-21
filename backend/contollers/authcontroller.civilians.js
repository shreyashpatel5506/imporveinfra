import express from 'express';
import civilians, { Civilians } from '../models/civilians.model.js';
const router = express.Router();

//TODO create a new civilians 
export const addCivilians = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const newCivilian = new Civilians({
            username,
            email,
            phone,
            password,
            createdAt: new Date()
        });
        await newCivilian.save();

        //NOTE Check if civilian already exists
        if (Civilians.findOne({ email })) {
            return res.status(400).json({ message: 'Civilian already exists' });
        }
        res.status(201).json({ message: 'Civilian added successfully', civilian: newCivilian });

    } catch (error) {
        console.error('Error adding civilian:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
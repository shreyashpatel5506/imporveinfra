import { protectroute } from "../middlewear/auth.middlewear.js";
import express from 'express';

import { sendOtp, verifyOTP, register, login, forgotpassword, updateProfile } from '../controllers/authcontroller.js';

const router = express.Router();
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOTP);
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotpassword);
router.put('/update-profile', protectroute, updateProfile);
export default router;


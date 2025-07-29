import express from 'express';
import { User as Officer } from '../../models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dns from 'dns/promises';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL,
        pass: PASSWORD,
    },
});
const otpStorage = new Map();
const sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required", success: false });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(422).json({ message: "Invalid email format", success: false });

    try {
        const domain = email.split("@")[1];
        const mxRecords = await dns.resolveMx(domain);
        if (!mxRecords || mxRecords.length === 0) {
            return res.status(452).json({ message: "Email domain does not accept mail", success: false });
        }
    } catch (dnsError) {
        return res.status(452).json({ message: "Invalid or unreachable email domain", success: false });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const mailOptions = {
        from: `Improve infra for the civilians <${mailUser}>`,
        to: email,
        subject: "🔐 Your improve infra service  OTP Code",
        html: `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="color: #333;">🔐 Email Verification</h2>
            <p>Hello,</p>
            <p>Thank you for using <strong>Improve Infra</strong>. Please use the OTP below to verify your email address:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; background-color: #4CAF50; color: white; font-size: 24px; padding: 12px 24px; border-radius: 8px; letter-spacing: 4px;">
                    ${otp}
                </span>
            </div>
            <p>This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
            <p style="margin-top: 30px;">Regards,<br><strong>Improve Infra Team</strong></p>
        </div>`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        if (info.accepted.includes(email)) {
            otpStorage.set(email, { otp, verified: false });
            return res.status(200).json({ message: "OTP sent", success: true });
        } else {
            return res.status(452).json({ message: "SMTP did not accept the email", success: false });
        }
    } catch (err) {
        return res.status(502).json({ message: "Failed to send email", success: false });
    }
};

const verifyOTP = (req, res) => {
    const { email, otp } = req.body;
    const record = otpStorage.get(email);
    if (record && record.otp === otp) {
        otpStorage.set(email, { ...record, verified: true });
        return res.status(200).json({ message: "OTP verified", success: true });
    }
    return res.status(400).json({ message: "Invalid OTP", success: false });
};

const register = async (req, res) => {
    const { username, email, phone, password } = req.body;
    if (!username || !email || !phone || !password) {
        return res.status(400).json({ message: "All fields are required", success: false });
    }

    const existingUser = await Officer.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "Email already registered", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newOfficer = new Officer({
        username,
        email,
        phone,
        password: hashedPassword
    });

    try {
        await newOfficer.save();
        return res.status(201).json({ message: "Registration successful", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required", success: false });
    }

    const OfficerRecord = await Officer.findOne({ email });
    if (!OfficerRecord) {
        return res.status(404).json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, OfficerRecord.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ id: OfficerRecord._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful", token, success: true });
};

const forgotpassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required", success: false });
    }

    const OfficerRecord = await user.findOne({ email });
    if (!OfficerRecord) {
        return res.status(404).json({ message: "User not found", success: false });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const mailOptions = {
        from: `Improve infra for the civilians <${mailUser}>`,
        to: email,
        subject: "🔐 Password Reset OTP",
        html: `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="color: #333;">🔐 Password Reset</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password. Please use the OTP below to proceed:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; background-color: #4CAF50; color: white; font-size: 24px; padding: 12px 24px; border-radius: 8px; letter-spacing: 4px;">
                    ${otp}
                </span>
            </div>
            <p>This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
            <p style="margin-top: 30px;">Regards,<br><strong>Improve Infra Team</strong></p>
        </div>`
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        if (info.accepted.includes(email)) {
            otpStorage.set(email, { otp, verified: false });
            return res.status(200).json({ message: "OTP sent for password reset", success: true });
        } else {
            return res.status(452).json({ message: "SMTP did not accept the email", success: false });
        }
    } catch (err) {
        return res.status(502).json({ message: "Failed to send email", success: false });
    }
}

const updateProfile = async (req, res) => {
    const { username, email, phone } = req.body;
    const userId = req.user.id; // Assuming user ID is stored in req.user after authentication

    if (!username || !email || !phone) {
        return res.status(400).json({ message: "All fields are required", success: false });
    }

    try {
        const updatedUser = await user.findByIdAndUpdate(userId, { username, email, phone }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        return res.status(200).json({ message: "Profile updated successfully", user: updatedUser, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false });
    }
}
export { sendOtp, verifyOTP, register, login, forgotpassword, updateProfile };

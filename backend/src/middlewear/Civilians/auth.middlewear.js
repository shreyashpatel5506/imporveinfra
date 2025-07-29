import jwt from 'jsonwebtoken';
import { User as Civilians } from './../../models/civilans/User.model.js'

export const civiliansProtectRoute = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token", success: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Civilians.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed", success: false });
    }
}
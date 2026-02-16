const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);
        req.user = decoded.user || decoded; // Fallback for old/simple tokens
        next();
    } catch (err) {
        console.error('JWT Verification Error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const admin = (req, res, next) => {
    console.log('Checking admin role for user:', req.user);
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

module.exports = { auth, admin };

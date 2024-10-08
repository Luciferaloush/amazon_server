const jwt = require('jsonwebtoken');
const User = require('../models/user');

const admin = async (req, res, next) => {
  try {
    const token = req.header('token');
    if (!token)
      return res.status(401).json({ msg: "No token available" });

    const verified = jwt.verify(token, 'passwordKey');
    if (!verified) return res.status(401).json({ msg: "Token verification failed" });

    const user = await User.findById(verified.id);
    if (user.type === "user" || user.type === "seller") {
      return res.status(401).json({ msg: "you're not admin" });
    }

    req.user = verified.id;
    req.token = token;
    next();
  } catch (e) {
    res.status(500).json({ msg: "Error: " + e.message });
  }
};

module.exports = admin;
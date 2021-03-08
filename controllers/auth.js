const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let authController = {
  
  // register new user
  register: async (req, res) => { 
    const { name, email, password, languageFrom, languageTo, proofRead, femaleTranslator, timezone } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: "User already exists" });
      }
      const hashed_password = await bcrypt.hash(password, 10);
      user = new User({
        name,
        email,
        password: hashed_password,
        languageFrom,
        languageTo,
        proofRead,
        femaleTranslator,
        timezone,
      });
      await user.save();
      return res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
      // console.log(err);
      return res.status(400).json({ error: err.message });
    }
  },

  // login user
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "No user found. Invalid credentials for user" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials for the found user" });
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // user successfully logged in
      return res.status(200).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        },
      });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  // currently logged in user
  current: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password -__v");
      res.json(user);
    } catch (error) {
      // console.log(err);
      return res.status(400).json({ error: err.message });
    }
  }
}

module.exports = authController;

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!(name || email || password)) {
      res.status(400).json({ message: "All input are required" });
    }

    const registeredUser = await User.findOne({ email });

    if (registeredUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
          },
        });
      }
    );
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: `Unable to register user. Please try again.
        Error: ${err}`,
    });
  }
};

const login = async (res, req) => {
  try {
    const { email, password } = req.body;
    if (!(email || password)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return res.status(400).json({ message: "Incorrect user credentials" });
    }

    jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
          user: {
            id: user._id,
            name: user.name,
          },
        });
      }
    );
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: `Unable to log user in. Please try again.
              Error: ${err}`,
    });
  }
};

const get_user = async (res, req) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (user) return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: `Unable to get user. Please try again.
                    Error: ${err}`,
    });
  }
};

module.exports = { register, login, get_user };

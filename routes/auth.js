const express = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken")
const auth = require("../middlewares/auth");

const authRouter = express.Router();


// SignUp Router
authRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Use `await` to correctly fetch the existing user
    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({ msg: "User with the same email already exists!" });
    }

    const passwordLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!passwordLength || !hasUpperCase || !hasLowerCase || !hasDigit || !hasSpecialChar) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }

    const hashPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      name,
      email,
      password : hashPassword,
    });

    user = await user.save();

    res.status(201).json({msg : "Your account is successfully created "});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// SignIn Router
authRouter.post("/signin", async (req,res) => {
     try {

       const jwtSecret = "Abhi@123456789";

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({msg: "User with this email does not exist !"});
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({msg : "Incorrect password"});
        }
        const token = jwt.sign({ id: user._id }, jwtSecret);
         res.json({ msg : "Success", ...user._doc,token,  });
     } catch (e) {
        res.status(500).json({error: e.message});
     }
});

// check IsValid

authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const jwtSecret = "Abhi@123456789";

    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, jwtSecret);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get user data
authRouter.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});

module.exports = { authRouter };



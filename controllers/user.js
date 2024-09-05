import User from "../models/user.js";
import { uniqId } from "../uniqId.js";
import { sendToken } from "../utils/jwt.js";
import bcrypt from 'bcryptjs';
import randomstring from "randomstring";
import { getUserByRandomString, getUserByEmail } from "../utils/user.js"
import { sendEmail } from "../utils/email.js"


const userRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      mobileNumber,
      password,
    } = req.body;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }


    if (
      !name ||
      !email ||
      !mobileNumber ||
      !password
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const allUsers = await User.find({});

    const referralId = await uniqId();
    // console.log(referralId);

    let referredBy = req.body.referredBy;

    const referralUser = await User.findOne({
      referralId: req.body.referredBy,
    });

    if (!referralUser) {
      referredBy = '';
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({
      name,
      email,
      mobileNumber,
      referralId,
      referredBy,
      password: hashedPassword,
    });

    // console.log(newUser);

    for (const singleUser of allUsers) {
      if (singleUser.referralId === referredBy) {
        singleUser.referredPeoples.push(referralId);

        await singleUser.save();
      }
    }

    const savedUser = await newUser.save();
    return res.status(200).json(savedUser);
  } catch (err) {
    console.error('Error saving user:', err);
    if (err.code === 11000) {
      // Check which field caused the duplicate key error
      if (err.keyPattern && err.keyPattern.email) {
        res.status(400).json({ message: 'Email is already registered' });
      } else {
        res.status(400).json({ message: 'Duplicate key error' });
      }
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};


const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Correct the shadowing issue
    let user = await User.findOne({ email: email });
    // console.log(user);

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found, please check email..." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log('Retrieved User:', user);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = sendToken(user);

    return res
      .status(200)
      .json({
        message: "User logged in successfully...",
        data: user,
        token,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    // Check if the user exists based on their email
    const user = await getUserByEmail(req);

    if (!user) {
      res.status(404).json({ error: "User not found. Please register." });
    }

    // Generate a random reset token
    const resetToken = randomstring.generate(10); // Generate a 10-character random string
    const resetTokenExpires = Date.now() + 3600000; // Expires in 1 hour

    // Update the user with the reset token and its expiration time
    user.randomString = resetToken;
    user.randomStringExpires = resetTokenExpires;
    await user.save();

    const resetLink = `${process.env.BASE_URL}/verifyRandomString/${resetToken}`;

    // HTML content for the email
    const htmlContent = `
        <p>Hello ${user.firstName},</p>
        <p>You have requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetLink}">
          <button style="padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Reset Your Password
          </button>
        </a>
      `;

    // Send the email with the password reset link
    await sendEmail(user.email, "Password Reset", htmlContent);

    return res.status(200).json({
      message: "Password reset link sent to your email",
      resetToken: resetToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const resetpassword = async (req, res, next) => {
  try {
    const user = await getUserByRandomString(req);

    if (!user) {
      res.status(400).json({ error: "Invalid Link" });
    }

    // Check if the reset token has expired (assuming the token expires after 1 hour)
    if (user.randomStringExpires < Date.now()) {
      res.status(400).json({ error: "Password reset link has expired" });
    }
    // Generate a new hashed password using the newPassword
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // Update the user's password
    user.password = hashedPassword;

    // Clear the random string and its expiration
    user.randomString = undefined;
    user.randomStringExpires = undefined;

    // Save the user with the updated password
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



export {
  userRegister,
  getAllUsers,
  UserLogin,
  forgotPassword,
  resetpassword,
  getSingleUser
};

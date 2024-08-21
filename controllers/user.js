import User from "../models/user.js";
import { uniqId } from "../uniqId.js";
import { sendToken } from "../utils/jwt.js";
import bcrypt from 'bcryptjs';


const userRegister = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      dob,
      gender,
      email,
      mobileNumber,
      alternateMobileNumber,
      adhaarNumber,
      voterId,
      district,
      constituency,
      familyMembers,
      voters,
      address,
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

    const aldreadyAadharExist = await User.findOne({ adhaarNumber });

    if (aldreadyAadharExist) {
      return res
        .status(400)
        .json({ message: 'Aadhaar number is already registered' });
    }

    if (
      !name ||
      !fatherName ||
      !dob ||
      !gender ||
      !email ||
      !mobileNumber ||
      !alternateMobileNumber ||
      !adhaarNumber ||
      !voterId ||
      !district ||
      !constituency ||
      !address ||
      !familyMembers ||
      !voters ||
      !password
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const allUsers = await User.find({});

    const referralId = await uniqId();

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
      fatherName,
      dob,
      gender,
      email,
      mobileNumber,
      alternateMobileNumber,
      adhaarNumber,
      voterId,
      district,
      constituency,
      familyMembers,
      voters,
      address,
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
      } else if (err.keyPattern && err.keyPattern.adhaarNumber) {
        res.status(400).json({ message: 'Aadhaar number is already registered' });
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
    console.log('Retrieved User:', user);
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



export { userRegister, getAllUsers, UserLogin  };

import User from "../models/user.js";
import { uniqId } from "../uniqId.js";

const userRegister = async (req, res) => {
  const {
    name,
    fatherName,
    dob,
    gender,
    email,
    mobileNumber,
    adhaarNumber,
    voterId,
    district,
    constituency,
    address,
  } = req.body;

  const allUsers = await User.find({});

  const referralId = await uniqId();

  let referredBy = req.body.referredBy;

  const referralUser = await User.findOne({
    referralId: req.body.referredBy,
  });

  if (!referralUser) {
    referredBy = "";
  }

  // Create a new user
  const newUser = new User({
    name,
    fatherName,
    dob,
    gender,
    email,
    mobileNumber,
    adhaarNumber,
    voterId,
    district,
    constituency,
    address,
    referralId,
    referredBy,
  });

  console.log(newUser);

  try {
    for (const singleUser of allUsers) {
      if (singleUser.referralId === referredBy) {
        singleUser.referredPeoples.push(referralId);

        await singleUser.save();
      }
    }

    const savedUser = await newUser.save();
    return res.status(200).json(savedUser);
  } catch (err) {
    console.error("Error saving user:", err);
    if (err.code === 11000 && err.keyPattern && err.keyPattern.adhaarNumber) {
      res.status(400).json({ message: "Aadhaar number is already registered" });
    } else {
      res.status(500).json({ message: err.message });
    }
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

export { userRegister, getAllUsers };

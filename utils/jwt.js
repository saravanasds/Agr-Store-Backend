import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

// Configuring the environmental variable
dotenv.config();

// Function to generate a JWT token
function generateToken(user) {
  const { _id, email } = user;
  const { JWT_SECRET, JWT_EXPIRE } = process.env;

  const payload = {
    _id,
    email,
  };

  // const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRE });
  const token = jwt.sign(payload, JWT_SECRET);

  return token;
}

// Function to verify and decode a JWT token
function verifyToken(token) {
  try {
    // const decoded = jwt.verify(token, secretKey);
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

// Function to send a JWT token
function sendToken(user) {
  const token = generateToken(user);
  return token;
}

// Function to generate an activation token
function generateActivationToken() {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
}

export { generateToken, verifyToken, sendToken, generateActivationToken };

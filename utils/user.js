import User from "../models/user.js";

export function generateReferralId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let activationToken = "";
  for (let i = 0; i < 10; i++) {
    activationToken += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return activationToken;
}

export function getUserByEmail(request) {
  const email = request.body.email;
  if (email) {
    return User.findOne({
      email,
    });
  }
  return null;
}


export function getUserByRandomString(request) {
  const randomString = request.params.randomString;
  if (randomString) {
    return User.findOne({
      randomString,
    });
  }
  return null;
}
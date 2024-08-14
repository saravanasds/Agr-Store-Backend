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
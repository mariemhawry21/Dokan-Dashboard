const bcrypt = require("bcrypt");

async function hashPassword(plainPassword) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    console.log("Hashed Password:", hashedPassword);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    return null;
  }
}


hashPassword("password@123");

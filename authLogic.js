const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");



class User {
  constructor({
    id,
    username,
    firstName,
    lastName,
    gender,
    phoneNumber,
    image,
    token,
  }) 
  {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.phoneNumber = phoneNumber;
    this.image = image;
    this.token = token;
  }
}
class Auth {
  filePath = path.join(__dirname, "data.json");

  async hashPassword(password) {
    const saltRounds = 9; // Number of salt rounds (higher is more secure, but slower)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
  async comparePassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }
  async readJson(filePath) {
    let data = [];
    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath);
      data = JSON.parse(rawData); 
    }
    return data;
  }
  async writeJson(filePath, data) {
    const jsonData = JSON.stringify(data, null, 2);

    fs.writeFile(filePath, jsonData, (err) => {
      if (err) {
        console.error("Error writing JSON:", err);
      } else {
        console.log("JSON data written to data.json");
      }
    });
  }
  isExist(data, user, feild) {
    return data.find((e) => e[feild] === user[feild]);
  } 
  validate(user, users) {
    const errors = {};

    // firstName
    if (
      !user.firstName ||
      typeof user.firstName !== "string" ||
      user.firstName.trim().length < 2 ||
      user.firstName.trim().length > 50
    ) {
      errors.firstName =
        "First name is required, must be a string, and between 2 and 50 characters.";
    }
    // lastName
    if (
      !user.lastName ||
      typeof user.lastName !== "string" ||
      user.lastName.trim().length < 2 ||
      user.lastName.trim().length > 50
    ) {
      errors.lastName =
        "Last name is required, must be a string, and between 2 and 50 characters.";
    }

    // gender
    if (!user.gender || !["Male", "Female", "Other"].includes(user.gender)) {
      errors.gender =
        "Gender is required and must be one of: Male, Female, Other.";
    }

    // phoneNumber (basic check - consider a more robust library for phone number validation)
    if (
      user.phoneNumber &&
      (typeof user.phoneNumber !== "string" ||
        user.phoneNumber.trim().length < 10)
    ) {
      errors.phoneNumber =
        "Phone number must be a string and at least 10 digits.";
    }

    //username
    if (!user.username) {
      errors.username = "Username is required.";
    } else if (user.username.length < 5 || user.username.length > 20) {
      errors.username = "Username must be between 5 and 20 characters long.";
    } else if (!/^[a-zA-Z0-9._]+$/.test(user.username)) {
      errors.username =
        "Username can only contain alphanumeric characters, periods (.), and underscores (_).";
    } else if (this.isExist(users, user, "username")) {
      errors.username = "Username is already exist";
    }

    // image (basic check)
    if (user.image && typeof user.image !== "string") {
      errors.image = "Image must be a string (likely a path or URL).";
    }

    return errors;
  }
  secretKey = "swe"; // Get the secret key from environment variables

  generateToken(user) {
    const payload = {
      userId: user.id, // Or a unique user identifier
      username: user.username,
      phoneNumber: user.phoneNumber,
    };

    const options = {
      expiresIn: "1h", // Token expiration time (adjust as needed)
    };

    try {
      const token = jwt.sign(payload, this.secretKey, options);
      return token;
    } catch (error) {
      console.error("Error generating token:", error);
      return null; // Or throw the error, depending on your error handling strategy
    }
  }
  async register(user) {
    const users = await this.readJson(this.filePath);
    const validation = this.validate(user, users);
    if (Object.keys(validation).length > 0) {
      return { ok: false, validation: validation };
    }
    const token = this.generateToken(user);
    users.push(
      new User({
        ...user,
        id: users.length + 1,
        token: token,
      })
    );
    this.writeJson(this.filePath, users);
    return { ok: true };
  }
  async login({ email, password }) {
    const users = await this.readJson(this.filePath);
    console.log(password);
    console.log(email);
    for (let i = 0; i < users.length; i++) {
      const e = users[i];
      const passwordMatch = await this.comparePassword(password, e.password);
      if (e.email === email && passwordMatch) {
        console.log("matched");
        return { ok: true, user: { password, ...e } };
      }
    }
    return { ok: false, message: "email or password isn't correct"};
  }
}
module.exports = Auth;

import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = "kermenAlu";

export const loginHandler = async (req, res) => {
  console.log("login in process");
  const { username, password, isAdmin } = req.body;
  console.log(username, password, isAdmin);
  try {
    if (isAdmin) {
      console.log("yes is Admin");
      const [rows] = await pool.query(
        "SELECT * FROM user_table WHERE User_Name = ? AND User_Type = ?",
        [username, "admin"]
      );

      console.log("rows", rows[0]);

      if (rows.length === 0) {
        return res.status(400).json({ msg: "No such admin" });
      }

      const admin = rows[0];
      console.log("admin", admin);
      const isMatch = await bcrypt.compare(password, admin.Password);
      console.log("rows", rows[0]);
      if (isMatch) {
        // req.session.userInfo = { isClient: isClient, userData: client };
        // console.log(req.session.userData);

        const token = await generateAccessToken({
          userName: admin.User_Name,
          userType: admin.User_Type,
        });
        console.log("token is:", token);
        res.cookie("token", token, {
          httpOnly: false, // only from http not from the javascript
          secure: process.env.NODE_ENV === "production", // check wether it is in production or development
          maxAge: 24 * 60 * 60 * 1000, // token live only for 24 hours
        });
        console.log("successful");
        return res.status(200).json({ message: "logged in successfull" });
      } else {
        return res.status(400).json({ msg: "Login failed" });
      }
    } else {
      // if the login user is not admin
      const [rows] = await pool.query(
        "SELECT * FROM user_table WHERE User_Name = ? AND User_Type = ?",
        [username, "user"]
      );

      if (rows.length === 0) {
        return res.status(400).json({ msg: "No such user" });
      }

      const user = rows[0];
      console.log("user", user);
      const isMatch = await bcrypt.compare(password, user.Password);

      if (isMatch) {
        // req.session.userInfo = { isClient: isClient, userData: freelancer };
        // console.log(req.session.userData);
        const token = await generateAccessToken({
          userName: user.User_Name,
          userType: user.User_Type,
        });
        console.log("token is:", token);
        res.cookie("token", token, {
          httpOnly: false, // only from http not from the javascript
          secure: process.env.NODE_ENV === "production", // check wether it is in production or development
          maxAge: 24 * 60 * 60 * 1000, // token live only for 24 hours
        });
        console.log("successful");
        return res.status(200).json({ message: "logged in successfull" });
      } else {
        return res.status(400).json({ msg: "Login failed" });
      }
    }
  } catch (error) {
    console.log("error in login handler", error);
  }
};

export const createUserHandler = async (req, res) => {
  const { username, password, isAdmin, adminPass } = req.body;
  if (adminPass !== "AluKermen") {
    return res.status(400).json({ message: "Register Password is wrong" });
  }
  console.log(username, password, isAdmin);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const [rows] = await pool.query(
      "SELECT * FROM user_table WHERE User_Name = ?",
      [username]
    );
    if (rows.length > 0) {
      return res.status(400).json({ message: "User already exist" });
    } else {
      await pool.query(
        "INSERT INTO user_table (User_Name, Password, User_Type) VALUES (?, ?, ?)",
        [username, hashedPassword, isAdmin ? "admin" : "user"]
      );
      res.status(201).json({ message: "User created" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const generateAccessToken = (user) => {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, {
    expiresIn: "5h",
  });
};

// handles log out for both admin and user
export const logoutHandler = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "logged out" });
};

//  gets the the loged in user info
export const getAdminInfo = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    isAuth: true,
    user: user,
  });
};

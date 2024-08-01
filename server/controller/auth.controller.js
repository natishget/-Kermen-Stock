import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

export const loginHandler = async (req, res) => {
  console.log("login in process");
  const { username, password, isAdmin } = req.body;
  try {
    if (isAdmin) {
      const [rows] = await pool.query(
        "SELECT * FROM user_table WHERE User_Name = ?",
        [username]
      );

      if (rows.length === 0) {
        return res.status(400).json({ msg: "No such admin" });
      }

      const admin = rows[0];
      const isMatch = await bcrypt.compare(password, admin.Password);

      if (isMatch) {
        // req.session.userInfo = { isClient: isClient, userData: client };
        // console.log(req.session.userData);
        return res.json({ info: rows[0], isAdmin: isAdmin });
      } else {
        return res.status(400).json({ msg: "Login failed" });
      }
    } else {
      const [rows] = await pool.query(
        "SELECT * FROM user_table WHERE User_Name = ?",
        [username]
      );

      if (rows.length === 0) {
        return res.status(400).json({ msg: "No such user" });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.Password);

      if (isMatch) {
        // req.session.userInfo = { isClient: isClient, userData: freelancer };
        // console.log(req.session.userData);
        console.log("successful");
        return res.json({ info: rows[0], isAdmin: isAdmin });
      } else {
        return res.status(400).json({ msg: "Login failed" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

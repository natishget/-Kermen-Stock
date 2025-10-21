import { pool } from "../config/db.js";

export const allUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT User_Name, Email, User_Type FROM user_table"
    );
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const editUserInfo = async (req, res) => {
  const { username, password, email, userType, newUserName } = req.body;
  try {
    const [rows] = await pool.query(
      " UPDATE user_table SET User_Name = ?, Password = ?, Email = ?, User_Type = ? WHERE User_Name = ?",
      [newUserName, password, email, userType, username]
    );
    return res.status(200).json({ message: "Sucessfully updated" });
  } catch (error) {
    return res.status(200).json({ error: error.message || error.sqlMessage });
  }
};

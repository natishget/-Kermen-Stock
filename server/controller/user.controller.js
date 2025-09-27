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

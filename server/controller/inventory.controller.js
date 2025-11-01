import { pool } from "../config/db.js";

export const handleInventoryLevel = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT inventory_level.*, product.Product_name FROM inventory_level JOIN product ON inventory_level.PID = product.PID"
    );
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

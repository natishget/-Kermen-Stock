import { pool } from "../config/db.js";

export const handleInventoryLevel = async (req, res) => {
  console.log("inventory level view in process");
  try {
    const [rows] = await pool.query(
      "SELECT inventory_level.*, product.Product_name FROM inventory_level JOIN product ON inventory_level.PID = product.PID"
    );
    if (rows.length == 0) {
      return res.json({ msg: "" });
    }
    console.log("successful");
    return res.json(rows);
  } catch (error) {
    console.log(error);
  }
};

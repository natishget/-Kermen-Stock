import { pool } from "../config/db.js";

export const allPurchaseHandler = async (req, res) => {
  console.log("loading all purchased inventories from the database");
  try {
    const [rows] = await pool.query(
      "SELECT purchased_inventory.*, product.Product_name FROM purchased_inventory JOIN product ON purchased_inventory.PID = product.PID"
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

export const makePurchaseHandler = async (req, res) => {
  console.log("making your purchase");
  const { product_id, quantity, date, description, unit_price, invoice_no } =
    req.body;
  try {
    const [rows] = await pool.query(
      " INSERT INTO purchased_inventory (PID, Quantity, Invoice_No, Unit_Price, Date, Description, Total_Price) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        product_id,
        quantity,
        invoice_no,
        unit_price,
        date,
        description,
        quantity * unit_price,
      ]
    );
    console.log(rows.affectedRows);
    return res.json(rows.affectedRows);
  } catch (error) {
    console.error(error.message);
  }
};

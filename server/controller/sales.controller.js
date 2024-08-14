import { pool } from "../config/db.js";

// view all the sales from the sales table
export const allSalesHandler = async (req, res) => {
  console.log("view all sales in process");
  try {
    const [rows] = await pool.query(
      "SELECT sales.*, product.Product_name FROM sales JOIN product ON sales.PID = product.PID"
    );
    if (rows.length == 0) {
      return res.status(400).json({ msg: "No Data found" });
    }
    console.log("successful");
    return res.json(rows);
  } catch (error) {
    console.log(error);
  }
};

// handles when a sell is made to a product
export const makeSalesHandler = async (req, res) => {
  console.log("creating a sell in process again");
  const { product_id, quantity, date, description, unit_price, customer } =
    req.body;
  console.log(
    product_id + quantity + date + description + unit_price + customer
  );
  try {
    const [rows] = await pool.query(
      "INSERT INTO sales (PID, Quantity, Unit_price, Date, Description, Customer_Name, Total_Price) VALUES (?, ?, ?, ?, ?, ?, ?);",
      [
        product_id,
        quantity,
        unit_price,
        date,
        description,
        customer,
        quantity * unit_price,
      ]
    );
    if (rows.length === 0) {
      return res.json({ message: "No" });
    }
    return res.json({ message: "Yes" });
  } catch (err) {
    console.log(err);
  }
};

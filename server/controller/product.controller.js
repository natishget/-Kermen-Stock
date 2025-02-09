import { pool } from "../config/db.js";

export const addNewProduct = async (req, res) => {
  console.log("adding new product");
  try {
    const { product_name, description, unit_of_measurment } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO product ( Product_name, Description, Unit_of_measurement) VALUES (?, ?, ?)",
      [product_name, description, unit_of_measurment]
    );
    res.json({ message: "Product Added" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProducts = async (req, res) => {
  console.log("getting all products");
  try {
    const [rows] = await pool.query("SELECT * FROM product");
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

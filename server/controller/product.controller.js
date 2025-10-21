import { pool } from "../config/db.js";
import fs from "fs";

export const addNewProduct = async (req, res) => {
  console.log("adding new product");
  try {
    const { product_name, description, unit_of_measurment } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO product ( Product_name, Description, Unit_of_measurement) VALUES (?, ?, ?)",
      [product_name, description, unit_of_measurment]
    );
    res.status(200).json({ message: "Product Added" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProducts = async (req, res) => {
  console.log("getting all products");
  try {
    const [rows] = await pool.query("SELECT * FROM product");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const handleFileRead = async (req, res) => {
//   console.log("reading file");
//   const data = fs.readFileSync(
//     "C:/Users/omen/Desktop/SMS/server/products.json"
//   );
//   const products = JSON.parse(data);
//   console.log(products);
//   try {
//     let count = 0;
//     products.forEach(async (product) => {
//       const { name, description, unit } = product;
//       const [rows] = await pool.query(
//         "INSERT INTO product ( Product_name, Description, Unit_of_measurement) VALUES (?, ?, ?)",
//         [name, description, unit]
//       );
//       count += 1;
//       console.log("count:", count);
//     });
//     res.json({ message: "Products Added" });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

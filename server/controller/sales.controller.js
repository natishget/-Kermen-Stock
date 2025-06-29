import { pool } from "../config/db.js";
import PDFDocument from "pdfkit";

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

export const makeSalesHandler = async (req, res) => {
  console.log("creating multiple sales in process");

  const sales = req.body; // Expecting an array of sales
  

  // Ensure that we received an array of sales
  if (!Array.isArray(sales) || sales.length === 0 || !sales) {
    return res
      .status(400)
      .json({ error: "Cart is Empty!" });
  }

  try {
    
    // Start a transaction
    await pool.query("START TRANSACTION");

    // Process each sale
    for (const sale of sales) {
      console.log("sale",sale)
      const {
        product_id,
        quantity,
        date,
        description,
        unit_price,
        customer,
        color,
        isimported,
      } = sale;

      // Execute the stored procedure or query for each sale

      const [rows] = await pool.query(
        `CALL HandleSale(?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product_id,
          quantity,
          date,
          description,
          unit_price,
          customer,
          color,
          isimported,
        ]
      );
      console.log("rows result", rows);

      // if (rows.length === 0) {
      //   await pool.query("ROLLBACK");
      //   return res.status(400).json({ message: "Failed to process one of the sales" });
      // }
    }

    // Commit the transaction if all sales were successful
    await pool.query("COMMIT");

    res.status(200).json({message: "Sales Successfully"})

    
  } catch (err) {
    // Rollback in case of any error
    await pool.query("ROLLBACK");
    console.log("error",err);
    return res.status(400).json({ error: err.sqlMessage });
  }
};

export const handleEditSales = async (req, res) => {
  const {
    SID,
    PID,
    Quantity,
    Unit_price,
    Customer_Name,
    Date,
    Description,
    Color,
    isImported,
  } = req.body;
  console.log(
    SID,
    PID,
    Quantity,
    Unit_price,
    Customer_Name,
    Date,
    Description,
    Color,
    isImported
  );
  try {
    const [rows] = await pool.query(
      "UPDATE sales SET PID = ?, Quantity = ?, Unit_price = ?, Customer_Name = ?, Date = ?, Description = ?, Total_Price = ?, Color = ?, isImported = ? WHERE SID = ?",
      [
        PID,
        Quantity,
        Unit_price,
        Customer_Name,
        Date,
        Description,
        Quantity * Unit_price,
        Color.toUpperCase(),
        isImported,
        SID,
      ]
    );
    res.json({ message: "Sales Edited" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const handleDeleteSales = async (req, res) => {
  const salesId = req.body;

  console.log(salesId.SID);
  try {
    const [rows] = await pool.query("DELETE FROM sales WHERE SID = ?", [
      salesId.SID,
    ]);
    res.json({ message: "Sales Deleted" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

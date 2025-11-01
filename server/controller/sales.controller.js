import { pool } from "../config/db.js";

// view all the sales from the sales table
export const allSalesHandler = async (req, res) => {
  try {
    // 1. Get pagination parameters from the query string, or set defaults
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    // 2. Calculate the offset
    // For page 1: (1 - 1) * 10 = 0 (starts at the first row)
    // For page 2: (2 - 1) * 10 = 10 (starts at the 11th row)
    const offset = (page - 1) * limit;

    // 3. Get the total count for the frontend (optional, but highly recommended)
    // This allows the client to know the total number of pages.
    const [totalRows] = await pool.query("SELECT COUNT(*) as total FROM sales");
    const totalCount = totalRows[0].total;
    const totalPages = Math.ceil(totalCount / limit);

    // 4. Fetch the paginated sales data using LIMIT and OFFSET
    const salesQuery = `
      SELECT 
        sales.*, 
        product.Product_name 
      FROM 
        sales 
      JOIN 
        product ON sales.PID = product.PID
      LIMIT ? 
      OFFSET ?
    `;

    // Use prepared statements (the array [limit, offset]) for security
    const [rows] = await pool.query(salesQuery, [limit, offset]);

    // 5. Send back the data along with pagination metadata
    return res.status(200).json({
      data: rows,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit: limit,
      },
    });
  } catch (error) {
    console.error("Error in allSalesHandler:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching sales data." });
  }
};

export const makeSalesHandler = async (req, res) => {
  const sales = req.body; // Expecting an array of sales

  // Ensure that we received an array of sales
  if (!Array.isArray(sales) || sales.length === 0 || !sales) {
    return res.status(400).json({ error: "Cart is Empty!" });
  }

  try {
    // Start a transaction
    await pool.query("START TRANSACTION");

    // Process each sale
    for (const sale of sales) {
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
          color.toUpperCase(),
          isimported,
        ]
      );

      // if (rows.length === 0) {
      //   await pool.query("ROLLBACK");
      //   return res.status(400).json({ message: "Failed to process one of the sales" });
      // }
    }

    // Commit the transaction if all sales were successful
    await pool.query("COMMIT");

    res.status(200).json({ message: "Sales Successfully" });
  } catch (err) {
    // Rollback in case of any error
    await pool.query("ROLLBACK");
    return res.status(400).json({ error: err.sqlMessage || err.message });
  }
};

export const handleEditSales = async (req, res) => {
  const {
    SID,
    PID,
    Quantity,
    Unit_price,
    Customer_Name,
    Date: salesDate,
    Description,
    Color,
    isImported,
  } = req.body;

  try {
    const [rows] = await pool.query(
      "UPDATE sales SET PID = ?, Quantity = ?, Unit_price = ?, Customer_Name = ?, Date = ?, Description = ?, Total_Price = ?, Color = ?, isImported = ? WHERE SID = ?",
      [
        PID,
        Quantity,
        Unit_price,
        Customer_Name,
        new Date(salesDate).toISOString().split("T")[0],
        Description,
        Quantity * Unit_price,
        Color.toUpperCase(),
        isImported,
        SID,
      ]
    );
    res.status(200).json({ message: "Sales Edited" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const handleDeleteSales = async (req, res) => {
  const salesId = req.body;
  try {
    const [rows] = await pool.query("DELETE FROM sales WHERE SID = ?", [
      salesId.SID,
    ]);
    res.status(200).json({ message: "Sales Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

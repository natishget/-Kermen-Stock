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
  if (!Array.isArray(sales) || sales.length === 0) {
    return res
      .status(400)
      .json({ message: "Invalid input, array of sales expected" });
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
      } = sale;

      // Execute the stored procedure or query for each sale
      const [rows] = await pool.query(`CALL HandleSale(?, ?, ?, ?, ?, ?, ?)`, [
        product_id,
        quantity,
        date,
        description,
        unit_price,
        customer,
        color,
      ]);

      console.log("rows", rows);

      if (rows.length === 0) {
        await pool.query("ROLLBACK");
        return res.json({ message: "Failed to process one of the sales" });
      }
    }

    // Commit the transaction if all sales were successful
    await pool.query("COMMIT");

    // Generate a PDF with the sales information
    const doc = new PDFDocument();

    // Set headers to notify the browser to expect a PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=sales-summary-${Date.now()}.pdf`
    );

    // Generate PDF content
    doc.fontSize(12).fill("red").text("Kermen Aluminum", { align: "Left" });
    doc.fontSize(20).fill("black").text("Sales Summary", { align: "center" });

    doc.moveDown();

    sales.forEach((sale, index) => {
      doc.fontSize(8).text(`Item No. ${index + 1}`);
      doc.text(`Product ID: ${sale.product_id}`);
      doc.text(`Quantity: ${sale.quantity}`);
      doc.text(`Date: ${sale.date}`);
      doc.text(`Description: ${sale.description}`);
      doc.text(`Unit Price: ${sale.unit_price}`);
      doc.text(`Customer: ${sale.customer}`);
      doc.text(`Color: ${sale.color}`);
      doc.text(
        "---------------------------------------------------------------------------------"
      );
      doc.moveDown();
    });

    // Finalize PDF and send it
    doc.end();

    // Pipe the PDF document directly to the response (no need to save on server)
    doc.pipe(res);
  } catch (err) {
    // Rollback in case of any error
    await pool.query("ROLLBACK");
    console.log(err.sqlMessage);
    return res.json({ message: err.sqlMessage });
  }
};

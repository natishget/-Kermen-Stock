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
  const {
    product_id,
    quantity,
    date,
    description,
    unit_price,
    invoice_no,
    seller,
    color,
    isimported,
  } = req.body;
  console.log("PID", product_id);
  console.log("color", color);
  console.log("seller", seller);

  try {
    const [rows] = await pool.query(
      `CALL UpdateInventory(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product_id,
        quantity,
        invoice_no,
        unit_price,
        description,
        seller,
        date,
        color.toUpperCase(),
        isimported,
      ]
    );
    console.log("successful");
    return res.json("1");
  } catch (error) {
    console.error(error.message);
  }
};

export const handleEditPurchase = async (req, res) => {
  const {
    PIID,
    PID,
    Quantity,
    Unit_Price,
    Seller,
    Date,
    Description,
    Color,
    isImported,
  } = req.body;
  console.log(
    PIID,
    PID,
    Quantity,
    Unit_Price,
    Seller,
    Date,
    Description,
    Color,
    isImported
  );
  try {
    const [rows] = await pool.query(
      "UPDATE sales SET PID = ?, Quantity = ?, Unit_Price = ?, Seller = ?, Date = ?, Description = ?, Total_Price = ?, Color = ?, isImported = ? WHERE PIID = ?",
      [
        PID,
        Quantity,
        Unit_Price,
        Seller,
        Date,
        Description,
        Quantity * Unit_Price,
        Color.toUpperCase(),
        isImported,
        PIID,
      ]
    );
    res.json({ message: "Purchase Edited" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const handleDeletePurchase = async (req, res) => {
  const salesId = req.body;

  console.log(salesId.SID);
  try {
    const [rows] = await pool.query(
      "DELETE FROM puchase_inventory WHERE PIID = ?",
      [puchaseId.PIID]
    );
    res.json({ message: "Sales Deleted" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

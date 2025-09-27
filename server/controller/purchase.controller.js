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
    res.status(400).json(error.message);
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
  console.log("color", color);
  console.log("isImported", isimported);

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
    return res.status(200).json("1");
  } catch (error) {
    res.status(400).json({ message: "Can't complete Purchase" });
  }
};

export const handleEditPurchase = async (req, res) => {
  const {
    PIID,
    PID,
    Quantity,
    Unit_Price,
    Seller,
    Date: purchaseDate,
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
    purchaseDate,
    Description,
    Color,
    isImported
  );
  try {
    const [rows] = await pool.query(
      "UPDATE purchased_inventory SET PID = ?, Quantity = ?, Unit_Price = ?, Seller = ?, Date = ?, Description = ?, Total_Price = ?, Color = ?, isImported = ? WHERE PIID = ?",
      [
        PID,
        Quantity,
        Unit_Price,
        Seller,
        new Date(purchaseDate).toISOString().split("T")[0],
        Description,
        Quantity * Unit_Price,
        Color.toUpperCase(),
        isImported,
        PIID,
      ]
    );
    console.log(rows);
    res.status(200).json({ message: "Purchase Edited" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const handleDeletePurchase = async (req, res) => {
  const purchaseId = req.body;

  try {
    const [rows] = await pool.query(
      "DELETE FROM purchased_inventory WHERE PIID = ?",
      [purchaseId.PIID]
    );
    res.status(200).json({ message: "purchase Deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import { pool } from "../config/db.js";

export const allPurchaseHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      "SELECT purchased_inventory.*, product.Product_name FROM purchased_inventory JOIN product ON purchased_inventory.PID = product.PID LIMIT ? OFFSET ?",
      [limit, offset]
    );

    const [totalRows] = await pool.query(
      "SELECT COUNT(*) as total FROM purchased_inventory"
    );
    const totalCount = totalRows[0].total;
    const totalPages = Math.ceil(totalCount / limit);

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
    res.status(400).json(error.message);
  }
};

export const makePurchaseHandler = async (req, res) => {
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
    return res.status(200).json({ messgae: "Updated the inventory" });
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
    res.status(200).json({ message: "Purchase Edited" });
  } catch (error) {
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

import { pool } from "../config/db.js";

export const getAllDataHandler = async (req, res) => {
  console.log("Getting all the data for the home page");
  try {
    // Retrieve total sales and count
    const [salesRows] = await pool.query(
      "SELECT SUM(Total_Price) AS TotalSalesPrice, COUNT(*) AS SalesCount FROM sales"
    );

    // Retrieve total purchase inventory and count
    const [purchasedInventoryRows] = await pool.query(
      "SELECT SUM(Total_Price) AS TotalPurchasedPrice, COUNT(*) AS PurchasedInventoryCount FROM purchased_inventory"
    );

    // Retrieve beginning inventory
    const [beginningInventoryRows] = await pool.query(
      "SELECT SUM(Total_Price) AS TotalBeginningPrice, COUNT(*) AS BeginningInventoryCount FROM beginning_inventory"
    );

    // Retrieve monthly sales data with month names
    const [monthlySalesRows] = await pool.query(
      `SELECT DATE_FORMAT(Date, '%b') AS Month, 
              SUM(Total_Price) AS Monthly_Sales 
       FROM sales 
       GROUP BY DATE_FORMAT(Date, '%b') 
       ORDER BY MIN(Date);`
    );

    // Retrieve monthly purchase data with month names
    const [monthlyPurchaseRows] = await pool.query(
      `SELECT DATE_FORMAT(Date, '%b') AS Month, 
              SUM(Total_Price) AS Monthly_Purchase 
       FROM purchased_inventory 
       GROUP BY DATE_FORMAT(Date, '%b') 
       ORDER BY MIN(Date);`
    );

    // Parse total values
    const totalSalesPrice = parseFloat(salesRows[0].TotalSalesPrice) || 0;
    const salesCount = parseInt(salesRows[0].SalesCount) || 0;
    const totalPurchasedPrice =
      parseFloat(purchasedInventoryRows[0].TotalPurchasedPrice) || 0;
    const purchasedInventoryCount =
      parseInt(purchasedInventoryRows[0].PurchasedInventoryCount) || 0;
    const totalBeginningPrice =
      parseFloat(beginningInventoryRows[0].TotalBeginningPrice) || 0;
    const beginningInventoryCount =
      parseInt(beginningInventoryRows[0].BeginningInventoryCount) || 0;

    // Compute combined purchase total
    const combinedTotalPurchasedPrice =
      totalBeginningPrice + totalPurchasedPrice;
    const combinedPurchasedInventoryCount =
      beginningInventoryCount + purchasedInventoryCount;

    // Prepare the response
    const retrievedData = {
      totalSalesPrice,
      salesCount,
      combinedTotalPurchasedPrice,
      combinedPurchasedInventoryCount,
      monthlySales: monthlySalesRows.map((row) => ({
        month: row.Month, // Now it will return "Jan", "Feb", "Mar", etc.
        totalSales: parseFloat(row.Monthly_Sales) || 0,
      })),
      monthlyPurchases: monthlyPurchaseRows.map((row) => ({
        month: row.Month, // Now it will return "Jan", "Feb", "Mar", etc.
        totalPurchases: parseFloat(row.Monthly_Purchase) || 0,
      })),
    };

    res.status(200).json(retrievedData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

import { pool } from "../config/db.js";

const getAllDataHandler = async (req, res) => {
  console.log("getting all the data for the home page");
  try {
    const [salesRows] = await pool.query(
      "SELECT SUM(Total_Price) AS TotalSalesPrice, COUNT(*) AS SalesCount FROM sales"
    );
    const [purchasedInventoryRows] = await pool.query(
      "SELECT SUM(Total_Price) AS TotalPurchasedPrice, COUNT(*) AS PurchasedInventoryCount FROM purchased_inventory"
    );
    const [beginningInventoryRows] = await pool.query(
      "SELECT SUM(Total_Price) AS TotalBeginningPrice, COUNT(*) AS BeginningInventoryCount FROM beginning_inventory"
    );
    const [monthlySalesRows] = await pool.query(
      "SELECT DATE_FORMAT(Date, '%Y-%m') AS Month, SUM(Total_Price) AS Monthly_Sales FROM sales WHERE Date <= DATE_FORMAT(CURDATE(), '%Y-09-01') AND Date < DATE_ADD(LAST_DAY(CURDATE()), INTERVAL 1 DAY) GROUP BY DATE_FORMAT(Date, '%Y-%m') ORDER BY Month;"
    );

    console.log(monthlySalesRows);

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

    const combinedTotalPurchasedPrice =
      totalBeginningPrice + totalPurchasedPrice;
    const combinedPurchasedInventoryCount =
      beginningInventoryCount + purchasedInventoryCount;

    console.log(
      `Sales Total: ${totalSalesPrice}
       Sales Count: ${salesCount}
       Purchase Total: ${combinedTotalPurchasedPrice}
       Purchase Count: ${combinedPurchasedInventoryCount}`
    );

    const retrievedData = [
      {
        totalSalesPrice,
        salesCount,
        combinedTotalPurchasedPrice,
        combinedPurchasedInventoryCount,
      },
    ];

    res.json(retrievedData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getAllDataHandler;

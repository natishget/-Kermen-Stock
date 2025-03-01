import { pool } from "../config/db.js"; // Ensure correct DB connection import

export const calculateCOGSAndProfit = async (req, res) => {
  console.log("Calculating COGS and Profit Metrics...");
  try {
    // Define the date range (Modify as needed)
    const startDate = "2025-01-01";
    const endDate = "2025-12-31";

    // SQL Query with FIFO COGS Calculation
    const sqlQuery = `
    WITH SalesData AS (
    -- Aggregate total sales per product
    SELECT PID, Color, isImported, SUM(Quantity) AS TotalSold
    FROM Sales
    WHERE Date BETWEEN ? AND ?
    GROUP BY PID, Color, isImported
),

InventoryBreakdown AS (
    -- Compute running total of purchased inventory for FIFO allocation
    SELECT 
        p.PID, 
        p.Color, 
        p.isImported, 
        p.Unit_Price, 
        p.Quantity,
        p.Date,
        SUM(p.Quantity) OVER (
            PARTITION BY p.PID, p.Color, p.isImported 
            ORDER BY p.Date ASC 
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS RunningTotal
    FROM Purchased_inventory p
    WHERE p.Date BETWEEN ? AND ?
),

FIFO_COGS AS (
    -- Allocate COGS based on FIFO logic
    SELECT 
        i.PID, 
        i.Color, 
        i.isImported, 
        SUM(
            CASE 
                WHEN RunningTotal - Quantity < COALESCE(s.TotalSold, 0) 
                THEN Quantity * Unit_Price
                WHEN RunningTotal >= COALESCE(s.TotalSold, 0) 
                THEN (COALESCE(s.TotalSold, 0) - (RunningTotal - Quantity)) * Unit_Price
                ELSE 0 
            END
        ) AS COGS
    FROM InventoryBreakdown i
    LEFT JOIN SalesData s 
        ON i.PID = s.PID AND i.Color = s.Color AND i.isImported = s.isImported
    WHERE s.TotalSold IS NOT NULL
    GROUP BY i.PID, i.Color, i.isImported
),

CombinedInventory AS (
    -- Combine purchased inventory with beginning inventory
    SELECT 
        PID,
        Color,
        isImported,
        SUM(Quantity) AS TotalQty,
        SUM(Quantity * Unit_Price) AS TotalCost
    FROM (
        SELECT 
            p.PID,
            p.Color,
            p.isImported,
            p.Quantity,
            p.Unit_Price
        FROM Purchased_inventory p
        WHERE p.Date BETWEEN ? AND ?

        UNION ALL

        SELECT 
            b.PID,
            b.Color,
            b.isImported,
            b.Quantity,
            b.Unit_Price
        FROM Beginning_inventory b
    ) AS Inventory
    GROUP BY PID, Color, isImported
),

SalesPrice AS (
    -- Calculate average selling price per unit
    SELECT 
        PID,
        Color,
        isImported,
        AVG(Unit_Price) AS SalePricePerUnit
    FROM Sales
    WHERE Date BETWEEN ? AND ?
    GROUP BY PID, Color, isImported
)

-- Final Output
SELECT 
    ci.PID,
    ci.Color,
    ci.isImported,
    ci.TotalQty AS TotalQuantity,
    ci.TotalCost AS TotalCost,
    (ci.TotalCost / NULLIF(ci.TotalQty, 0)) AS WeightedAvgCostPerUnit,
    sp.SalePricePerUnit,
    cogs.COGS
FROM CombinedInventory ci
LEFT JOIN SalesPrice sp
    ON ci.PID = sp.PID 
    AND ci.Color = sp.Color 
    AND ci.isImported = sp.isImported
LEFT JOIN FIFO_COGS cogs
    ON ci.PID = cogs.PID 
    AND ci.Color = cogs.Color 
    AND ci.isImported = cogs.isImported;
    `;

    // Execute the Query
    const [rows] = await pool.execute(sqlQuery, [
      startDate,
      endDate, // SalesData
      startDate,
      endDate, // FIFO_COGS
      startDate,
      endDate, // CombinedInventory
      startDate,
      endDate, // SalesPrice
    ]);

    console.log("Rows:", rows);

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching inventory metrics:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

import { pool } from "../config/db.js"; // Ensure correct DB connection import

export const calculateCOGSAndProfit = async (req, res) => {
  console.log("Calculating COGS and Profit Metrics...");
  try {
    // Define the date range (Modify as needed)
    const startDate = "2025-01-01";
    const endDate = "2025-12-31";

    // SQL Query with FIFO COGS Calculation
    const sqlQuery = `WITH SalesData AS (
    -- Aggregate total sales per product within the reporting period
    SELECT PID, Color, isImported, SUM(Quantity) AS TotalSold
    FROM sales
    WHERE Date BETWEEN ? AND ?
    GROUP BY PID, Color, isImported
),

InventoryBase AS (
    -- Combine all purchased inventory up to the end date (for FIFO layering)
    SELECT PID, Color, isImported, Quantity, Unit_Price, Date
    FROM purchased_inventory
    WHERE Date <= ? -- Parameter 3: endDate

    UNION ALL

    -- Include beginning inventory, treating it as the oldest stock
    SELECT PID, Color, isImported, Quantity, Unit_Price, '1900-01-01' AS Date
    FROM beginning_inventory
),

InventoryBreakdown AS (
    -- Compute running total of inventory for FIFO allocation
    SELECT
        PID,
        Color,
        isImported,
        Unit_Price,
        Quantity,
        Date,
        SUM(Quantity) OVER (
            PARTITION BY PID, Color, isImported
            ORDER BY Date ASC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS RunningTotal
    FROM InventoryBase
),

FIFO_COGS AS (
    -- Allocate COGS based on FIFO logic against SalesData
    SELECT
        i.PID,
        i.Color,
        i.isImported,
        SUM(
            CASE
                -- Case 1: The current inventory layer is completely consumed by sales
                WHEN RunningTotal - Quantity < COALESCE(s.TotalSold, 0)
                THEN Quantity * Unit_Price
                -- Case 2: Only a portion of the current layer is needed for sales
                WHEN RunningTotal >= COALESCE(s.TotalSold, 0)
                THEN (COALESCE(s.TotalSold, 0) - (RunningTotal - Quantity)) * Unit_Price
                -- Case 3: Sales were already fulfilled by older layers (or no sales)
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
    -- Calculate total quantity and total cost of inventory purchased within the reporting period + beginning inventory
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
        FROM purchased_inventory p
        WHERE p.Date BETWEEN ? AND ? -- Parameters 4 & 5: startDate & endDate (for purchases in the period)

        UNION ALL

        SELECT
            b.PID,
            b.Color,
            b.isImported,
            b.Quantity,
            b.Unit_Price
        FROM beginning_inventory b
    ) AS Inventory
    GROUP BY PID, Color, isImported
),

SalesPrice AS (
    -- Calculate average selling price per unit within the reporting period
    SELECT
        PID,
        Color,
        isImported,
        AVG(Unit_Price) AS SalePricePerUnit
    FROM sales
    WHERE Date BETWEEN ? AND ? -- Parameters 6 & 7: startDate & endDate
    GROUP BY PID, Color, isImported
),

ProductNames AS (
    -- NEW CTE: Get the product name for the final output
    SELECT PID, Product_name AS ProductName
    FROM product
)

-- Final Output: Join all metrics, including the new Product Name
SELECT
    ci.PID,
    pn.ProductName, -- <--- NEW FIELD
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
    AND ci.isImported = cogs.isImported
LEFT JOIN ProductNames pn -- <--- NEW JOIN
    ON ci.PID = pn.PID;
`;

    // Execute the Query
    const [rows] = await pool.execute(sqlQuery, [
      startDate, // 1
      endDate, // 2
      endDate, // 3
      startDate, // 4
      endDate, // 5
      startDate, // 6
      endDate, // 7
    ]);

    res.status(200).json({ message: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

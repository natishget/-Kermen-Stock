import { pool } from "../config/db.js";

// Function to get Total Quantity, Total Cost, and Weighted Average Cost
export const calculateCOGSAndProfit = async (req, res) => {
  console.log("Fetching Combined Inventory Metrics");

  const startDate = "2024-01-01";
  const endDate = "2024-12-31";

  const sqlQuery = `
    WITH CombinedInventory AS (
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
        SELECT 
            PID,
            Color,
            isImported,
            AVG(Unit_Price) AS SalePricePerUnit -- Get the average sale price for each product
        FROM Sales s
        WHERE s.Date BETWEEN ? AND ?
        GROUP BY PID, Color, isImported
    )
    SELECT 
        SUM(ci.TotalQty) AS TotalQuantity,
        SUM(ci.TotalCost) AS TotalCost,
        (SUM(ci.TotalCost) / NULLIF(SUM(ci.TotalQty), 0)) AS WeightedAvgCostPerUnit,
        sp.SalePricePerUnit
    FROM CombinedInventory ci
    JOIN SalesPrice sp
        ON ci.PID = sp.PID 
        AND ci.Color = sp.Color 
        AND ci.isImported = sp.isImported;
  `;

  try {
    // Execute the SQL query with startDate and endDate as parameters
    const [results] = await pool.query(sqlQuery, [
      startDate,
      endDate,
      startDate,
      endDate,
    ]);

    if (results.length > 0) {
      const {
        TotalQuantity,
        TotalCost,
        WeightedAvgCostPerUnit,
        SalePricePerUnit,
      } = results[0];
      console.log(results);

      // Calculate COGS (Cost of Goods Sold)
      console.log(TotalQuantity * WeightedAvgCostPerUnit);

      // Calculate Revenue
      console.log(TotalQuantity * SalePricePerUnit);

      // Calculate Gross Profit
      console.log(
        TotalQuantity * SalePricePerUnit -
          TotalQuantity * WeightedAvgCostPerUnit
      );

      // Send the response with all the necessary data
      res.json({
        TotalQuantity: parseFloat(TotalQuantity) || 0,
        TotalCost: parseFloat(TotalCost) || 0,
        WeightedAvgCostPerUnit: parseFloat(WeightedAvgCostPerUnit) || 0,
        SalePricePerUnit: parseFloat(SalePricePerUnit) || 0,
        // COGS: parseFloat(COGS) || 0,
        // Revenue: revenue.toFixed(2),
        // GrossProfit: grossProfit.toFixed(2),
      });
    } else {
      res
        .status(404)
        .json({ error: "No data found for the given date range." });
    }
  } catch (error) {
    console.error("Error fetching inventory metrics:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching inventory metrics." });
  }
};

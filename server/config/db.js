import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "753215",
  database: "stock_try",
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

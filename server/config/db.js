import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "kermen_stock",
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

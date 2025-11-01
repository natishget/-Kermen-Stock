import mysql from "mysql2/promise";

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const requiredEnv = {
  DB_HOST: dbHost,
  DB_USER: dbUser,
  DB_PASSWORD: dbPassword,
  DB_NAME: dbName,
};

for (const [key, value] of Object.entries(requiredEnv)) {
  if (!value) {
    console.error(`❌ Missing environment variable: ${key}`);
  }
}

export const pool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

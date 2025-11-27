const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "rootroot", 
  database: "db202245055"
});

module.exports = pool;

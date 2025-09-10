// db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();
const URL=`mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@hopper.proxy.rlwy.net:11496/${process.env.MYSQLDATABASE}`
const pool = mysql.createPool(URL);

module.exports = pool;

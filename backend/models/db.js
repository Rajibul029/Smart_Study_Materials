// db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();
const URL=`mysql://root:SQrSAiWBQaqRZchzCqhdKYskUOXZXMik@hopper.proxy.rlwy.net:11496/railway`
const pool = mysql.createPool(URL);

module.exports = pool;

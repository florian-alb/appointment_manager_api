const mysql = require('mysql2/promise');

const mysqlPool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "SocioDocs",
    timezone: 'Z'
});

module.exports = mysqlPool;


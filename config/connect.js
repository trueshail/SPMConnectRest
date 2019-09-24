var sql = require('mssql');
var db = require('../config/db');

var connect = function() {
	var conn = new sql.ConnectionPool(db);
	return conn;
};

module.exports = connect;

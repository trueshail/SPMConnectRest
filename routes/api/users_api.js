var express = require('express');
var router = express.Router();
var sql = require('mssql');
var conn = require('../../config/connect')();

/* GET users listing. */
router.get('/', function(req, res, next) {
	conn
		.connect()
		.then(function() {
			var sqlQuery = 'SELECT * FROM Users';
			var request = new sql.Request(conn);
			request
				.query(sqlQuery)
				.then(function(recordset) {
					res.json(recordset.recordset);
					conn.close();
				})
				.catch(function(err) {
					console.log(err);
					conn.close();
					res.status(400).send('Error while fetching users data');
				});
		})
		.catch(function(err) {
			console.log(err);
			conn.close();
			res.send('Error while fetching users data');
		});
});

router.get('/:id/', function(req, res, next) {
	conn
		.connect()
		.then(function() {
			var sqlQuery = 'select * from Users where id=@id';
			var request = new sql.Request(conn);
			request.input('id', sql.Int, req.params.id);
			request
				.query(sqlQuery)
				.then(function(recordset) {
					res.json(recordset.recordset);
					conn.close();
				})
				.catch(function(err) {
					console.log(err);
					conn.close();
					res.status(400).send('Error while fetching users data with id');
				});
		})
		.catch(function(err) {
			console.log(err);
			conn.close();
			res.send('Error while fetching users data with id');
		});
});

module.exports = router;

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
				.then(function(result) {
					conn.close();
					res.render('users/index', {
						route: 'Users',
						data: result.recordset
					});
					res.end();
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
			res.end();
			res.render('error', {
				route: 'error',
				err: err
			});
		});
});

router.get('/info/:id/', function(req, res, next) {
	conn
		.connect()
		.then(function() {
			var sqlQuery = 'SELECT * FROM Users WHERE id=@id';
			var request = new sql.Request(conn);
			request.input('id', sql.Int, req.params.id);
			request
				.query(sqlQuery)
				.then(function(result) {
					conn.close();
					res.render('users/info', {
						route: 'info',
						data: result.recordset[0]
					});
				})
				.catch(function(err) {
					console.log(err);
					conn.close();
					res.status(400).send('Error while fetching users data with id: ' + req.params.id);
				});
		})
		.catch(function(err) {
			console.log(err);
			conn.close();
			res.render('error', {
				route: 'error',
				err: err
			});
			// res.send('Error while requesting users data with id: ' + req.params.id);
		});
});

module.exports = router;

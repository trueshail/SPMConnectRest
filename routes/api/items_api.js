var express = require('express');
var router = express.Router();
var sql = require('mssql');
var conn = require('../../config/connect')();

/* GET users listing. */
router.get('/', function(req, res, next) {
	conn
		.connect()
		.then(function() {
			res.setHeader('Cache-Control', 'no-cache');

			const request = new sql.Request(conn);
			request.stream = true;
			request.query('SELECT * FROM [SPM_Database].[dbo].[UnionInventory] ORDER BY ItemNumber DESC');

			let rowCount = 0;
			const BATCH_SIZE = 50;

			request.on('recordset', () => {
				res.setHeader('Content-Type', 'application/json');
				res.write('[');
			});

			request.on('row', (row) => {
				if (rowCount > 0) res.write(',');

				if (rowCount % BATCH_SIZE === 0) {
					//console.log('Res flush at RowCount : ' + rowCount);
					res.flushHeaders();
				}

				res.write(JSON.stringify(row));
				rowCount++;
			});

			request.on('done', () => {
				res.write(']');
				conn.close();
				res.end();
				console.log('Done pasrsing all rows for items');
			});
		})
		.catch(function(err) {
			console.log(err);
			conn.close();
			res.send('Error while fetching users data');
		});
});

router.get('/:id', function(req, res, next) {
	conn
		.connect()
		.then(function() {
			var request = new sql.Request(conn);
			request.input('id', sql.VarChar, req.params.id);
			var sqlQuery = 'SELECT * FROM [SPM_Database].[dbo].[UnionInventory] where ItemNumber=@id';
			request
				.query(sqlQuery)
				.then(function(recordset) {
					res.json(recordset.recordset);
					conn.close();
					console.log('Completed request for item id: ' + req.params.id);
				})
				.catch(function(err) {
					console.log(err);
					conn.close();
					res.status(400).send('Error while fetching items data with id');
				});
		})
		.catch(function(err) {
			console.log(err);
			conn.close();
			res.send('Error while fetching items data with id');
		});
});

module.exports = router;

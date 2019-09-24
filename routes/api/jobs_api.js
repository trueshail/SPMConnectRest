var express = require('express');
var router = express.Router();
var sql = require('mssql');
var conn = require('../../config/connect')();

/* GET jobs listing. */
router.get('/', function(req, res, next) {
	conn
		.connect()
		.then(function() {
			res.setHeader('Cache-Control', 'no-cache');

			const request = new sql.Request(conn);
			request.stream = true;
			request.query('SELECT * FROM [SPM_Database].[dbo].[SPMJobs] ORDER BY Job DESC');

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
				console.log('Done pasrsing all rows for job request');
			});
		})
		.catch(function(err) {
			console.log(err);
			conn.close();
			res.send('Error while fetching Jobs data');
		});
});

router.get('/:id', function(req, res, next) {
	conn
		.connect()
		.then(function() {
			var request = new sql.Request(conn);
			request.input('id', sql.VarChar, req.params.id);
			var sqlQuery = 'SELECT * FROM [SPM_Database].[dbo].[SPMJobs] where Job=@id';
			request
				.query(sqlQuery)
				.then(function(recordset) {
					res.json(recordset.recordset);
					conn.close();
					console.log('Completed request for Job id: ' + req.params.id);
				})
				.catch(function(err) {
					console.log(err);
					conn.close();
					res.status(400).send('Error while fetching Job data with id: ' + req.params.id);
				});
		})
		.catch(function(err) {
			console.log(err);
			conn.close();
			res.send('Error while fetching Job data with id: ' + req.params.id);
		});
});

module.exports = router;

var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../config/db');
/* GET users listing. */
router.get('/', function(req, res, next) {
	sql.connect(db, function(err) {
		if (err) console.log(err);
		res.setHeader('Cache-Control', 'no-cache');

		const request = new sql.Request();
		request.stream = true;
		request.query('SELECT * FROM [SPM_Database].[dbo].[WorkOrderManagement] ORDER BY Job DESC');

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
			sql.close();
			res.end();
			console.log('Done pasrsing all rows for workorder request');
		});
	});
});

router.get('/:id', function(req, res, next) {
	sql.connect(db, function(err) {
		if (err) console.log(err);

		var request = new sql.Request();
		request.input('id', sql.NVarChar, req.params.id);
		request.query('SELECT * FROM [SPM_Database].[dbo].[WorkOrderManagement] where WorkOrder=@id', function(
			err,
			result
		) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			sql.close();
			res.send(result.recordset);
			res.end();
			console.log('Completed request for workorder id: ' + req.params.id);
		}); // request.query
	}); // sql.conn
	//res.send('api users ok.');
});

module.exports = router;

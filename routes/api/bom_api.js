var express = require('express');
var router = express.Router();
var sql = require('mssql');
var conn = require('../../config/connect')();
var arrayToTree = require('array-to-tree');

/* GET users listing. */
router.get('/:id/', function(req, res, next) {
	conn
		.connect()
		.then(function() {
			var request = new sql.Request(conn);
			request.input('product', sql.VarChar(30), req.params.id);
			request
				.execute('GetBOMTree')
				.then(function(recordset) {
					res.json(
						arrayToTree(recordset.recordset, {
							customID: 'children',
							parentProperty: 'parent_id'
						})
					);
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

module.exports = router;

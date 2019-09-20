var express = require('express');
var router = express.Router();

var db = require('../config/db');
var sql = require('mssql');

var result;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('connect', {
		route: 'connect'
	});
}); // get /

router.get('/api/users', function(req, res, next) {
	sql.connect(db, function(err) {
		if (err) console.log(err);

		var request = new sql.Request();

		request.query('select * from Users', function(err, result) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			// var rowsCount = result.rowsAffected;
			sql.close();
			res.send(result.recordset);
		}); // request.query
	}); // sql.conn
	//res.send('api users ok.');
});

router.get('/api/users/:id/', function(req, res, next) {
	sql.connect(db, function(err) {
		if (err) console.log(err);

		var request = new sql.Request();
		request.input('id', sql.Int, req.params.id);
		request.query('select * from Users where id=@id', function(err, result) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			// var rowsCount = result.rowsAffected;
			sql.close();
			res.send(result.recordset);
		}); // request.query
	}); // sql.conn
	//res.send('api users ok.');
});
module.exports = router;

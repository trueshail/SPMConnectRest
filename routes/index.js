var express = require('express');
var router = express.Router();
var sql = require('mssql');
var conn = require('../config/connect')();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('connect', {
		route: 'connect'
	});
}); // get /

module.exports = router;

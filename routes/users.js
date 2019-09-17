var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../config/db');
/* GET users listing. */
router.get('/', function(req, res, next) {
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
			//	res.send(result.recordset);
			res.render('index', {
				route: 'Users',
				data: result.recordset
			});
			res.end();
		}); // request.query
	}); // sql.conn
	//res.send('api users ok.');
});

/* POST Edit page. */
router.post('/update', function(req, res, next) {
	sql.connect(db, function(err) {
		if (err) console.log(err);

		var request = new sql.Request();

		request
			.input('id', sql.Int, req.body.id)
			.input('UserName', sql.NVarChar(50), req.body.UserName)
			.input('Name', sql.NVarChar(50), req.body.Name)
			.input('Email', sql.NVarChar(50), req.body.Email)
			.query(
				'update Users set UserName=@UserName,Name=@Name,Email=@Email ,Developer=@Developer where id=@id',
				function(err, result) {
					if (err) {
						console.log(err);
						res.send(err);
					}
					sql.close();
					res.redirect('/users');
				}
			);
	});
});

/* GET Add page. */
router.get('/add', function(req, res, next) {
	res.render('add', {
		route: 'add'
	});
});

/* GET Edit page. */
router.get('/edit/:id/', function(req, res, next) {
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
			res.render('edit', {
				route: 'edit',
				data: result.recordset[0]
			});
		}); // request.query
	}); // sql.conn
});
/* POST Add page. */
router.post('/add', function(req, res, next) {
	sql.connect(db, function(err) {
		if (err) console.log(err);

		var request = new sql.Request();
		request
			.input('userid', sql.NVarChar(50), req.body.userid)
			.input('pwd', sql.NVarChar(50), req.body.pwd)
			.input('username', sql.NVarChar(50), req.body.username)
			.input('email', sql.NVarChar(50), req.body.email)
			.query(
				'insert into UserList (userid, pwd, username, email) values (@userid, @pwd, @username, @email)',
				function(err, result) {
					if (err) {
						console.log(err);
						res.send(err);
					}
					sql.close();
					res.redirect('/users');
				}
			);
	});
});

/* GET Delete page. */
router.get('/delete/:id', function(req, res, next) {
	sql.connect(db, function(err) {
		if (err) console.log(err);

		var request = new sql.Request();
		request.input('id', sql.Int, req.params.id).query('delete from Users where id=@id', function(err, result) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			sql.close();
			res.redirect('/users');
		});
	});
});

module.exports = router;

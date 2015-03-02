var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("now running root page");
	if (req.user) {
		res.render("index", {user: req.user});
	} else {
		res.redirect("/session/new");
	}
});

router.get("/users/new", function(req ,res) {
	if (req.user) {
		redirect("/"); 
	} else {
		res.render("new");
	}
});

router.post('/users', function(req, res) {
	if (!(req.body && req.body.email && req.body.password)) {
		res.render("new");
		return;
	}
	
	var user = new User({
		email: req.body.email
	});
	
	user.setPasswordDigest(req.body.password, function(err, hash) {
		user.passwordDigest = hash;
		user.save(function(err, user) {
			req.session.sessionToken = user.sessionToken;
			res.redirect('/');
		});
	});
});

router.get('/session/new', function(req, res) {
	res.render("session_new");
});

router.post('/session', function(req, res) {
	console.log("in POST session");
	console.log()
	if (!(req.body && req.body.email && req.body.password)) {
		res.render("session_new");
		return;
	}
	
	var email = req.body.email;
	var password = req.body.password;
	
	User.findOne({email: email}, function(err, user) {
		if (!user) {
			console.log("No user found!");
			res.redirect("session_new");
			return;
		} 
		if (user.veryfyPassword(password)) {
			user.resetToken(function(err) {
				console.log(user.sessionToken);
				req.session.sessionToken = user.sessionToken;
				res.redirect('/');
			});
		} else {
			res.json("invalid credentials");
		}		
	})
});

router.delete('/session', function(req, res) {
	req.session.sessionToken = null;
	res.redirect('/session/new');
});
module.exports = router;

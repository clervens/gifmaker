var express = require('express');
var bodyParser = require('body-parser');
var parseUrlEncoded = bodyParser.urlencoded({ extended: false });

var email   = require("emailjs/email")
	.server.connect({
	   user:    process.env.SMTP_USERNAME, 
	   password:process.env.SMTP_PASSWORD, 
	   host:    "smtp.gmail.com", 
	   ssl:     true
	});

var router = express.Router();

router.route('/contact')
	.get(function(req, res){
		res.render('contact', {
			title: "Cvolcy GifMaker",
			description: "Contact",
			submitted: false,
			error: false,
			req: req
		});
	})
	.post(parseUrlEncoded, function(req, res){
		var message = {
		   text:    req.params.message, 
		   from:    req.params.name +" <"+req.params.email+">", 
		   to:      "clervens <clervens.volcy@gmail.com>",
		   subject: "GifMaker | Contact Request"
		};
		console.log(req.params);
		email.send(message, function(err, message) { 
			res.render('contact', {
				title: "Cvolcy GifMaker",
				description: "Contact",
				submitted: !err || true,
				error: err,
				req: req
			});
		});
	});

module.exports = router;
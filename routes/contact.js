var express = require('express');
var bodyParser = require('body-parser');
var crypto = require("../modules/crypto");
var parseUrlEncoded = bodyParser.urlencoded({ extended: false });

var email   = require("emailjs/email")
	.server.connect({
	   user:    process.env.SMTP_USERNAME, 
	   password:process.env.SMTP_PASSWORD, 
	   host:    "smtp.gmail.com", 
	   ssl:     true
	});

var router = express.Router();
router.use(parseUrlEncoded);

function generateHumanCheck() {
	var humanCheck = {nb1: Math.floor((Math.random() * 10) + 1),nb2: Math.floor((Math.random() * 10) + 1)};
		humanCheck.check = crypto.encrypt(JSON.stringify(humanCheck));

	return humanCheck;
}

router.route('/contact')
	.get(function(req, res){
		res.render('contact', {
			title: "Cvolcy GifMaker",
			description: "Contact",
			submitted: false,
			error: false,
			humanCheck: generateHumanCheck(),
			req: req
		});
	})
	.post(parseUrlEncoded, function(req, res){
		var message = {
		   text:    req.body.message, 
		   from:    req.body.name +" <"+req.body.email+">", 
		   to:      "<"+process.env.SMTP_USERNAME+">",
		   subject: "GifMaker | Contact Request"
		};
		var humanCheck = JSON.parse(crypto.decrypt(req.body.humancheck));
		if (parseInt(req.body.real) != (humanCheck.nb1 + humanCheck.nb2)) {
			message = {};
		}
		console.log(parseInt(req.body.real), JSON.parse(crypto.decrypt(req.body.humancheck)), message);
		email.send(message, function(err, message) { 
			res.render('contact', {
				title: "Cvolcy GifMaker",
				description: "Contact",
				submitted: !err,
				error: err,
				humanCheck: generateHumanCheck(),	
				req: req
			});
			console.log(err);
		});
	});

module.exports = router;
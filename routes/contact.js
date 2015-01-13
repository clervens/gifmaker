var express = require('express');
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
.post(function(req, res){
	var message = {
	   text:    "i hope this works", 
	   from:    "Clervens <clervens.volcy@gmail.com>", 
	   to:      "clervens <clervens.volcy@gmail.com>",
	   subject: "testing emailjs"
	};
	email.send(message, function(err, message) { console.log(err || message); });
	res.render('contact', {
		title: "Cvolcy GifMaker",
		description: "Contact",
		submitted: true,
		error: false,
		req: req
	});
});

module.exports = router;
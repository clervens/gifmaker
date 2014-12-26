(function () {

	var server = io.connect(window.location.origin);
	var app = {};

	app.generate_gif = function(e) {
		if (!$('form').valid())
			return false;
		if (e.which === 13 || e.which === 1) {
			e.preventDefault();
			var url = $('.form-text').val();
			if (url != "") {
				data = app.serializeObject($("form"));
				if (data.starttime == "")
					data.starttime = "00:00:00";
				if (data.endtime == "")
					delete data.endtime;
				server.emit('generate', data);
				// $('form')[0].reset();
			}
		}
		return false;
	}

	app.serializeObject = function(form) {
		var o = {};
		var a = form.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};

	app.errorMessage = function (err) {
		$(".error-message").text(err.message).fadeIn('fast', function(){
			errorMessage = this
			setTimeout(function(){
				$(errorMessage).fadeOut();
			}, 10000);
		});
	}

	server.on('connect', function(data) {
	})

	server.on('messages', function(data){
		console.log(data);
		$(".video-container ul").append($("<li><a href='"+data.url+"' target='_blank'>"+data.info.title+"</a></li>"))
	});

	server.on('info', function(info){
		console.log(info);
	});

	server.on('error', function(err){
		app.errorMessage(err);
	});

	$('.form-submit').on('click', app.generate_gif);

	$('.form-text')
	.on('keypress', app.generate_gif)
	.focus()

	$("form").validate();
	$.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Please check your input."
	);
	$(".timerange input[type=text]").each(function(){
		$(this).rules("add", { regex: "^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" });
	});

})();
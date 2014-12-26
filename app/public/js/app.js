(function () {

	var server = io.connect(window.location.origin);

	server.on('connect', function(data) {
		// chat.addChatter(nickname)
	})

	server.on('messages', function(data){
		console.log(data);
		$(".video-container").append($("<a href='"+data.url+"' target='_blank'>"+data.info.title+"</a>"))
	});

	server.on('info', function(info){
		console.log(info);
	});

	$('.form-text')
	.on('keypress', function(e) {
		if (!$('form').valid())
			return;
		if (e.which === 13 || e.which === 1) {
			e.preventDefault();
			var url = $('.form-text').val();
			if (url != "") {
				data = serializeObject($("form"));
				if (data.starttime == "")
					data.starttime = "00:00:00";
				if (data.endtime == "")
					delete data.endtime;
				server.emit('generate', data);
				// $('form')[0].reset();
			}
		}
	})
	.focus()

	var serializeObject = function(form) {
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
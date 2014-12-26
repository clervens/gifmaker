	var express  = require('express'),
	socket   = require('socket.io'),
	http     = require('http'),
	ytdl 	 = require('ytdl-core'),
	ffmpeg 	 = require('fluent-ffmpeg');

var app     = express();
	server  = http.createServer(app),
	// io      = socket.listen(server);
	/*----- log: false disables the debug messages in the console ------*/
	io      = socket.listen(server, { log: false });

/*---------------------------------------*
 * Views Engine
 *---------------------------------------*/
app.set('view options', { layout: false })
app.set('view engine', 'ejs')
app.set('views', __dirname + '/app/views')

/*---------------------------------------*
 * Public Files
 *---------------------------------------*/
 // src="/css/style.css"
app.use( express.static(__dirname + '/app/public'))

/*---------------------------------------*
 * SocketIO Events
 *---------------------------------------*/
io.sockets.on('connection', function(client) {
	console.log('Client connected...');

	client.on('disconnect', function(name) {

	});

	client.on('generate', function(data) {
		var filename = Math.random().toString(36).substring(7);
		stream = ytdl(data.url);

		ytdl.getInfo(data.url, {}, function(err, info){
			client.emit('info', info);

			console.log("Starting processing");
			console.log("URL: ", data.url);

			format = data.format;

			proc = new ffmpeg({source:stream});
			if (data.endtime) {
				proc.duration((function(){
					var timeStart = new Date("01/01/2007 " + data.starttime).getSeconds();
					var timeEnd = new Date("01/01/2007 " + data.endtime).getSeconds();

					return timeEnd - timeStart;
				})());
			}
			if (!process.env.BUILDPACK_URL)
				proc.setFfmpegPath(__dirname+'/app/lib/ffmpeg');
			proc.size('320x240')
			.seek(data.starttime)
			.on('error', function(err) {
				console.log('An error occurred: ' + err.message);
			})
			.on('end', function() {
				client.emit('messages', {
					info: info,
					message: 'done',
					url: "/exports/" + filename + "." + format,
					filename: filename,
					format: format
				});
				console.log('Processing finished !');
			})
			.format(format)
			.save(__dirname+"/app/public/exports/"+filename+"."+format);

		});
	});
});
;

/*---------------------------------------*
 * Routes
 *---------------------------------------*/
app.get('/', function(req, res) {
	/*-----Render View------*/
	res.render('index', {
		title: "Test GifMaker",
	})
});

server.listen(process.env.PORT || 4000);
console.log('Listening on port '+(process.env.PORT || 4000)+'...');



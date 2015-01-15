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

		FRAMES_PER_SECOND = 13;

		data = require(__dirname+"/modules/yt-data-parser.js")(data);
		filename = Math.random().toString(36).substring(7);
		if (!data.valid_url()){
			client.emit('fail', {message: "invalid youtube video link or id"});
			return;
		}
		stream = ytdl(data.url);

		ytdl.getInfo(data.url, {}, function(err, info){
			client.emit('info', info);

			console.log("Starting processing");
			console.log("URL: ", data.url);

			format = data.format;
			duration = 30;

			proc = new ffmpeg({source:stream});
			
			proc.duration((function(){
				if (data.endtime) {
					var timeStart = new Date("01/01/2007 " + data.starttime).getSeconds();
					var timeEnd = new Date("01/01/2007 " + data.endtime).getSeconds();

					duration = Math.min(30, Math.max(1, timeEnd - timeStart));
				}
				return duration;
			})());
			if (!process.env.BUILDPACK_URL)
				proc.setFfmpegPath(__dirname+'/app/lib/ffmpeg'); 
			proc.videoFilters(data.videoFilters)
			// .size('420x?')
			.seek(data.starttime)
			.fps(FRAMES_PER_SECOND)
			.noAudio()
			.format(format)
			.on('error', function(err) {
				console.log('An error occurred: ' + err.message);
				client.emit('fail', {message: err.message});
			})
			.on('progress', function(progress) {
				client.emit('progress', progress.frames/(duration*FRAMES_PER_SECOND));
			})
			.on('end', function() {
				client.emit('completed', {
					info: info,
					url: client.handshake.headers.referer + "exports/" + filename + "." + format,
					filename: filename,
					format: format
				});
				console.log('Processing finished !');
			})
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
		title: "Cvolcy GifMaker",
		description: "Create animated gifs or webms from your favorite Youtube videos. You just need the URL of the Youtube video, the time where it should start and when it should end.",
		req: req
	})
});
app.use('/', require('./routes/contact'));

server.listen(process.env.PORT || 4000);
console.log('Listening on port '+(process.env.PORT || 4000)+'...');



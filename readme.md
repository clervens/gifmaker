[![Code Climate](https://codeclimate.com/github/clervens/gifmaker/badges/gpa.svg)](https://codeclimate.com/github/clervens/gifmaker)

CVolcy - GifMaker
----
Cvolcy-gifmaker is a simple app that create animated gifs or webms from your favorite Youtube videos. 

You just need the URL of the Youtube video, the time where it should start and when it should end.

## Requirements

### Modules dependencies

	- ejs `~1.0`  
	- express `~4.10`  
	- fluent-ffmpeg `~2.0`  
	- http `~0.0`  
	- package.json `~0.0`  
	- socket.io `~1.2`  
	- url `~0.10`  
	- ytdl-core `~0.2`  

**Node version** : *0.10.31*

and [FFMpeg](https://www.ffmpeg.org/) version 2.5.1 and up.

***

Hosted on Heroku @ [gif.cvolcy.com](http://clervens-gif.herokuapp.com/) with these buildpacks [buildpack-multi](https://github.com/ddollar/heroku-buildpack-multi), [ffmpeg-buildpack](https://github.com/clervens/heroku-buildpack-ffmpeg.git) and [nodeJs-buildpack](https://github.com/heroku/heroku-buildpack-nodejs).

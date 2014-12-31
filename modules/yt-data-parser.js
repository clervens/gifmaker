var constructor = function (data) {
	DATE_REGEX = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
	YT_URL_REGEX = /(https?:\/\/)?(www.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/watch\?feature=player_embedded&v=)([A-Za-z0-9_-]*)(\&\S+)?(\?\S+)?/;
	FORMATS = ["gif", "webm"];
	function timeFormatCheck (value, default_value) {
		if (DATE_REGEX.test(value)) {
			return value;
		} else {
			return default_value;
		}
	}
	data.starttime = timeFormatCheck(data.starttime, "00:00:00");
	data.endtime = timeFormatCheck(data.endtime, undefined);

	data.format = (function() {
		if (FORMATS.indexOf(data.format) > -1) {
			return data.format;
		} else {
			return "gif";
		}
	})();
	data.videoFilters = (function() {
		console.log(data);
		if (data.abstatus) {
			return 'scale=480:-1';
		} else {
			return 'movie='+__dirname+'/../app/public/exports/watermark.png [watermark]; [in]scale=480:-1 [scale]; [scale][watermark] overlay=(main_w-overlay_w):(main_h-overlay_h) [out]';
		}
	})();
	data.valid_url = function() {
		console.log(YT_URL_REGEX.test(data.url));
		return YT_URL_REGEX.test(data.url);
	}
	console.log(data);
	return data;
}

module.exports = constructor;
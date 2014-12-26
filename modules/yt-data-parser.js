var constructor = function (data) {
	date_regex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
	FORMATS = ["gif", "webm"];
	function timeFormatCheck (value, default_value) {
		if (date_regex.test(value)) {
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
 	console.log(data);
	return data;
}

module.exports = constructor;
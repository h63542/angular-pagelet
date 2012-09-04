define(function (require, exports, module) {
	function parseUri (str) {
			var	o   = {
				strictMode: false,
				key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
				q:   {
					name:   "queryKey",
					parser: /(?:^|&)([^&=]*)=?([^&]*)/g
				},
				parser: {
					strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
					loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
				}
			};

			var	m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
				uri = {},
				i   = 14;

			while (i--) uri[o.key[i]] = m[i] || "";

			uri[o.q.name] = {};
			uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
				if ($1) uri[o.q.name][$1] = $2;
			});

			return uri;
	};
	exports.parseLocation2Pagelet = function(url){
		var pagelets = [],uri = parseUri(url);
		pareseAnchor(uri["anchor"]);
		function pareseAnchor(anchor){
			var nextAnchor,anchorPath,prex,pageletPaths,pageletInfo;
			if(!anchor || anchor.length === 0){
				return;
			}
			nextAnchor = parseUri(anchor);
			anchorPath = nextAnchor["path"];
			prex = /^\/([a-z0-9_\.-]+)\/([a-z0-9_\.-]+)(\/[a-z0-9_\.\/-]+)?/g;
			pageletPaths = prex.exec(nextAnchor["path"]);
			if(pageletPaths){
				pageletInfo = {
					pageletName:pageletPaths[1],
					stateName:pageletPaths[2],
					path:pageletPaths[3],
					queryParam:nextAnchor["queryKey"]
				}
				pagelets.push(pageletInfo);
			}
			pareseAnchor(nextAnchor["anchor"]);
		}
		return pagelets;
	}
	/// $waitUntil
	///     waits until a certain function returns true and then executes a code. checks the function periodically
	/// parameters
	///     check - a function that should return false or true
	///     onComplete - a function to execute when the check function returns true
	///     delay - time in milliseconds, specifies the time period between each check. default value is 100
	///     timeout - time in milliseconds, specifies how long to wait and check the check function before giving up
	exports.$waitUntil =  function (check,onComplete,delay,timeout) {
	    // if the check returns true, execute onComplete immediately
	    if (check()) {
	        onComplete();
	        return;
	    }
	    if (!delay) delay=100;
	    var timeoutPointer;
	    var intervalPointer=setInterval(function () {
	        if (!check()) return; // if check didn't return true, means we need another check in the next interval
	        // if the check returned true, means we're done here. clear the interval and the timeout and execute onComplete
	        clearInterval(intervalPointer);
	        if (timeoutPointer) clearTimeout(timeoutPointer);
	        onComplete();
	    },delay);
	    // if after timeout milliseconds function doesn't return true, abort
	    if (timeout) timeoutPointer=setTimeout(function () {
	        clearInterval(intervalPointer);
	    },timeout);
	};

})
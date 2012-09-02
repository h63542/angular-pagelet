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
	exports.parseLocation2Pagelet(url){
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
})
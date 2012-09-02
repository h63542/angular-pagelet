#!/usr/bin/env node

var sys = require('sys');
var uri = parseUri("http://127.0.0.1:8001/index.html?a=1&b=2#/pagelet1/state1222/ass/ss?pn=123&huangzhi=3#/pagelet2/state2/3?c=2");
// for(var key in uri){
// 	if(uri.hasOwnProperty(key)){
// 		console.log(key+":");
// 		console.log(uri[key]);
// 	}
// }
var pagelets = [];
pareseAnchor(uri["anchor"]);
function pareseAnchor(anchor){
	var nextAnchor,anchorPath,prex,pageletPaths,pageletInfo;
	console.log(anchor)
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
console.log(pagelets);

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


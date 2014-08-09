/*!
 * Pad and PadUI drawpad API v0.1.0
 * http://lenkyun.tk/drawpad
 *
 * Copyright 2014 Rapeapach Suwasri
 * Released under the MIT license
 * http://lenkyun.tk/drawpad/license
 *
 * Date: 2014-08-09T15:12Z
 */
 
(function( w, $, func, require, define ){
	var error = [], msg;
	if( typeof $ === "undefined" || typeof console === "undefined" ){
		msg = "[drawpad] drawpad require jQuery to run, please set-it-up on your page.";
		error.push( msg );
		console.error( msg );
	}
	
	if( typeof w.document === "undefined" || typeof console || "undefined" ){
		msg = "[drawpad] Can't find document, please ensure that you run this script on the browser.";
		error.push( msg );
		console.error( msg );
	}
	
	if( typeof require === "undefined" && typeof define === "undefined" ){
		msg = "[drawpad] drawpad require RequireJS to run, please set-it-up on your page.";
		error.push( msg );
		console.error( msg );
		require = function(){};
		define = function(){};
	}
	
	func( w, w.document, $, $.extend, error, require, define );
	
}(typeof window !== "undefined" ? window : this, jQuery, require, define, function( window, document, $, extend, _error, require, define ){
	define('Pad/object/Settings',[],function(){

	define('Pad/object/Layer',[

	define('Pad/object',[

	define('Pad/object/RGBA',[

	define('Pad/core',[

	define('Pad/pad',[

	define('drawpad',[

	window.drawpad = require("drawpad");
}));
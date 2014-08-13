/*!
 * Pad and PadUI drawpad API v@VERSION
 * http://lenkyun.tk/drawpad
 *
 * Copyright 2014 Rapeapach Suwasri
 * Released under the MIT license
 * http://lenkyun.tk/drawpad/license
 *
 * Date: @DATE
 */
 
(function( w, $, func ){
	var error = [], msg;
	if( typeof $ === "undefined" || typeof console === "undefined" ){
		msg = "[drawpad] drawpad require jQuery to run, please set-it-up on your page.";
		error.push( msg );
		console.warn( msg );
	}
	
	if( typeof w.document === "undefined" || typeof console === "undefined" ){
		msg = "[drawpad] Can't find document, please ensure that you run this script on the browser.";
		error.push( msg );
		console.warn( msg );
	}
		
	func( w, w.document, $, $.extend, error);
	
}( typeof window !== "undefined" ? window : this, jQuery, function( window, document, $, extend, _error ){

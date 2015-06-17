define([
	"./Pad/pad",
	"./PadUI/padui"
], function(pad, padui){
	var drawpad = {},
		data = {
			"Pad": pad,
			"PadUI": padui,
			"window": window,
			"jQuery": $,
			"document": document
		}, event = {};
		
	var get = function( str ){
		if( str && data[ str ] ){
			return data[ str ];
		}
		return false;
	};
	
	extend( event, {
		ok: {
			status: function(){
				return _error.length === 0;
			},
			call: function( callback ){
				callback( { get: get } );
			}
		},
		error: {
			status: function(){
				return _error.length !== 0;
			},
			call: function( callback ){
				callback( _error );
			}
		},
	});
	
	/*
	 * Status object is similar to ./Pad/object/status
	 *   @stat - status name
	 */
	drawpad.on = function( stat, callback ){
		$( document ).ready( function(){
			if( typeof event[stat] !== "undefined" && event[stat].status() ){
				event[ stat ].call( callback );
			}
		});
		return this;
	};
	
	window.drawpad = drawpad;
	
	return drawpad;
});
define([
	"./object/Settings",
	"./object/Layer",
	"./object/RGBA",
	"./object/Position",
	"./object/Mode"
], function( Settings, Layer, RGBA, Position, Mode ){
	var object = function(){
		var object = {};	
		
		extend( object, {
			Settings: Settings,
			Layer: Layer,
			RGBA: RGBA,
			Position: Position,
			Mode: Mode
		});
		
		return object;
	};
	
	object = object();
	
	// define variables as undefined
	Settings = undefined;
	Layer = undefined;
	RGBA = undefined;
	Position = undefined;
	Mode = undefined;
	
	return object;
});
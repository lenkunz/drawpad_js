/*
 * drawpad
 * https://github.com/lenkyun/drawpad_js
 *
 * Copyright (c) 2014 Rapeapach Suwasri
 * Licensed under the CC0, 1.0 licenses.
 */

define(["./Pad/core", "/PadUI/core"], function(Pad, PadUI){
	var drawpad = {},
		data = {
			"Pad": Pad,
			"PadUI": PadUI
		};
	
	drawpad.get = {
		get: function(str){
			if(str && data[str]){
				return data[str];
			}
			return false;
		}
	};
	
	return drawpad;
});

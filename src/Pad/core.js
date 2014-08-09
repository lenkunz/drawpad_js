define([
	"./object/Layer",
	"./object/Settings",
	"./object/RGBA"
], function(Layer, Settings, RGBA){
	var pad = {}, setting, style;
	pad.extend = $.extend;
	
	setting = new Settings({
		TIME_DELAY: 10,
		replaySpeed: 1,
		CANVAS_WIDTH: 800,
		CANVAS_HEIGHT: 480,
		CANVAS_EVENTOFFSET: 100,
		HISTORY_LIMIT: 100,
		LAYERPAD_WIDTH: 150,
		SAMEPOINT_LIMIT: 1,	
	});
	setting.create(pad);

	style = new Settings({
		color: new RGBA(0, 0, 0, 100),
		width: 20,
		draw: 0, // line
		layer: 0,
	});
	setting.style(pad);
	
	/* Section: setting */
	pad.extend({
		setting: setting.get(pad).setting,
		style: style.get(pad).setting 
	});
	
	setting = pad.setting;
	style = pad.style;
	/* End Section: setting */

		
	pad.extend({
		// Initialize the Pad
		init: function(jqueLayersContainer, jqueWriteContainer){
			console.groupCollapsed( "%c[drawpad.history.replay] Start init state.", "color: darkgreen; font-weight: bold" );
			this.layer.root = jqueLayersContainer;
			this.layer.create();
			console.log( "%c[drawpad.init] Init Layer Created.", "font-weight: bold; color: darkgreen" );
			
			// set Event
			$(document).mousemove(this.mouseEvent.move);
			$(window).mousedown(this.mouseEvent.down);
			$(window).mouseup(this.mouseEvent.up);
			console.log( "%c[drawpad.init] Events have been set.", "font-weight: bold; color: darkgreen" );

			this.layer.write = new Layer(0, "drawpad-write", setting.CANVAS_WIDTH, setting.CANVAS_HEIGHT);
			jqueWriteContainer.append(this.write().DOM.$);
			console.log( "%c[drawpad.init] Pen layer has been set.", "font-weight: bold; color: darkgreen" );
			this.layer.index(0);
			console.groupEnd();
		},
		// Set current session style
		setStyle: function(colorRGBAInt, width){
			var rgba = new RGBA(colorRGBAInt);
			var rgbaCSS = rgba.getCSS();

			var alpha = rgba.alpha() / 255;
			this.write().DOM.context.strokeStyle = rgbaCSS;
			this.write().DOM.context.fillStyle = rgbaCSS;
			this.write().DOM.context.lineWidth = width;
			this.layer().DOM.context.globalAlpha = alpha;
			
			style.width = width;
			style.color = rgba;
			
			this.write().opacity(rgba.alpha());
		},		
		// Shortcut to layer.write
		write: function(){
			return this.layer.write;
		}
	});

	return pad;
});
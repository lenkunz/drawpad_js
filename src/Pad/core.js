define([
	"./object",
], function(object){
	var pad = function(){
		var pad = {}, setting, style;
		pad.extend = $.extend;
		
		/* Section: setting */
		setting = new object.Settings({
			TIME_DELAY: 10,
			replaySpeed: 1,
			CANVAS_WIDTH: 800,
			CANVAS_HEIGHT: 480,
			CANVAS_EVENTOFFSET: 100,
			HISTORY_LIMIT: false,
			LAYERPAD_WIDTH: 150,
			SAMEPOINT_LIMIT: 1,	
		});
		setting = setting.create( pad );
		var ev = setting.event,
			blankEvent = extend( {}, setting.event );
		delete setting.event;

		style = new object.Settings({
			color: new object.RGBA( 0, 0, 0, 100 ),
			width: 20,
			draw: 0, // line
			layer: 0,
		});
		style.create( pad );
		
		pad.extend({
			setting: setting,
			style: style
		});		
		/* End Section: setting */

			
		pad.extend({
			// Initialize the Pad
			settings: setting,
			on: function( name, func ){
				return ev.on( name, func );
			},
			init: function( obj ){
				var e = extend( {}, blankEvent );
				
				setTimeout( function(){
					var msg;
					console.groupCollapsed( "%c[drawpad.history.replay] Start init state.", "color: darkgreen; font-weight: bold" );
					if( typeof pad.layer !== "undefined" ){
						pad.layer.root( obj.layer );
						pad.layer.regisPad( pad );
						pad.layer.create();
						console.log( "%c[drawpad.init] Init object.Layer Created.", "font-weight: bold; color: darkgreen" );
					} else {
						msg = "Init not successful, layer not loaded";
						console.warn( "%c[drawpad.init] %s", "font-weight: bold; color: darkgreen", msg );
						e.run( "error", pad, { message:  msg } );
					}
					
					if( typeof pad.mouseEvent !== "undefined" ){
						// set Event
						$(document).mousemove(this.mouseEvent.move);
						$(window).mousedown(this.mouseEvent.down);
						$(window).mouseup(this.mouseEvent.up);
						console.log( "%cEvents have been set.", "font-weight: bold; color: darkgreen" );
					} else {
						msg = "Init not successful, mouseEvent not loaded";
						console.warn( "%c[drawpad.init] %s", "font-weight: bold; color: darkgreen", msg );
						e.run( "error", pad, { message: msg } );
					}

					if( typeof pad.modes !== "undefined" ){
						pad.modes.regisPad( pad );
						console.log( "%cModes node has been set.", "font-weight: bold; color: darkgreen" );
					} else {
						msg = "Init not successful, modes not loaded";
						console.warn( "%c[drawpad.init] %s", "font-weight: bold; color: darkgreen", msg );
						e.run( "error", pad, { message: msg } );
					}

					pad.layer.write( new object.Layer(0, "drawpad-write", setting.get( "CANVAS_WIDTH" ), setting.get( "CANVAS_HEIGHT" )) );
					obj.write.append( pad.layer.write().getDOM( "$" ) );
					console.log( "%c[drawpad.init] Pen layer has been set.", "font-weight: bold; color: darkgreen" );
					pad.layer.index(0);
					console.groupEnd();
					e.run( "ok", pad, {} );
				}, 1 );
				
				return e;
			},
			// Set current session style
			setStyle: function( obj, value ){
				var context, rgba, rgbaCSS, alpha;
				if( typeof value !== undefined ){
					switch( String.toString(obj).toLowerCase() ){
						case "rgba":
							rgba = new object.RGBA( value );
							rgbaCSS = rgba.getCSS();
							alpha = rgba.aplha() / 255;
							
							context = pad.layer.write().getDOM( "context" );
							context.strokeStyle = rgbaCSS;
							context.fillStyle = rgbaCSS;
							context.globalAlpha = alpha;
							style.set( "rgba", rgba );
						break;
						case "width":
							context = pad.layer.write().getDOM( "context" );
							context.lineWidth = value;
							style.set( "width", value );
						break;
						case "layer":
							style.set( "layer", value );						
						break;
					}
				} else {
					for( var i in obj ){
						pad.setStyle( i, obj[i] );
					}
				}

				return this;
			},
			getStyle: function( name ){
				return style.get( name );
			}
		});
	};

	return pad();
});
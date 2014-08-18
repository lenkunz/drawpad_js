/*!
 * Pad and PadUI drawpad API v0.1.0
 * http://lenkyun.tk/drawpad
 *
 * Copyright 2014 Rapeapach Suwasri
 * Released under the MIT license
 * http://lenkyun.tk/drawpad/license
 *
 * Date: 2014-08-18T12:37Z
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

	var Settings = function(){
		var Settings = {},
			intCount = 0,
			data = {};
		
		Settings = function( obj ){
			if( obj ){
				this.indexer = intCount;
				this.set(obj);
				data[intCount++] = {};
			}
		};
		
		
		Settings.prototype = {
			ex: {},
			indexer: -1,
			get: function( obj ){
				if(typeof obj !== "undefined" && typeof data[ this.indexer ][obj] !== "undefined"){
					return data[ this.indexer ][ obj ];
				}
				return 0;
			},
			create: function( obj ){
				data[ this.indexer ][ obj ] = $.extend( true, {}, this.ex );
				return data[ this.indexer ][ obj ];
			},
			set: function( obj ){
				var event, set, add, get, isset;
				
				event = {
					data: {},
					add: function( name, call ){
						if( typeof name === "undefined" ){
							return false;
						}
						if( typeof this.data[name] === "undefined" ){
							this.data[name] = [];
						}
						if( typeof call === "function" ){
							this.data[name].push(call);
						}
						return true;
					},
					remove: function( name, call ){
						var index, count = 0;
						if( typeof this.data[name] === "undefined" ){
							return count;
						}
						while( (index = this.data[name].indexOf(call)) !== -1 ){
							this.data[name].splice(index, 1);
							count++;
						}
						return count;
					},
					run: function( name, sender, data ){
						if( typeof this.data[name] === "undefined" ){
							return false;
						}
						for( var call in this.data[name] ){
							try{
								this.data[name][call]( sender, data );
							}catch( e ){}
						}
						return true;
					},
					has: function( name, call ){
						for( var index in this.data ){
							if( index === name ){
								if( typeof call !== "undefined" ){
									call();
								}
								return true;
							}
						}
						return false;
					},
					list: function(){
						var result = [];
						for( var index in this.data ){
							result.push( index );
						}
						return result;
					},
					on: function( name, func ){
						if( this.has( name ) ){
							this.add( name, func );
						}
					}
				};
				
				set = function ( a, b ){
					if( typeof a !== "undefined"){
						if( typeof b !== "undefined" ){
							if( arguments.length > 2 ){
								var referer = this.data, i;
								for( i = 0; i < arguments.length - 2; i++ ){
									referer = referer[ arguments[ i ] ];
								}
								referer[ arguments[ i ] ] = arguments[ i + 1 ];
							} else {
								this.data[ a ] = b;
							}
						} else {
							extend( this.data, a );
						}
					} else {
						return false;
					}
					return this;
				};
				
				// Get values from setting
				// @a - name of variables
				// @... - subname of parameters before this
				get = function ( a ){
					if( typeof a !== "undefined" && typeof this.data[ a ] !== "undefined" ){
						var value, v;
						value = this.data;

						for( var i in arguments ){
							v = arguments[i];
							if( typeof value[ v ] !== "undefined" ){
								value = value[ v ];
							} else {
								return undefined;
							}
						}
						
						return value;
					} else {
						return undefined;
					}
				};
				
				isset = function( name ){
					if( typeof name !== "undefined" ){
						var value = this.data, v;

						for( var i in arguments ){
							v = arguments[i];
							if( typeof value[ v ] !== "undefined" ){
								value = value[ v ];
							} else {
								return false;
							}
						}
						
						return true;
					} else {
						return false;
					}
				};
				
				add = function ( a, returnAdded ){
					if( typeof a !== "undefined" && !isNaN( this.data[ a ] ) ){
						if( typeof returnAdded !== "undefined" && returnAdded === true ){
							return ++this.data[ a ];
						} else {
							return this.data[ a ]++;
						}
					} else {
						return false;
					}
				};

				this.ex = {
					data: obj,
					event: event,
					set: set,
					get: get,
					add: add,
					isset: isset,
				};
				
				return this;
			}			
		};
		
		return Settings;
	};
	
	Settings = Settings();

	var Layer = function(){
		// Layer - Object
		// Private static zone
		var indexOffset = 10;

		// create settings
		var setting = new Settings({
				id: -1,
				index: -1,
				opacity: 255,
				name: "Layer #-1",
				width: 0,
				height: 0,
				DOM: {
					$: false,
					element: false,
					context: false,
					previewPad: false,
					contextPad: false
				}
			});
			
		var indexCount = 0;
			
		// constructor
		var Layer = function(index, className, width, height){
			// init
			this.indexer = indexCount;
			var s = setting.create( indexCount++ );
			this.s = setting;
			s.set({
				id: index,
				index: index,
				opacity: 255,
				name: "Layer #" + index,
				width: width,
				height: height
			});
			
			// init DOM
			var canvas = $("<canvas></canvas>").attr({
				"id": className + "_" + index,
				"width": width,
				"height": height
			}).addClass(className);
			
			var preview = $("<canvas></canvas>").attr({
					width: width,
					height: height
				})[0];
			
			s.set( "DOM", {
					$: canvas,
					element: canvas[0],
					context: canvas[0].getContext("2d"),
					previewPad: preview,
					contextPad: preview.getContext("2d")
				});
			
			s.event.add( "clear" );
			s.event.add( "reorder" );
			s.event.add( "opacity" );
			s.event.add( "rename" );
			s.event.add( "remove" );
			s.event.add( "changethis" );
			
			this.order( s.get( "id" ) );
			this.opacity( 255 );
			console.log("%c[drawpad/object/Layer] " + className + "'s layer was created.", "font-weight: bold; color: orange;");		
		};
		
		// public functions and variable
		Layer.prototype = {
			layer: true,
			indexer: -1,
			on: function( name, func ){
				var s = setting.get( this.indexer );
				if( s.event.has( name ) ){
					s.event.add( name, func );
				}
			},
			listEvent: function(){
				return setting.get( this.indexer ).event.list();
			},
			// Get element
			getDOM: function( name ){
				var s = setting.get( this.indexer );
				if( s.isset( "DOM", name ) ){
					return s.get( "DOM", name );
				} else {
					return false;
				}
			},
			// Clear canvas
			clear: function(){
				var s = setting.get( this.indexer ); // Settings
				if( s.isset( "DOM", "context" ) ){
					s.get( "DOM", "context" ).clearRect( 0, 0, s.get( "width" ), s.get( "height" ) );
				}
				if( s.isset( "DOM", "contextPad" ) ){
					s.get( "DOM", "contextPad" ).clearRect( 0, 0, s.get( "width" ), s.get( "height" ) );
				}

				s.event.run( "clear", this, {});
				return this;
			},
			order: function( i ){
				var s = setting.get( this.indexer );
				if( typeof i === "undefined" ){
					return s.get( "index" );
				}else if( i >= 0 && i < 2000 ){
					s.set( "index", i );
					if( s.isset( "DOM", "$" ) ){
						s.get( "DOM", "$" ).css( "z-index", indexOffset + i );
					}
				}
				s.event.run( "reorder", this, { value: i } );
				return this;
			},
			opacity: function( o ){
				var s = setting.get( this.indexer );
				if( typeof o === undefined ){
					return s.get( "opacity" );
				}else if( o >= 0 && o <= 255 ){
					s.set( "opacity", o );
					if( s.isset( "DOM", "$" ) ){
						s.get( "DOM", "$" ).css("opacity", o / 255);
					}
				} else {
					console.error( "[drawpad.object.Layer] Opcaity is out of range [0-255][" + o + "]" );
				}
				s.event.run( "opacity", this, { value: o });
				return this;
			},
			name: function(name){
				var s = setting.get( this.indexer );
				if( typeof name === "undefined" ){
					return s.get( "name" );
				} else {
					s.set( "name", String.toString(name) );
					s.event.run( "rename", this, { value: name } );
					return this;
				}
			},
			getDataURL: function(){
				return setting.get( this.indexer ).get( "DOM", "element" ).getDataURL();
			},
			remove: function(){
				var s = setting.get( this.indexer );
				s.get( "DOM", "$" ).remove();
				$( s.get( "DOM", "previewPad" ) ).remove();
				s.event.run("remove", this, { layer: this });
			},
			changethis: function(){
				setting.get( this.indexer ).event.run("changethis", this, { layer: this });				
			}
		};
		
		return Layer;
	};
	
	Layer = Layer();

	var RGBA = function(){
		// RGBA - Object
		// Private static zone
		var RGBA;
				
		// constructor
		RGBA = function( r, g, b, a ){
			if ( r && r.rgba ){
				this.value = r.getInt();
			} else if ( typeof r !== "undefined" && typeof g !== "undefined" && typeof b !== "undefined" && typeof a !== "undefined" ){
				this.value = RGBA.toInt(r, g, b, a);
			} else if ( !isNaN(r) ){
				this.value = r;
			}
		};
		
		// static
		$.extend(RGBA, {
			value: 255,
			toInt: function(r, g, b, a){
				if (r.rgba){
					return r.color();
				} else if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)){
					return false;
				}
				
				var color = r;
				color = (color << 8) + g;
				color = (color << 8) + b;
				color = (color << 8) + a;
				return color;
			},
			toRGBA: function(rgba){
				return new RGBA(rgba);
			},
			toCSS: function(rgba){
				if(!rgba && !rgba.rgba){
					return false;
				}
				return "rgb(" + rgba.red() + ", " + rgba.green() + ", " + rgba.blue() + ")";
			},
			toCSSFromInt: function(rgbaInt){
				var rgba = this.toRGBA(rgbaInt);
				return this.toCSS(rgba);
			}
		});	
		// public function and variables
		RGBA.prototype = {
			rgba: true,
			red: function( i ){
				if ( i !== undefined && !isNaN(i) ){
					if ( i >= 0 && i <= 255 ){
						var n = this.value & 0x00FFFFFF;
						n = n + ( i << 24 );
						this.value = n;
					} else {
						console.warn( "[drawpad/object/RGBA.red] Color is out of bound [0-255][%i]", i );
					}
				} else {
					return ( this.value >> 24 ) & 0xFF;
				}
			},
			green: function( i ){
				if ( i !== undefined && !isNaN(i) ){
					if( i >= 0 && i <= 255 ){
						var n = this.value & 0xFF00FFFF;
						n = n + ( i << 16 );
						this.value = n;
					} else {
						console.warn( "[drawpad/object/RGBA.green] Color is out of bound [0-255][%i]", i );
					}
				} else {
					return ( this.value >> 16 ) & 0xFF;
				}
			},
			blue: function( i ){
				if ( i !== undefined && !isNaN(i) ){
					if( i >= 0 && i <= 255 ){
						var n = this.value & 0xFFFF00FF;
						n = n + ( i << 8 );
						this.value = n;
					} else {
						console.warn( "[drawpad/object/RGBA.blue] Color is out of bound [0-255][%i]", i );
					}
				} else {
					return ( this.value >> 8 ) & 0xFF;
				}
			},
			alpha: function( i ){
				if( i !== undefined && !isNaN(i) ){
					if( i >= 0 && i <= 255 ){
						var n = this.value & 0xFFFFFF00;
						n = n + i;
						this.value = n;
					} else {
						console.warn( "[drawpad/object/RGBA.alpha] Alpha level is out of bound [0-255][%i]", i );
					}
				} else {
					return this.value & 0xFF;
				}
			},
			getCSS: function(){
				return this.value;
			},
			getInt: function(){
				return this.value;
			}
		};
		
		return RGBA;
	};
	
	RGBA = RGBA();

	var Position = function(){
		// RGBA - Object
		// Private static zone
		var Position, offset = 1024;
		
		// constructor
		Position = function( x, y ){

			if( x && x.position ){
				this.value = x.getInt();
			}else if( !isNaN(x) && !isNaN(y) ){
				this.value = Position.toInt(x, y);			
			}else if( !isNaN(x) ){
				this.value = x;
			}else if( x.x !== undefined && x.y !== undefined ){
				this.value = Position.toInt(x.x, x.y);
			}
		};
		
		// static
		$.extend(Position, {
			toInt: function( x, y ){
				var pi;
				
				if( x && x.position ){
					y = x.y();
					x = x.x();
				}else if( x.x !== undefined && x.y !== undefined ){
					y = x.x;
					x = x.y;
				}else if( isNaN( x ) || isNaN( y ) ){
					return false;
				}
				
				pi = ( x + offset );
				pi = ( pi << 12 ) + ( y + offset );
				return pi;
			},
			toPosition: function( pi ){
				return new Position( pi );
			},
			compare: function( pos1, pos2 ){
				var int1, int2;
				
				int1 = new Position( pos1 ).getInt();
				int2 = new Position( pos2 ).getInt();
				return int1 === int2;
			}
		});
		
		// public function and variables
		Position.prototype = {
			value: 0,
			position: true,
			x: function( i ){
				var n;
				if( i !== undefined && !isNaN(i) ){
					if( i >= -1024 && i <= 1024 ){
						n = this.value & 0x000FFF;
						n = n + ((i + 1024) << 12);
						this.value = n;
					} else {
						console.warn( "[drawpad/object/Position.x] Position is out of bound [n1024-1024][%i]", i );
					}
				} else {
					return ( ( this.value >> 12 ) & 0xFFF ) - 1024;
				}
			},
			y: function( i ){
				var n;
				if( i !== undefined && !isNaN( i ) ){
					if( i >= -1024 && i <= 1024 ){
						n = this.value & 0xFFF000;
						n = n + (i + 1024);
						this.value = n;
					}else{
						console.warn( "[drawpad/object/Position.y] Position is out of bound [n1024-1024][%i]", i );
					}
				} else {
					return ((this.value) & 0xFFF) - 1024;
				}
			},
			getInt: function(){
				return this.value;
			},
			compare: function( pos ){
				return Position.compare( this, pos );
			}
		};
		
		return Position;
	};
	
	Position = Position();

	var Mode = function(){
		/* Section: Modes - Mode */
		// Creator
		var Mode = function(dat){
			if( !dat ){
				dat = {};
			}
			return $.extend({}, Mode, dat);
		};
		
		// Static
		extend(Mode, {
			mode: true,
			name: "NewMode",
			thisIndex: -1,
			dataCheck: function(data){
				return data[this.defines.drawType] === this.thisIndex;
			},
			eventTrigger: function(){
				console.warn("[drawpad.object.Mode] call undefined eventTrigger!![%s][%0]", this.name, this);
			},
			eventSave: function(){
				console.warn("[drawpad.object.Mode] call undefined eventSave!![%s][%0]", this.name, this);
			},
			play: function(){
				console.warn("[drawpad.object.Mode] call undefined play!![%s][%0]", this.name, this);		
			},
			draw: function(){
				console.warn("[drawpad.object.Mode] call undefined draw!![%s][%0]", this.name, this);
			},
			data: {}
		});
		/* End Section: Object - Mode */
		
		return Mode;
	};
	
	Mode = Mode();

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

	var pad = function(){
		var pad = {}, setting, style, draw = 0;
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
		setting = setting.create( "0" );
		var ev = setting.event,
			blankEvent = extend( {}, setting.event );
		delete setting.event;

		style = new object.Settings({
			rgba: new object.RGBA( 0, 0, 0, 100 ),
			width: 20,
			draw: 0, // line
			layer: 0,
		});
		style = style.create( "0" );
		window.style = style;
		
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
			regisEvent: function( name, sender, data ){
				return ev.add( name, sender, data );
			},
			init: function( obj ){
				var e = extend( {}, blankEvent );
				e.add( "ok" );
				
				setTimeout( function(){
					var msg;
					console.groupCollapsed( "%c[drawpad.history.replay] Start init state.", "color: darkgreen; font-weight: bold" );	
					// Layer
					if( typeof pad.layer !== "undefined" ){
						pad.layer.regisPad( pad );
						pad.layer.root( obj.layer );
						console.log( "%c[drawpad.init] Init object.Layer Created.", "font-weight: bold; color: darkgreen" );
					} else {
						msg = "Init not successful, layer not loaded";
						console.warn( "%c[drawpad.init] %s", "font-weight: bold; color: darkgreen", msg );
						e.run( "error", pad, { message:  msg } );
						return;
					}
										
					// Mode
					if( typeof pad.modes !== "undefined" ){
						pad.modes.regisPad( pad );
						console.log( "%cModes node has been set.", "font-weight: bold; color: darkgreen" );
					} else {
						msg = "Init not successful, modes not loaded";
						console.warn( "%c[drawpad.init] %s", "font-weight: bold; color: darkgreen", msg );
						e.run( "error", pad, { message: msg } );
						return;
					}
					
					// Mode trigger start
					setInterval(function(){
						if(history.get( "replayState" )){
							return false;
						}
						pad.modes.get( style.get( "draw" ) ).eventTrigger();
					}, setting.get( "TIME_DELAY" ));

					// History
					if( typeof pad.history !== "undefined" ){
						pad.history.regisPad( pad );
						console.log( "%cHistory node has been set.", "font-weight: bold; color: darkgreen" );
					} else {
						msg = "Init not successful, History not loaded";
						console.warn( "%c[drawpad.init] %s", "font-weight: bold; color: darkgreen", msg );
						e.run( "error", pad, { message: msg } );
						return;
					}
										
					// Write
					var write = new object.Layer(0, "drawpad-write", setting.get( "CANVAS_WIDTH" ), setting.get( "CANVAS_HEIGHT" ));
					pad.layer.write( write );
					obj.write.append( pad.layer.write().getDOM( "$" ) );
					console.log( "%c[drawpad.init] Pen layer has been set.", "font-weight: bold; color: darkgreen" );

					// Create first layer
					pad.layer.create();

					pad.layer.index(0);
					console.groupEnd();
					
					// Mouse
					if( typeof pad.mouse !== "undefined" ){
						// set Event
						pad.mouse.regisPad( pad );
						$(document).mousemove(pad.mouse.move);
						$(window).mousedown(pad.mouse.down);
						$(window).mouseup(pad.mouse.up);
						console.log( "%cEvents have been set.", "font-weight: bold; color: darkgreen" );
					} else {
						msg = "Init not successful, mouse not loaded";
						console.warn( "%c[drawpad.init] %s", "font-weight: bold; color: darkgreen", msg, this.mouse );
						e.run( "error", pad, { message: msg } );
						return;
					}
					
					// Style
					pad.setStyle( "rgba", pad.getStyle( "rgba" ) );
					pad.setStyle( "width", pad.getStyle( "width" ) );

					e.run( "ok", pad, {} );
				} );
				
				return {
					on: function( name, func ){
						return e.on( name, func );
					}
				};
			},
			// Set current session style
			setStyle: function( obj, value ){
				var context, rgba, rgbaCSS, alpha;
				if( typeof value !== undefined ){
					switch( String(obj).toLowerCase() ){
						case "rgba":
							rgba = new object.RGBA( value );
							rgbaCSS = rgba.getCSS();
							alpha = rgba.alpha() / 255;
							
							context = pad.layer.write().getDOM( "context" );
							context.strokeStyle = rgbaCSS;
							context.fillStyle = rgbaCSS;
							pad.layer.write().opacity( rgba.alpha() );
							
							// normal Context
							context = pad.layer.getLayer().getDOM( "context" );
							context.globalAlpha = alpha;
							
							// preview Context
							context = pad.layer.getLayer().getDOM( "contextPad" );
							context.globalAlpha = alpha;
							
							style.set( "rgba", rgba );
							ev.run( "colorChange", this, { rgba: rgba } );
						break;
						case "width":
							context = pad.layer.write().getDOM( "context" );
							context.lineWidth = value;
							style.set( "width", value );
							ev.run( "widthChange", this, { width: value } );
						break;
						case "layer":
							style.set( "layer", value );
							ev.run( "layerChange", this, { index: value, layer: pad.layer() } );
						break;
						case "mode":
							if( pad.modes.get( value, true ) !== false ){
								style.set( "draw", value );
								draw = value;
							}
						break;
						case "flow":	
							if( value === true ){
								$("#flowzone").show();
							} else {
								$("#flowzone").hide();							
							}
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
		
		return pad;
	};
	
	pad = pad();

	var layer = function(){
		// Section - Layer
		// Private static zone
		var layer, setting;

		setting = new object.Settings({
			index: 0,
			write: false,
			root: false,
			count: 0,
			pad: false,
			indexCount: 0
		});
		setting = setting.create( 0 );
		var ev = setting.event;
		var data = [];
		
		ev.add( "create" );
		ev.add( "remove" );
		ev.add( "removeAll" );
		ev.add( "indexChange" );
		ev.add( "changeLayerSetting" );
		ev.add( "clearLayer" );
		ev.add( "reset" );
		
		// Defining function - not a constructor
		layer = function( i ){
			if( typeof i === "undefined" ){
				i = pad.layer.getLayer();
			}
			if( typeof i.layer === "undefined" ){
				i = pad.layer.getLayer(i);
			}
			return i;
		};
		
		var pad = false;
		
		// Public static function and variable
		extend(layer, {
			on: function( name, func ){
				return ev.on( name, func );
			},
			regisPad: function( padObject ){
				if( pad === false ){
					pad = padObject;
				}
			},
			root: function( e ){
				if( setting.get( "root" ) === false && e !== undefined ){
					setting.set( "root", e );
				}else{
					return setting.get( "root" );
				}
				return this;
			},
			write: function( e ){
				if( setting.get( "write" ) === false && typeof e !== "undefined" ){
					setting.set( "write", e );
				}else{
					return setting.get( "write" );
				}
			},
			create: function(){
				layer = new object.Layer(
					setting.add( "indexCount", true ), 
					"drawpad", 
					pad.settings.get( "CANVAS_WIDTH" ), 
					pad.settings.get( "CANVAS_HEIGHT" )
				);
				setting.get( "root" ).append( layer.getDOM( "$" ) );
				
				modes.get( "CreateLayer" ).eventSave();
				data.push( layer );
				window.data = data;
				ev.run( "create", this, { layer: layer } );
			},
			remove: function( i ){
				var dat = data, index;
				if( isNaN( index ) ){
					while( ( index = dat.indexOf(i) ) !== -1 ){
						this.remove( index );
					}
				} else {
					if( typeof dat[ index ] !== "undefined" ){
						ev.run( "remove", this, { layer: layer } );
						dat[ index ].remove();
						dat.splice( index, 1 );
						
					}
				}
				return this;
			},
			removeAll: function(){
				$.each(data, function(i, o){
					ev.run( "remove", this, { layer: o } );
					o.getDOM( "$" ).remove();
				});
				data = [];
				this.resetCount();
				console.log("%c[drawpad.layer.removeAll] All layer was removed.", "font-weight: bold; color: darkorange");
				ev.run( "removeAll", this, {} );
			},
			index: function( i ){
				if( typeof i === "undefined" ){
					return this.getLayer();
				} else if ( !isNaN( i ) ) {
					if( i < 0 ){
						return false;
					}
					if( i === setting.get( "index" ) ){
						return true;
					}
					if( i > data.length ){
						return false;
					}
					
					this.write().order( i );
					setting.set( "index", i );
					console.log( "%c[drawpad.layer.index] Layer index changed to [%i].", "font-weight: bold; color: darkorange", i );	

					try{
						pad.setStyle( "layer", i );
					}catch(e){
						console.warn("[drawpad.layer.index] Error in style.layer.");
					}
					this.getLayer().changethis();
					ev.run( "changeIndex", this, { layer: this.getLayer() } );
				} else if( i.layer ) {
					var x;
					if( ( x = data.indexOf( i ) ) !== -1 ){
						this.index( x );
						ev.run( "changeIndex", this, { layer: this.getLayer() } );
					} else {
						return false;
					}
				}
				return true;
			},
			set: function( setting ){
				var o, l, old;
				l = this();
				o = this.defines.options;
				
				switch( setting.mode ){
					case o.opacity:
						old = l.opacity();
						l.opacity(setting.value);
					break;
					case o.name:
						old = l.name();
						l.name(setting.value);
					break;
				}
				
				var data = {
					mode: setting.mode,
					oldvalue: old,
					newvalue: setting.value,
				};
				pad.modes.get( "ChangeLayerSetting" ).eventSave( data );
				ev.run( "changeLayerSetting", this, data );
			},
			clear: function(){
				$.each( data, function(i, o){
					o.clear();
					ev.run( "clear", this, { layer: o } );
				});
			},
			defines: {
				options: {
					opacity: 0,
					name: 1,
					order: 2
				}
			},
			getLayer: function( i ){
				if ( typeof i === "undefined" ){
					return data[setting.get( "index" )];
				} else if ( i > data.length ){
					return false;
				} else{
					return data[i];
				}
			},
			list: function(){
				return data;
			},
			resetCount: function(){
				setting.set( "count", 0 );
				ev.run( "reset", this, {} );
			},
		});
		return layer;
	};
	
	layer = layer();
	/* End Section: Layer */


	// Modes - core
	var modes = function(){
		var modes = {},		
			setting = new object.Settings({
				data: {}
			});
		setting = setting.create( 0 );
		
		$.extend( modes, {
			regisPad: function( pad ){
				var v = setting.get( "data" );
				for( var i in v ){
					v[i].regisPad( pad );
				}
			},
			add: function( index, modeObject ){
				if( modeObject && modeObject.mode ){
					if( !( setting.isset( "data", index ) || setting.isset( "data", modeObject.name ) ) ){
						modeObject.defines = this.defines;
						setting.set( "data", index, modeObject );
						setting.set( "data", modeObject.name, modeObject );
						this.defineMode[ modeObject.name ] = index;
						this.defineMode[ index ] = modeObject.name;
						console.log( "%c[drawpad.modes.add] drawpad.object.Mode named [%s] was added to drawpad.modes/[%d], drawpad.modes/%s", "font-weight: bold; color: darkred", modeObject.name, index, modeObject.name );
					}else{
						console.warn( "[drawpad.modes.add] index [%d] OR name [%s] was already defined.", index, modeObject.name );
					}
				} else {
					console.error( "[drawpad.modes.add] Invalid parameter type." );
					return false;
				}
			},
			get: function(str, bool){
				if( setting.isset( "data", str ) ){
					return setting.get( "data", str );
				} else if( typeof bool !== "undefined" && bool ) {
					return false;
				} else {
					return new object.Mode();
				}
			},
			defineMode: {},
			defines: {
				drawType: 0,
				time: 1,
				name: 2,
				axis: 3,
				value: 3,
				layer: 4
			}
		});
		
		return modes;
	};
	
	modes = modes();

	var Line = function(){
		var pad = false, 
			axis = [], 
			lastSamePoint = 0,
			lastMouse = {x: 0, y: 0},
			lastMouseInState = false,
			lastMouseClickedState = false,
			drawState = false;	
		
		return object.Mode({
			name: "Line",
			thisIndex: 0,
			regisPad: function( padObject ){
				if( pad === false ){
					pad = padObject;
				}
			},
			play: function( data, callback ){
				var d = this.defines;

				if( !this.dataCheck(data) ){
					return false;
				}
				if( data[d.axis].length < 2 ){
					return true;
				}

				pad.layer.index( data[d.layer] );
				pad.setStyle( data[ d.color ], data[ d.width ] );
					
				var iNow = 1,
					dataLength = data[ d.axis ].length,
					dThis = this,
					limiter = pad.settings.get( "replaySpeed" ) / pad.settings.get( "TIME_DELAY" );

				function checkCallback(){
					callback( dThis );
				}
				function time(){
					var count = limiter;
					while(count-- > 0){
						var cP = new object.Position( data[d.axis][iNow - 1] );
						var cN = new object.Position( data[d.axis][iNow] );
						dThis.draw( cP, cN );
						iNow++;
						if( iNow >= dataLength - 1 ){
							dThis.eventSave();
							checkCallback();
							return;
						}
					}
					setTimeout(function(){ time(); } , pad.settings.get( "TIME_DELAY" ) / pad.settings.get( "replaySpeed" ));
				}
				setTimeout(function(){ time(); } , pad.settings.get( "TIME_DELAY" ) / pad.settings.get( "replaySpeed" ));
			},
			draw: function ( cStart, cNow ){
				if( cStart.compare(cNow) ){
					cNow.x( cNow.x() + 1 ); cNow.y( cNow.y() + 1 );
				}
				
				var context = pad.layer.write().getDOM( "context" );
				context.beginPath();
				context.lineJoin = "round";
				context.lineCap = "round";
				context.moveTo(cStart.x(), cStart.y());
				context.lineTo(cNow.x() , cNow.y());
				context.closePath();
				context.stroke();
			},
			eventTrigger: function(){
				var me = pad.mouse;
				// If click state change
				if ( lastMouseClickedState !== me.mouseClicked ){
					if ( me.mouseInner ){
						if ( me.mouseClicked ){
							this.eventStart();
						} else {
							this.eventStop();
						}
					}else{
						if ( !me.mouseClicked ){
							this.eventStop();
						}
					}
				}else if( me.mouseClicked && me.mouseIn ){
					if( lastMouseInState !== me.mouseIn ){
						if( me.mouseIn ){ 
							this.eventStart();
						} else {
							this.eventStop();
						}
					} else if( drawState ) {
						this.eventAdd();
					}
				}else if( !me.mouseIn ){
					this.eventStop();
				}
				
				
				lastMouseClickedState = me.mouseClicked;
				lastMouseInState = me.mouseIn;
				
				if ( drawState ){
					pad.setStyle( "flow", true );
				} else {
					pad.setStyle( "flow", false );
				}
			},
			eventStart: function(){
				var me = pad.mouse;

				drawState = true;

				var pos = new object.Position( me.mouse.pos ),
					a = [];
				a.push( pos.getInt() );
				axis = a;
				lastMouse = pos;
				
				pad.history.countTime();
			},
			eventAdd: function(){
				var me = pad.mouse,
					pos = new object.Position( me.mouse.pos );
					
				if ( pos.compare( lastMouse ) ){
					lastSamePoint++;
				} else {
					lastSamePoint = 0;
				}
				
				if( lastSamePoint > pad.settings.get( "SAMEPOINT_LIMIT" )){
					return false;
				}

				// Add to Pad
				this.draw( lastMouse, pos );
				
				// Add to historyObject
				axis.push( pos.getInt() );
				lastMouse = pos;
				
				// count Time
				pad.history.countTime();
			},
			eventStop: function(){
				if ( drawState ){
					drawState = false;
				} else {
					return false;
				}
				
				lastSamePoint = 0;
				this.eventAdd();
				this.eventSave();
								
				// Debug
				$("#value_jsize").html((history.getSize() / 1024).toFixed(2) + " KB");
				$("#value_msize").html((history.getMsgPackSize() / 1024).toFixed(2) + " KB");
			},
			eventSave: function( ){
				var d = this.defines;

				var data = {};
				data[d.drawType] = this.thisIndex;
				data[d.time]     = pad.history.getTimeStep() - axis.length;
				data[d.axis]     = axis;
				data[d.layer]    = pad.layer.index();

				// count Event
				pad.history.countEvent();
				
				// add Event
				pad.history.addEvent( data );
				
				var nowlayer = pad.layer.getLayer(),
					elem = pad.layer.write().getDOM( "element" );
				nowlayer.getDOM( "context" ).drawImage( elem, 0, 0 );
				nowlayer.getDOM( "contextPad" ).drawImage( elem, 0, 0 );
				pad.layer.write().getDOM( "context" ).clearRect( 0, 0, pad.settings.get( "CANVAS_WIDTH" ), pad.settings.get( "CANVAS_HEIGHT" ) );

				// add History
				pad.history.addHistory({
					data: {
						img: pad.layer.getLayer().getDOM("element").toDataURL(),
						mode: this.thisIndex,
						line: true,
						layer: pad.layer()
					},
					undo: function( history, callback ){
						pad.layer.index( this.data.layer );
						while( history.back() !== false &&
							history.now().data.line !== true &&
							history.now().data.layer !== this.data.layer 
						){}
						
						if( history.index() < 0 ){
							pad.layer().clear();
						}else{
							pad.layer().setDataURL( history.now().data.img );						
						}
						
						if( typeof callback === "function" ){
							callback();
						}
					},
					redo: function( history, callback ){
						pad.layer.index( this.data.layer );
						pad.layer().setDataURL( this.data.img );

						if( typeof callback === "function" ){
							callback();
						}
					}
				});
			},
		});
	};
	
	Line = Line();

	// Modes - CreateLayer
	var CreateLayer = function(){
		var pad = false;
		return object.Mode({
			name: "CreateLayer",
			thisIndex: 1,
			regisPad: function( padObject ){
				if( pad === false ){
					pad = padObject;
				}
			},
			play: function( data, callback ){
				if( !this.dataCheck( data ) ){
					return false;
				}
				pad.layer.create();
				this.eventSave();
				if(callback){ 
					callback( this );
				}
			},
			// EventTrigger - needs to defines.
			eventTrigger: function(){},
			eventSave: function(){
				var data = {};
				data[this.defines.drawType] = this.thisIndex;
				data[this.defines.time]     = pad.history.getTimeStep(),
				
				// count Time and Event
				pad.history.countTime();
				pad.history.countEvent();
				
				// add Event
				pad.history.addEvent( data );
				
				// add History
				pad.history.addHistory({
					data: {
						layer: pad.layer.getLayer()
					},
					undo: function( history, callback ){
						pad.layer.remove( this.data.layer );
						if( typeof callback === "function" ){
							callback();
						}
					},
					redo: function( history, callback ){
						pad.layer.create();
						if( typeof callback === "function" ){
							callback();
						}						
					}
				});
			}
		});
	};
	
	CreateLayer = CreateLayer();

	var ChangeLayerSetting = function(){
		var pad = false;
		return object.Mode({
			name: "ChangeLayerSetting",
			regisPad: function( padObject ){
				if( pad === false ){
					pad = padObject;
				}
			},
			thisIndex: 2,
			play: function( data, callback ){
				var d = this.define;
				if( !this.dataCheck(data) ){
					return false;
				}
				
				if( !isNaN( data[d.axis] ) ){				
					pad.layer.set(
						data[d.layer],
						pad.layer.value.getValue( data[d.value], false )
					);
				} else {
					pad.layer.set(data[d.layer], {
						mode: data[d.axis][0],
						value: data[d.axis][1]
					}, false);
				}
				
				this.eventSave();
				if( callback ){
					callback( this );
				}
			},
			eventTrigger: function(){},
			eventSave: function( configData ){
				var data = {}, d = this.defines;
				data[d.drawType] = this.thisIndex;
				data[d.mode] = configData.mode;
				data[d.value] = configData.newvalue;
				data[d.time] = pad.history.getTime();

				// count Time and Event
				pad.history.countTime();
				pad.history.countEvent();
				
				// add Event
				pad.history.addEvent( data );
				
				// add History
				pad.history.addHistory({
					data: extend( configData, 
						{ 
							mode: this.thisIndex, 
							layer: pad.layer() 
						} 
					),
					undo: function( history, callback ){
						pad.layer.index( this.data.layer );
						pad.layer.set({
							mode: this.data.mode,
							value: this.data.oldvalue 
						});

						if( typeof callback === "function" ){
							callback();
						}
					},
					redo: function( history, callback ){
						pad.layer.index( this.data.layer );
						pad.layer.set({
							mode: this.data.mode, 
							value: this.data.newvalue 
						});
						
						if( typeof callback === "function" ){
							callback();
						}
					}
				});
			}
		});
	};
	
	ChangeLayerSetting = ChangeLayerSetting();

	// Modes - ChangeStyle
	var ChangeStyle = function(){
		var setting = new object.Settings({
			pad: false
		});
		setting = setting.create( "pad" );
		var pad = false;
		
		return object.Mode({
			name: "ChangeStyle",
			thisIndex: 3,
			regisPad: function( padObject ){
				if( pad === false ){
					pad = padObject;
				}
			},
			play: function( data, callback ){
				if( !this.dataCheck( data ) ){
					return false;
				}
				var d = this.defines;
				pad.setStyle( data[d.name], data[d.value] );
				this.eventSave();
				if(callback){
					callback( this );
				}
			},
			// EventTrigger - needs to defines.
			eventTrigger: function(){},
			eventSave: function( dataObject ){
				var data = {};
				data[this.defines.drawType] = this.thisIndex;
				data[this.defines.name]     = dataObject.name,
				data[this.defines.value]     = dataObject.style,
				data[this.defines.time]     = pad.history.getTimeStep(),
				
				// count Time and Event
				pad.history.countTime();
				pad.history.countEvent();
				
				// add Event
				pad.history.addEvent( data );
				
				// add History
				pad.history.addHistory({
					data: {
						layer: pad.layer.getLayer()
					},
					undo: function( history, callback ){
						if( typeof callback === "function" ){
							callback();
						}
					},
					redo: function( history, callback ){
						if( typeof callback === "function" ){
							callback();
						}
					}
				});
			}
		});
	};
	
	ChangeStyle = ChangeStyle();

	var mode = function(){
		modes.add(0, Line);
		modes.add(1, CreateLayer);
		modes.add(2, ChangeLayerSetting);
		modes.add(3, ChangeStyle);
		return modes;
	};
	
	modes = mode();
	
	// Set as undefined
	mode = undefined;
	Line = undefined;
	CreateLayer = undefined;
	ChangeLayerSetting = undefined;
	ChangeStyle = undefined;

	var mouse = function(){
		var setting = new object.Settings({
				pad: false
			}),
			pad = false;
			
		setting = setting.create( "mouse" );
		var mouse;
		
		mouse = {
			mouseClicked: false,
			mouseIn: false,
			mouseInner: false,
			regisPad: function( padObject ){
				if( pad === false ){
					pad = padObject;
				}
			},
			mouse: {
				pos: { x: 0, y: 0 }
			},
			down: function ( e ){
				if( e.which === 1 ){
					mouse.mouseClicked = true;
				}
			},
			up: function ( e ){
				if( e.which === 1 ){
					mouse.mouseClicked = false;
				}
			},
			move: function ( e ){
				var off = pad.layer.write().getDOM( "$" ).offset();
				
				mouse.mouse.pos.x = e.pageX - off.left;
				mouse.mouse.pos.y = e.pageY - off.top;				
				mouse.overcheck();
			},
			overcheck: function (){
				if( mouse.mouse.pos.x >= - pad.settings.get( "CANVAS_EVENTOFFSET" ) &&
					mouse.mouse.pos.x <= pad.settings.get( "CANVAS_WIDTH" ) + pad.settings.get( "CANVAS_EVENTOFFSET" ) &&
					mouse.mouse.pos.y >= - pad.settings.get( "CANVAS_EVENTOFFSET" ) &&
					mouse.mouse.pos.y <= pad.settings.get( "CANVAS_HEIGHT" ) + pad.settings.get( "CANVAS_EVENTOFFSET" ) ){
					mouse.mouseIn = true;
				} else {
					mouse.mouseIn = false;
				}

				if( mouse.mouse.pos.x >= 0 &&
					mouse.mouse.pos.x <= pad.settings.get( "CANVAS_WIDTH" ) &&
					mouse.mouse.pos.y >= 0 &&
					mouse.mouse.pos.y <= pad.settings.get( "CANVAS_HEIGHT" ) ){
					mouse.mouseInner = true;
				} else {
					mouse.mouseInner = false;
				}
			}
		};
		return mouse;
	};
	
	mouse = mouse();

	var history = function(){
		var EventCount = -1,
			TimeCount = -1,
			historyEvent = [],
			History = [],
			pad = false,
			drawingState = false,
			replayState = false,
			replayLastState = false;
			
		var history = {
			get: function( str ){
				if( str === "replayState" ){
					return replayState;
				}
			},
			regisPad: function( padObject ){
				if( pad === false ){
					pad = padObject;
				}
			},
			undo: function(){
				if(EventCount > 0 && History[EventCount - 1]){
					var EventIndex = --EventCount;
					var history = {
						back: function(){
							if ( EventIndex > 0 ){
								EventIndex--;
								return this.now();
							} else {
								return false;
							}
						},
						now: function(){
							return historyEvent[EventIndex];
						},
						index: function(){
							return EventIndex;
						}
					};
					History[EventCount].undo( history );
				}
			},
			redo: function (){
				if(EventCount < History.length){
					var EventIndex = ++EventCount;
					var history = {
						forward: function(){
							if ( EventIndex > 0 ){
								EventIndex++;
								return this.now();
							} else {
								return false;
							}
						},
						now: function(){
							return historyEvent[EventIndex];
						},
						index: function(){
							return EventIndex;
						}
					};
					History[EventCount].redo( history );
				}
			},
			clearRedo: function(){
				History.length = EventCount;
				historyEvent.length = EventCount + 1;
			},
			clearHistory: function(){
				History = [];
				historyEvent = [];
			},
			countTime: function(){
				TimeCount++;
			},
			getTimeStep: function(){
				return TimeCount;			
			},
			countEvent: function(){
				EventCount++;
			},
			addHistory: function( data ){
				if( typeof data.undo !== "undefined" &&
					typeof data.redo !== "undefined" &&
					typeof data.data !== "undefined"){
					History.push( data );
				}
			},
			addEvent: function( data ){
				historyEvent.push( data );
			},
			replay: function(){
				if( replayState === true ){
					return false;
				}
				replayState = false;
				
				console.groupCollapsed("%c[drawpad.history.replay] Start replay state.", "color: darkgreen; font-weight: bold");
				
				// Clear redo before save history
				this.clearRedo();
				
				var h = historyEvent,
					Tcount = TimeCount,
					Ecount = EventCount;

				TimeCount = 0;
				EventCount = 0;
				historyEvent = [];

				// Clear all session
				this.clearHistory();
				pad.layer.removeAll();
				pad.layer.write().clear();
				
				var timeIndex = 0;
				var eventIndex = 0;
				var endLength = h.length;
				var recall = {
					call: false
				};
				
				function callerback(){
					drawingState = false;
					if( replayLastState ){
						replayLastState = false;
						replayState = false;
						
						console.debug("[drawpad.history.replay] index = [%s], frame = [%s] [%ss:%sms], countPerFrame = [%s], mode = [%s]", 
							(" END").slice(-4),
							("     " + timeIndex).slice(-5), 
							("000" + Math.floor(timeIndex * pad.settings.TIME_DELAY / 1000)).slice(-3), 
							("   " + Math.floor(timeIndex * pad.settings.TIME_DELAY % 1000)).slice(-3), 
							("      " + pad.settings.replaySpeed).slice(-6),
							"LAST"
						);
						console.log("%c[drawpad.history.replay] End replay state.", "color: darkgreen; font-weight: bold");
						console.groupEnd();
					}
					if(recall.call){
						recall.call();
					}
				}
				
				function timeout(){
					if( recall.call ){
						recall.call = false;
					}
					while(h[eventIndex][pad.modes.defines.time] <= Math.floor(timeIndex)){
						if( drawingState ){
							recall.call = timeout;
							return;
						}else{
							console.debug("[drawpad.history.replay] index = [%s], frame = [%s] [%ss:%sms], countPerFrame = [%s], mode = [%s]", 
								("    " + eventIndex).slice(-4),
								("     " + timeIndex).slice(-5), 
								("000" + Math.floor(timeIndex * pad.settings.TIME_DELAY / 1000)).slice(-3), 
								("   " + Math.floor(timeIndex * pad.settings.TIME_DELAY % 1000)).slice(-3), 
								("      " + pad.settings.replaySpeed).slice(-6),
								pad.modes.get( h[eventIndex][pad.modes.defines.drawType] ).name
							);
							drawingState = true;
							pad.modes.get( h[eventIndex][pad.modes.defines.drawType] )
								.play(h[eventIndex], callerback);
							eventIndex++;
							if(eventIndex >= endLength){
								replayLastState = true;
								historyEvent = h;
								TimeCount = Tcount;
								EventCount = Ecount;
								return true;
							}
						}
					}
					timeIndex += pad.settings.get( "replaySpeed" );
					setTimeout(timeout, 1);
				}
				timeout();
			},
			getSize: function(){
				return JSON.stringify( historyEvent ).length;
			},
			getMsgPackSize: function(){
				return msgpack.pack( historyEvent ).length;
			}
		};
		
		return history;
	};
	
	history = history();

	pad.extend({
		layer: layer,
		modes: modes,
		mouse: mouse,
		history: history,
		object: object
	});

	var padui = function(){
		var padui = {},
			options = {
				pad: false,
				layer: {
					example: $( "<div></div>" ),
					parts: {
						preview: ".preview",
						changeThis: ".preview"
					}
				},
				button: {
					layer: {
						create: $( "" )
					}
				}
			},
			myEvent = {},
			layers = {};
			
		//
		// Layer
		//
		// Layer - Button
		// Create Button
		function buttonCreateLayer(){
			options.pad.layer.create();
		}
		
		// Layer - Event
		// Created
		function layerCreated( sender, data ){
			var lay = $( options.layer.example ).clone().removeClass("example");
			layers[data.layer.indexer] = lay;

			lay.children( options.layer.parts.preview ).append( data.layer.getDOM( "previewPad" ) );
			myEvent.run( "layerCreated", padui, { layer: data.layer, element: lay } );
		}
		
		padui.extend = extend;
		
		padui.extend({
			event: myEvent,
			on: function( name, func ){
				myEvent.on( name, func );
				return this;
			},
			layer: {
				list: function(){
					var li = options.pad.layer.list(),
						elem = [];
						
					for( var i in li ){
						elem.push({
							indexer: li[i].indexer,
							element: layers[li[i].indexer] 
						});
					}
					
					return {
						list: elem,
						selected: options.pad.layer.getLayer().indexer
					};
				}
			},
			init: function( option ){
				extend( true, options, option );
				var ev;
				
				if( options.pad && options.pad.layer && options.pad.object ){
					var s = new options.pad.object.Settings({});
					ev = s.create( "0" ).event;
					extend(myEvent, ev);
					
					// Add already exists layer
					var lays = options.pad.layer.list();
					for( var i in lays ){
						layerCreated( option.pad.layer, {
							layer: lays[i]
						});
					}
					
					// Add all events
					// Return
					ev.add( "ok" );
							
					// UI event
					myEvent.add( "layerCreated" );
							
					setTimeout( function(){
						// All events listener
						options.pad.layer.on( "create", layerCreated );
						
						// All button events
						$( options.button.layer.create ).click( buttonCreateLayer );
						ev.run( "ok", padui, {} );
					}, 100);
				} else {
					throw "No pad detected in option, PadUI needs Pad. (option.pad)";
				}
				
				return {
					on: function( name, func ){
						ev.on( name, func );
					}
				};
			}
			
		});
		
		return padui;
	};
	
	padui = padui();


	padui.extend({
	});

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

}));
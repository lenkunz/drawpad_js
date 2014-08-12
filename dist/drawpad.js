/*!
 * Pad and PadUI drawpad API v0.1.0
 * http://lenkyun.tk/drawpad
 *
 * Copyright 2014 Rapeapach Suwasri
 * Released under the MIT license
 * http://lenkyun.tk/drawpad/license
 *
 * Date: 2014-08-12T15:54Z
 */
 
(function( w, $, require, define, func ){
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
	
	if( typeof require === "undefined" && typeof define === "undefined" ){
		require = function(){};

		msg = "[drawpad] drawpad require RequireJS to run, please set-it-up on your page.";
		error.push( msg );
		console.warn( msg );
	}
	
	func( w, w.document, $, $.extend, error, require );
	
}(typeof window !== "undefined" ? window : this, jQuery, require, define, function( window, document, $, extend, _error, require ){

	var Settings = function(){
		var Settings = {};
		
		Settings = function( obj ){
			if( obj ){
				this.set(obj);
				data[this] = {};
			}
		};
		
		var data = {};
		
		Settings.prototype = {
			ex: {},
			get: function( obj ){
				if(typeof obj !== "undefined" && typeof this[obj] !== "undefined"){
					return data[ this ][ obj ];
				}
				return 0;
			},
			create: function( obj ){
				data[ this ][ obj ] = $.extend({}, this.ex);
				return data[ this ][ obj ];
			},
			set: function( obj ){
				var event, set, add, get, isset;
				
				event = {
					data: {},
					add: function( name, call ){
						if( typeof name === "undefined" ){
							return false;
						}
						if( typeof this.event.data[name] === "undefined" ){
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
								var referer = this.data[ a ][ b ], i;
								for( i = 2; i < arguments.length - 2; i++ ){
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
					if( typeof name !== "undefined" && typeof this.data[ name ] !== "undefined" ){
						var value, v;

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
			
			
		// constructor
		var Layer = function(index, className, width, height){
			// init
			var s = setting.create(this);
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
				"id": className + "_" + this.id,
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
			on: function( name, func ){
				var s = setting.get( this );
				if( s.event.has( name ) ){
					s.event.add( name, func );
				}
			},
			listEvent: function(){
				return setting.event.list();
			},
			// Get element
			getDOM: function( name ){
				var s = setting.get( this );
				if( s.isset( "DOM", name ) ){
					return s.get( "DOM", name );
				} else {
					return false;
				}
			},
			// Clear canvas
			clear: function(){
				var s = setting.get( this ); // Settings
				if( s.isset( "DOM", "context" ) ){
					s.get( "DOM", "context" ).clearRect( 0, 0, s.width, s.height );
				}
				if( s.isset( "DOM", "contextPad" ) ){
					s.get( "DOM", "contextPad" ).clearRect( 0, 0, s.width, s.height );
				}

				this.clearPreview();
				s.event.run( "clear", this, {});
				return this;
			},
			order: function( i ){
				var s = setting.get( this );
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
				var s = setting.get( this );
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
				var s = setting.get(this);
				if( typeof name === "undefined" ){
					return s.get( "name" );
				} else {
					s.set( "name", String.toString(name) );
					s.event.run( "rename", this, { value: name } );
					return this;
				}
			},
			getDataURL: function(){
				return setting.get( this ).get( "DOM", "element" ).getDataURL();
			},
			remove: function(){
				var s = setting.get( this );
				s.get( "DOM", "$" ).remove();
				$( s.get( "DOM", "previewPad" ) ).remove();
				s.event.run("remove", this, { layer: this });
			},
			changethis: function(){
				setting.get( this ).event.run("changethis", this, { layer: this });				
			}
		};
		
		return Layer;
	};
	
	Layer = Layer();

	var RGBA = function(){
		// RGBA - Object
		// Private static zone
		var setting, RGBA;
		
		// create settings
		setting = new Settings({
			value: 255
		});
		
		// constructor
		RGBA = function( r, g, b, a ){
			var s = setting.create( this );
			if ( r && r.rgba ){
				s.set( "value", r.getInt() );
			} else if ( typeof r !== "undefined" && typeof g !== "undefined" && typeof b !== "undefined" && typeof a !== "undefined" ){
				s.set( "value", RGBA.toInt(r, g, b, a) );
			} else if ( !isNaN(r) ){
				s.set( "value", r );
			}
		};
		
		// static
		$.extend(RGBA, {
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
				var s = setting.get( this );
				if ( i !== undefined && !isNaN(i) ){
					if ( i >= 0 && i <= 255 ){
						var n = s.get( "value" ) & 0x00FFFFFF;
						n = n + ( i << 24 );
						s.set( "value", n );
					} else {
						console.warn( "[drawpad/object/RGBA.red] Color is out of bound [0-255][%i]", i );
					}
				} else {
					return ( s.get( "value" ) >> 24 ) & 0xFF;
				}
			},
			green: function( i ){
				var s = setting.get( this );
				if ( i !== undefined && !isNaN(i) ){
					if( i >= 0 && i <= 255 ){
						var n = s.get( "value" ) & 0xFF00FFFF;
						n = n + ( i << 16 );
						s.set( "value", n );
					} else {
						console.warn( "[drawpad/object/RGBA.green] Color is out of bound [0-255][%i]", i );
					}
				} else {
					return ( s.get( "value" ) >> 16 ) & 0xFF;
				}
			},
			blue: function( i ){
				var s = setting.get( this );
				if ( i !== undefined && !isNaN(i) ){
					if( i >= 0 && i <= 255 ){
						var n = s.get( "value" ) & 0xFFFF00FF;
						n = n + ( i << 8 );
						s.set( "value", n );
					} else {
						console.warn( "[drawpad/object/RGBA.blue] Color is out of bound [0-255][%i]", i );
					}
				} else {
					return ( s.get( "value" ) >> 8 ) & 0xFF;
				}
			},
			alpha: function( i ){
				var s = setting.get( this );
				if( i !== undefined && !isNaN(i) ){
					if( i >= 0 && i <= 255 ){
						var n = s.get( "value" ) & 0xFFFFFF00;
						n = n + i;
						s.set( "value", n );
					} else {
						console.warn( "[drawpad/object/RGBA.alpha] Alpha level is out of bound [0-255][%i]", i );
					}
				} else {
					return s.get( "value" ) & 0xFF;
				}
			},
			getCSS: function(){
				return setting.get( this ).get( "value" );
			},
			getInt: function(){
				return setting.get( this ).get( "value" );
			}
		};
		
		return RGBA;
	};
	
	RGBA = RGBA();

	var Position = function(){
		// RGBA - Object
		// Private static zone
		var setting, Position, offset = 1024;
		
		// create setting
		setting = new Settings({
			value: 0
		});
		
		// constructor
		Position = function( x, y ){
			var s = setting.create( this );

			if( x && x.position ){
				s.set( "value", x.getInt() );
			}else if( !isNaN(x) && !isNaN(y) ){
				s.set( "value", Position.toInt(x, y) );			
			}else if( !isNaN(x) ){
				s.set( "value", x );
			}else if( x.x !== undefined && x.y !== undefined ){
				s.set( "value", Position.toInt(x.x, x.y) );
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
			position: true,
			x: function( i ){
				var s = setting.get( this ), n;
				if( i !== undefined && !isNaN(i) ){
					if( i >= -1024 && i <= 1024 ){
						n = s.get( "value" ) & 0x000FFF;
						n = n + ((i + 1024) << 12);
						s.set( "value", n );
					} else {
						console.warn( "[drawpad/object/Position.x] Position is out of bound [n1024-1024][%i]", i );
					}
				} else {
					return ( ( s.get( "value" ) >> 12 ) & 0xFFF ) - 1024;
				}
			},
			y: function( i ){
				var s = setting.get( this ), n;
				if( i !== undefined && !isNaN( i ) ){
					if( i >= -1024 && i <= 1024 ){
						n = s.get( "value" ) & 0xFFF000;
						n = n + (i + 1024);
						s.set( "value", n );
					}else{
						console.warn( "[drawpad/object/Position.y] Position is out of bound [n1024-1024][%i]", i );
					}
				} else {
					return ((s.get( "value" )) & 0xFFF) - 1024;
				}
			},
			getInt: function(){
				return setting.get( this ).get( "value" );
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

	var layer = function(){
		// Section - Layer
		// Private static zone
		var layer, setting;

		setting = new object.Settings({
			index: 0,
			data: [],
			write: false,
			root: false,
			count: 0,
			pad: false
		});
		setting = setting.create( this );

		// Defining function - not a constructor
		layer = function( i ){
			if( typeof i === "undefined" ){
				i = layer.getLayer();
			}
			if( typeof i.layer === "undefined" ){
				i = layer.getLayer(i);
			}
			return i;
		};
		
		var pad;
		
		// Public static function and variable
		extend(layer, {
			regisPad: function( padObject ){
				if( setting.get( "pad" ) === false ){
					setting.set( "pad", padObject );
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
					setting.get( "write" );
				}
				return this;
			},
			create: function(){
				layer = new object.Layer(
					setting.add( "indexCount" ), 
					"drawpad", 
					pad.setting.get( "CANVAS_WIDTH" ), 
					pad.setting.get( "CANVAS_HEIGHT" )
				);
				setting.root.append( layer.getDOM( "$" ) );
				
				modes.get( "CreateLayer" ).eventSave();
				setting.get( "data" ).push( layer );
				this.callback.create(layer);
			},
			remove: function( i ){
				var dat = setting.get( "data" ), index;
				if( isNaN( index ) ){
					while( ( index = dat.indexOf(i) ) !== -1 ){
						this.remove( index );
					}
				} else {
					if( typeof dat[ index ] !== "undefined" ){
						dat[ index ].remove();
						this.data.splice( index, 1 );
					}
				}
				return this;
			},
			removeAll: function(){
				$.each(this.data, function(i, o){
					o.DOM.$.remove();
				});
				this.data = [];
				this.resetCount();
				console.log("%c[drawpad.layer.removeAll] All layer was removed.", "font-weight: bold; color: darkorange");
				this.callback.removeAll();
			},
			index: function( i ){
				if( typeof i === "undefined" ){
					return this.getLayer();
				} else if ( isNaN( i ) ) {
					if( i < 0 ){
						return false;
					}
					if( i === setting.get( "index" ) ){
						return true;
					}
					if( i > setting.get( "data" ).length ){
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
				} else if( i.layer ) {
					var x;
					if( ( x = setting.get( "data" ).indexOf( i ) ) !== -1 ){
						this.index( x );
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
				pad.modes.ChangeLayerSetting.eventSave( data );
			},
			clear: function(){
				$.each(this.data, function(i, o){
					o.clear();
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
					return setting.get( "data", setting.get( "index" ) );
				} else if ( setting.isset( "data", i ) ){
					return false;
				} else{
					return setting.get( "data" )[i];
				}
			},
			resetCount: function(){
				setting.set( "count", 0 );
			},
		});
	};
	
	layer = layer();
	/* End Section: Layer */



	var modes = function(){
		var modes = {},		
			setting = new object.Settings({
			data: {}
		});
		setting = setting.create( this );
		
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
						console.log( "%c[drawpad.modes.add] drawpad.object.Mode named [%s] was added to drawpad.modes[%d], drawpad.modes.%s", "font-weight: bold; color: darkred", modeObject.name, index, modeObject.name );
					}else{
						console.warn( "[drawpad.mode.add] index [%d] OR name [%s] was already defined.", index, modeObject.name );
					}
				} else {
					console.warn( "[drawpad.modes.add] Invalid parameter type." );
					return false;
				}
			},
			get: function(str){
				if( setting.isset( "data", str ) ){
					return setting.get( "data", str );
				} else {
					return new object.Mode();
				}
			},
			defineMode: {},
			defines: {
				drawType: 0,
				time: 1,
				axis: 2,
				value: 2,
				layer: 3
			}
		});
	};
	
	modes = modes();

	var Line = function(){
		var setting = new object.Settings({
			lastMouseClickedState: false,
			lastMouse: {x: 0, y: 0},
			axis: [],
			drawState: false,
			lastSamePoint: 0,
			previousDrawpad: false,
			pad: false
		});
		setting = setting.create( "index" );
		
		var pad;
		
		return object.Mode({
			name: "Line",
			thisIndex: 0,
			regisPad: function( padObject ){
				if( setting.get( "pad" ) === false ){
					setting.set( "pad", padObject );
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

				pad.history.data.drawingState = true;
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
						var cP = new pad.object.Position( data[d.axis][iNow - 1] );
						var cN = new pad.object.Position( data[d.axis][iNow] );
						dThis.draw( cP, cN );
						iNow++;
						if( iNow >= dataLength - 1 ){
							pad.history.save( checkCallback );
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
				
				var context = this.pad.layer.write().getDOM( "context" );
				context.beginPath();
				context.lineJoin = "round";
				context.lineCap = "round";
				context.moveTo(cStart.x(), cStart.y());
				context.lineTo(cNow.x() , cNow.y());
				context.closePath();
				context.stroke();
			},
			eventTrigger: function(){
				var s = setting;
				var me = pad.mouseEvent;
				// If click state change
				if ( s.get( "lastMouseClickedState" ) !== me.mouseClicked ){
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
					if( s.get( "lastMouseInState" ) !== me.mouseIn ){
						if( me.mouseIn ){ 
							this.eventStart();
						} else {
							this.eventStop();
						}
					} else if( s.get( "drawState" ) ){
						this.eventAdd();
					}
				}else if( !me.mouseIn ){
					this.eventStop();
				}
				
				s.set( "lastMouseClickedState", me.mouseClicked );
				s.set( "lastMouseInState", me.mouseIn );
				
				if ( s.get( "drawState" ) ){
					pad.setStyle( "flow", true );
				} else {
					pad.setStyle( "flow", false );
				}
			},
			eventStart: function(){
				var s = setting,
					me = pad.mouseEvent;

				this.data.drawState = true;

				var pos = new pad.object.Position( me.mouse.pos ),
					a = [];
				a.push( pos.getInt() );
				s.set( "axis", a );
				s.set( "lastMouse", pos );
				
				pad.history.countTime();
			},
			eventAdd: function(){
				var s = setting,
					me = pad.mouseEvent,
					pos = new object.Position( me.pos );
					
				if ( pos.compare( s.get( "lastMouse" ) ) ){
					s.add( "lastSamePoint" );
				} else {
					s.add( "lastSamePoint", 0 );
				}
				
				if(s.get( "lastSamePoint" ) > pad.settings.get( "SAMEPOINT_LIMIT" )){
					return false;
				}

				// Add to Pad
				this.draw( s.get( "lastMouse" ), pos );
				
				// Add to historyObject
				s.get( "axis" ).push( pos.getInt() );
				s.set( "lastMouse", pos );
				
				// count Time
				pad.history.countTime();
			},
			eventStop: function(){
				var s = setting;

				if ( s.get( "drawState" ) ){
					s.set( "drawState", false );
				} else {
					return false;
				}
				
				s.set( "lastSamePoint", 0 );
				this.eventAdd();
				this.eventSave();
								
				// Debug
				$("#value_jsize").html((history.getSize() / 1024).toFixed(2) + " KB");
				$("#value_msize").html((history.getMsgPackSize() / 1024).toFixed(2) + " KB");
			},
			eventSave: function(){
				var s = setting;
				var pad = s.get( "pad" );
				var d = this.defines;

				var data = {};
				data[d.drawType] = this.thisIndex;
				data[d.time]     = pad.history.getTime() - s.get( "data", "axis" ).length;
				data[d.axis]     = s.get( "axis" );
				data[d.layer]    = pad.layer.index();

				// count Event
				pad.history.countEvent();
				
				// add Event
				pad.history.addEvent( data );
				var dThis = this;
				
				// add History
				pad.history.addHistory({
					data: {
						img: pad.layer.getDataURI,
						mode: this.thisIndex,
						layer: pad.layer()
					},
					undo: function( history, callback ){
						pad.layer.index( this.data.layer );
						while( history.index() > 0 &&
							history.back().data.mode !== dThis.thisIndex &&
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

	var CreateLayer = function(){
		var setting = new object.Settings({
			pad: false
		});
		setting = setting.create( "pad" );
		var pad;
		
		object.Mode({
			name: "CreateLayer",
			thisIndex: 1,
			regisPad: function( padObject ){
				if( setting.get( "pad" ) === false ){
					setting.set( "pad", padObject );
					pad = padObject;
				}
			},
			play: function( data, callback ){
				var dThis = this;
				if( !this.dataCheck( data ) ){
					return false;
				}
				pad.layer.create();
				if(callback){ 
					callback( dThis );
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
					undo: function( callback ){
						pad.layer.remove( this.data.layer );
						if( typeof callback === "function" ){
							callback();
						}
					},
					redo: function( callback ){
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
		var setting = new object.Settings({
			pad: false,
			data: []
		});
		setting = setting.create( "pad" );
		
		var pad;
		return object.Mode({
			name: "ChangeLayerSetting",
			regisPad: function( padObject ){
				if( setting.get( "pad" ) === false ){
					setting.set( "pad", padObject );
					pad = padObject;
				}
			},
			thisIndex: 2,
			play: function( data, callback ){
				var d = this.define, dThis = this;
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
				
				if( callback ){
					callback( dThis );
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
					undo: function(){
						pad.layer.index( this.data.layer );
						pad.layer.set({
							mode: this.data.mode,
							value: this.data.oldvalue 
						});
					},
					redo: function(){
						pad.layer.index( this.data.layer );
						pad.layer.set({
							mode: this.data.mode, 
							value: this.data.newvalue 
						});
					}
				});
			}
		});
	};
	
	ChangeLayerSetting = ChangeLayerSetting();

	var mode = function(){
		modes.add(0, Line);
		modes.add(1, CreateLayer);
		modes.add(2, ChangeLayerSetting);		
		return modes;
	};
	
	modes = mode();
	mode = undefined;

	pad.extend({
		layer: layer,
		modes: modes
	});

	var drawpad = {},
		data = {
			"Pad": pad,
			"PadUI": undefined,
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
				callback( get );
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

	require(["drawpad"], function(drawpad){
		window.drawpad = drawpad;
	});
}));
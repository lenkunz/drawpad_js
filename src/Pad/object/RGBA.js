define([
	"./Settings"
], function( Settings ){
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
	return RGBA;
});
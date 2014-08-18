define(function(){
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
	return RGBA;
});
define(function(){
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
	
	return Position;
});
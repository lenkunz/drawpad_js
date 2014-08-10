define([
	"./Settings"
], function( Settings ){
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
	
	return Position;
});
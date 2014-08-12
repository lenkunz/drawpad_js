define([
	"../object",
], function( object ){

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
	
	return modes;
});
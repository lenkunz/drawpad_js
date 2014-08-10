define([
	"../object",
], function( object ){
	var modes = function(){
		var modes = {}, settings;		
		var setting = new object.Settings({
			data: {}
		});
		setting = setting.create( this );
		
		$.extend( modes, {
			mode: true,
			add: function( index, modeObject ){
				if( modeObject && modeObject.mode ){
					if( !( setting.isset( "data", index ) || setting.isset( "data", modeObject.name ) ) ){
						modeObject = object.Mode( modeObject );
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
			defineMode: {
				Line: 0,
				CreateLayer: 1,
				ChangeLayerSetting: 2
			},
			define: {
				drawType: 0,
				width: 1,
				color: 2,
				time: 3,
				axis: 4,
				layer: 5
			}
		});
	};
	
	modes = modes();
	
	return modes;
});
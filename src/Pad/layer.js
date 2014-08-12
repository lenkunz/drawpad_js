define([
	"./object",
], function( object, modes ){
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
});
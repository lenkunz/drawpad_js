define([
	"./Settings"
],function( Settings ){
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
				var s = setting.get( this );
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
	
	return Layer;
});
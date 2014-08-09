define([
	"./Settings"
],function( Settings ){
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
		
		s.set({
			DOM: {
				$: canvas,
				element: canvas[0],
				context: canvas[0].getContext("2d"),
				previewPad: preview,
				contextPad: preview.getContext("2d")
			}
		});
		
		s.event.add("");
		
		this.order(s.id);
		this.opacity(255);
		console.log("%c[drawpad/object/Layer] " + className + "'s layer was created.", "font-weight: bold; color: orange;");		
	};
	
	// public functions and variable
	Layer.prototype = {
		layer: true,
		// Clear canvas
		clear: function(){
			var s = setting.get(this); // Settings
			if( s.DOM.$ ){
				s.DOM.context.clearRect( 0, 0, s.width, s.height );
			}
			if( s.DOM.contextPad ){
				s.DOM.contextPad.clearRect( 0, 0, s.width, s.height );
			}

			this.clearPreview();
			return this;
		},
		order: function( i ){
			var s = setting.get(this);
			if( typeof i === "undefined" ){
				return s.index;
			}else if( i >= 0 && i < 2000 ){
				s.set( "index", i );
				if( s.DOM.$ ){
					s.DOM.$.css( "z-index", indexOffset + s.index );
				}
			}
			return this;
		},
		opacity: function( o ){
			var s = setting.get(this);
			if( typeof o === undefined ){
				return s.opacity;
			}else if( o >= 0 && o <= 255 ){
				s.set( "opacity", o );
				if( s.DOM.$ ){
					s.DOM.$.css("opacity", o / 255);
				}
			} else {
				console.error( "[drawpad.object.Layer] Opcaity is out of range [0-255][" + o + "]" );
			}
			return this;
		},
		name: function(name){
			var s = setting.get(this);
			if( typeof name === "undefined" ){
				return s.name;
			} else {
				s.set("name", String.toString(name));
				s.events.run( "nameChange", {name: name} );
				return this;
			}
		},
		getDataURL: function(){
			return this.DOM.element.getDataURL();
		},
		remove: function(){
			var e = setting.get(this).e;

			this.DOM.$.remove();
			$(this.DOM.previewPad).remove();
			e.run("remove", {layer: this});
		},
		onRemove: function(e){
			this.data.onDelete.push(e);
		}
	};
	
	return Layer;
});
define(function(){
	var padui = function(){
		var padui = {},
			options = {
				pad: false,
				layer: {
					example: $( "<div></div>" ),
					parts: {
						preview: ".preview",
						changeThis: ".preview"
					}
				},
				button: {
					layer: {
						create: $( "" )
					}
				}
			},
			myEvent = {},
			layers = {};
			
		//
		// Layer
		//
		// Layer - Button
		// Create Button
		function buttonCreateLayer(){
			options.pad.layer.create();
		}
		
		// Layer - Event
		// Created
		function layerCreated( sender, data ){
			var lay = $( options.layer.example ).clone().removeClass("example");
			layers[data.layer.indexer] = lay;

			lay.children( options.layer.parts.preview ).append( data.layer.getDOM( "previewPad" ) );
			myEvent.run( "layerCreated", padui, { layer: data.layer, element: lay } );
		}
		
		padui.extend = extend;
		
		padui.extend({
			event: myEvent,
			on: function( name, func ){
				myEvent.on( name, func );
				return this;
			},
			layer: {
				list: function(){
					var li = options.pad.layer.list(),
						elem = [];
						
					for( var i in li ){
						elem.push({
							indexer: li[i].indexer,
							element: layers[li[i].indexer] 
						});
					}
					
					return {
						list: elem,
						selected: options.pad.layer.getLayer().indexer
					};
				}
			},
			init: function( option ){
				extend( true, options, option );
				var ev;
				
				if( options.pad && options.pad.layer && options.pad.object ){
					var s = new options.pad.object.Settings({});
					ev = s.create( "0" ).event;
					extend(myEvent, ev);
					
					// Add already exists layer
					var lays = options.pad.layer.list();
					for( var i in lays ){
						layerCreated( option.pad.layer, {
							layer: lays[i]
						});
					}
					
					// Add all events
					// Return
					ev.add( "ok" );
							
					// UI event
					myEvent.add( "layerCreated" );
							
					setTimeout( function(){
						// All events listener
						options.pad.layer.on( "create", layerCreated );
						
						// All button events
						$( options.button.layer.create ).click( buttonCreateLayer );
						ev.run( "ok", padui, {} );
					}, 100);
				} else {
					throw "No pad detected in option, PadUI needs Pad. (option.pad)";
				}
				
				return {
					on: function( name, func ){
						ev.on( name, func );
					}
				};
			}
			
		});
		
		return padui;
	};
	
	padui = padui();
});
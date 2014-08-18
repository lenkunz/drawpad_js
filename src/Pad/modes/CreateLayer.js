define([
	"../object"
], function(object){
	// Modes - CreateLayer
	var CreateLayer = function(){
		var pad = false;
		return object.Mode({
			name: "CreateLayer",
			thisIndex: 1,
			regisPad: function( padObject ){
				if( pad === false ){
					pad = padObject;
				}
			},
			play: function( data, callback ){
				if( !this.dataCheck( data ) ){
					return false;
				}
				pad.layer.create();
				this.eventSave();
				if(callback){ 
					callback( this );
				}
			},
			// EventTrigger - needs to defines.
			eventTrigger: function(){},
			eventSave: function(){
				var data = {};
				data[this.defines.drawType] = this.thisIndex;
				data[this.defines.time]     = pad.history.getTimeStep(),
				
				// count Time and Event
				pad.history.countTime();
				pad.history.countEvent();
				
				// add Event
				pad.history.addEvent( data );
				
				// add History
				pad.history.addHistory({
					data: {
						layer: pad.layer.getLayer()
					},
					undo: function( history, callback ){
						pad.layer.remove( this.data.layer );
						if( typeof callback === "function" ){
							callback();
						}
					},
					redo: function( history, callback ){
						pad.layer.create();
						if( typeof callback === "function" ){
							callback();
						}						
					}
				});
			}
		});
	};
	
	CreateLayer = CreateLayer();
	
	return CreateLayer;
});
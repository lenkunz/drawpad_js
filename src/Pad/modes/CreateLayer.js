define([
	"../object"
], function(object){
	var CreateLayer = function(){
		var setting = new object.Settings({
			pad: false
		});
		setting = setting.create( "pad" );
		var pad;
		
		object.Mode({
			name: "CreateLayer",
			thisIndex: 1,
			regisPad: function( padObject ){
				if( setting.get( "pad" ) === false ){
					setting.set( "pad", padObject );
					pad = padObject;
				}
			},
			play: function( data, callback ){
				var dThis = this;
				if( !this.dataCheck( data ) ){
					return false;
				}
				pad.layer.create();
				if(callback){ 
					callback( dThis );
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
					undo: function( callback ){
						pad.layer.remove( this.data.layer );
						if( typeof callback === "function" ){
							callback();
						}
					},
					redo: function( callback ){
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
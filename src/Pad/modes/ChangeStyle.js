define([
	"../object"
], function(object){
	// Modes - ChangeStyle
	var ChangeStyle = function(){
		var setting = new object.Settings({
			pad: false
		});
		setting = setting.create( "pad" );
		var pad = false;
		
		return object.Mode({
			name: "ChangeStyle",
			thisIndex: 3,
			regisPad: function( padObject ){
				if( pad === false ){
					pad = padObject;
				}
			},
			play: function( data, callback ){
				if( !this.dataCheck( data ) ){
					return false;
				}
				var d = this.defines;
				pad.setStyle( data[d.name], data[d.value] );
				this.eventSave();
				if(callback){
					callback( this );
				}
			},
			// EventTrigger - needs to defines.
			eventTrigger: function(){},
			eventSave: function( dataObject ){
				var data = {};
				data[this.defines.drawType] = this.thisIndex;
				data[this.defines.name]     = dataObject.name,
				data[this.defines.value]     = dataObject.style,
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
						if( typeof callback === "function" ){
							callback();
						}
					},
					redo: function( history, callback ){
						if( typeof callback === "function" ){
							callback();
						}
					}
				});
			}
		});
	};
	
	ChangeStyle = ChangeStyle();
	
	return ChangeStyle;
});
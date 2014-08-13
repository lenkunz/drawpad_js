define([
	"../object"
], function( object ){
	var ChangeLayerSetting = function(){
		var pad = false;
		return object.Mode({
			name: "ChangeLayerSetting",
			regisPad: function( padObject ){
				if( pad === false ){
					pad = padObject;
				}
			},
			thisIndex: 2,
			play: function( data, callback ){
				var d = this.define;
				if( !this.dataCheck(data) ){
					return false;
				}
				
				if( !isNaN( data[d.axis] ) ){				
					pad.layer.set(
						data[d.layer],
						pad.layer.value.getValue( data[d.value], false )
					);
				} else {
					pad.layer.set(data[d.layer], {
						mode: data[d.axis][0],
						value: data[d.axis][1]
					}, false);
				}
				
				if( callback ){
					callback( this );
				}
			},
			eventTrigger: function(){},
			eventSave: function( configData ){
				var data = {}, d = this.defines;
				data[d.drawType] = this.thisIndex;
				data[d.mode] = configData.mode;
				data[d.value] = configData.newvalue;
				data[d.time] = pad.history.getTime();

				// count Time and Event
				pad.history.countTime();
				pad.history.countEvent();
				
				// add Event
				pad.history.addEvent( data );
				
				// add History
				pad.history.addHistory({
					data: extend( configData, 
						{ 
							mode: this.thisIndex, 
							layer: pad.layer() 
						} 
					),
					undo: function( history, callback ){
						pad.layer.index( this.data.layer );
						pad.layer.set({
							mode: this.data.mode,
							value: this.data.oldvalue 
						});

						if( typeof callback === "function" ){
							callback();
						}
					},
					redo: function( history, callback ){
						pad.layer.index( this.data.layer );
						pad.layer.set({
							mode: this.data.mode, 
							value: this.data.newvalue 
						});
						
						if( typeof callback === "function" ){
							callback();
						}
					}
				});
			}
		});
	};
	
	ChangeLayerSetting = ChangeLayerSetting();
	
	return ChangeLayerSetting;
});
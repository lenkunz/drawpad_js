define(function(){
	var Mode = function(){
		/* Section: Modes - Mode */
		// Creator
		var Mode = function(dat){
			if( !dat ){
				dat = {};
			}
			return $.extend({}, Mode, dat);
		};
		
		// Static
		extend(Mode, {
			mode: true,
			name: "NewMode",
			thisIndex: -1,
			dataCheck: function(data){
				return data[this.defines.drawType] === this.thisIndex;
			},
			eventTrigger: function(){
				console.warn("[drawpad.object.Mode] call undefined eventTrigger!![%s][%0]", this.name, this);
			},
			eventSave: function(){
				console.warn("[drawpad.object.Mode] call undefined eventSave!![%s][%0]", this.name, this);
			},
			play: function(){
				console.warn("[drawpad.object.Mode] call undefined play!![%s][%0]", this.name, this);		
			},
			draw: function(){
				console.warn("[drawpad.object.Mode] call undefined draw!![%s][%0]", this.name, this);
			},
			data: {}
		});
		/* End Section: Object - Mode */
		
		return Mode;
	};
	
	Mode = Mode();
	
	return Mode;
});
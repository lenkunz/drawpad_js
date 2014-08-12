define([
	"./modes/core",
	"./modes/Line",
	"./modes/CreateLayer",
	"./modes/ChangeLayerSetting"
], function( modes, Line, CreateLayer, ChangeLayerSetting ){
	var mode = function(){
		modes.add(0, Line);
		modes.add(1, CreateLayer);
		modes.add(2, ChangeLayerSetting);		
		return modes;
	};
	
	modes = mode();
	mode = undefined;
	
	return modes;
});
define([
	"./modes/core",
	"./modes/Line",
	"./modes/CreateLayer",
	"./modes/ChangeLayerSetting",
	"./modes/ChangeStyle"
], function( modes, Line, CreateLayer, ChangeLayerSetting, ChangeStyle ){
	var mode = function(){
		modes.add(0, Line);
		modes.add(1, CreateLayer);
		modes.add(2, ChangeLayerSetting);
		modes.add(3, ChangeStyle);
		return modes;
	};
	
	modes = mode();
	
	// Set as undefined
	mode = undefined;
	Line = undefined;
	CreateLayer = undefined;
	ChangeLayerSetting = undefined;
	ChangeStyle = undefined;
	
	return modes;
});
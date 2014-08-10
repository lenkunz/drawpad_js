define([
	"./modes/core"
	"./modes/Line",
	"./modes/CreateLine",
	"./modes/ChageLayerSetting"
], function( modes, Line, CreateLine, ChangeLayerSetting ){
	var x = function(){
		modes.add(0, Line);
		modes.add(1, CreateLine);
		modes.add(2, ChageLayerSetting);
	}
}
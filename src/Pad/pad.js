define([
	"./core",
	"./layer",
	"./modes",
	"./event/mouse",
	"./history"
], function(pad, layer, modes, mouse, history){
	pad.extend({
		layer: layer,
		modes: modes,
		mouse: mouse,
		history: history
	});
	
	return pad;
});
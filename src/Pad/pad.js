define([
	"./core",
	"./layer",
	"./modes",
	"./event/mouse",
	"./history",
	"./object"
], function(pad, layer, modes, mouse, history, object){
	pad.extend({
		layer: layer,
		modes: modes,
		mouse: mouse,
		history: history,
		object: object
	});
	
	return pad;
});
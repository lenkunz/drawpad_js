define([
	"./core",
	"./layer",
	"./modes"
], function(pad, layer, modes){
	pad.extend({
		layer: layer,
		modes: modes
	});
	return pad;
});
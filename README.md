# Drawpad API (Pad && PadUI)

Canvas API manager for drawings events and collects history (Pad), User Interfaces for Pad (PadUI)

Require: jQuery version >= 2.1.1

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/lenkyun/drawpad_js/master/dist/drawpad.min.js
[max]: https://raw.github.com/lenkyun/drawpad_js/master/dist/drawpad.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="drawpad.min.js"></script>
<script>
$(document).ready(function(){
	// Drawpad is for contain PadUI and Pad only
	// Only function it own is drawpad.get(@UI);
	//     When @UI is case-insensitive
	// 
	var PadUI = drawpad.get('UI'),
		Pad   = drawpad.get('PAD');
		
	// PadUI is virtual interface for call function in Pad.
	// And it doesn't has any real-interface and DOM. Then
	// - The PadUI is an interface environment only.
	// - You must define DOM object.
	// - The events will be called by element's class match the event.
	// -- example: [Replay] event will active if element with replay class clicked.
	// - All PadUI's event has callback function.
	// -- example:
	// -- PadUI.on("replay", function(status){
	// --   if(status.active()){
	// --     // Use this one for create one-time function
	// --     // However this won't work if the event doesn't has end state.
	// --     status.on("end", function(){
	// --       ...
	// --     });
	// --   }
	// --   if(status.end()){
	// --     ...
	// --	}
	// -- });
	// - The [container elements], [option container] will read an [example] class in the container and clone it to [container] class element.

	// PadUI.init(@Pad, @elements)
	//   When @Pad is a Pad object
	//        @elements is an object contains all element needs.
	PadUI.init(Pad, {
		wrap: [Controller-Wrap],
		layerContainer: [Layer-Roller],
		...
	});
	
	// Pad is canvas manager.
	// And it just like a controller.
	// You can create your interface, virtual interface, Or use PadUI.
	// - Pad also has event. However it can only accept one event.
	Pad.init({
		layers: [Layers-Element],
		writer: [Writer-Element],
		cursor: [Cursor-Element],
	});
});
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_

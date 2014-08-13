define([
	"../object"
], function( object ){
	var mouse = function(){
		var setting = new object.Settings({
				pad: false
			}),
			pad = false;
			
		setting = setting.create( "mouse" );
		var mouse;
		
		mouse = {
			mouseClicked: false,
			mouseIn: false,
			mouseInner: false,
			regisPad: function( padObject ){
				if( pad === false ){
					pad = padObject;
				}
			},
			mouse: {
				pos: { x: 0, y: 0 }
			},
			down: function ( e ){
				if( e.which === 1 ){
					mouse.mouseClicked = true;
				}
			},
			up: function ( e ){
				if( e.which === 1 ){
					mouse.mouseClicked = false;
				}
			},
			move: function ( e ){
				var off = pad.layer.write().getDOM( "$" ).offset();
				
				mouse.mouse.pos.x = e.pageX - off.left;
				mouse.mouse.pos.y = e.pageY - off.top;				
				mouse.overcheck();
			},
			overcheck: function (){
				if( mouse.mouse.pos.x >= - pad.settings.get( "CANVAS_EVENTOFFSET" ) &&
					mouse.mouse.pos.x <= pad.settings.get( "CANVAS_WIDTH" ) + pad.settings.get( "CANVAS_EVENTOFFSET" ) &&
					mouse.mouse.pos.y >= - pad.settings.get( "CANVAS_EVENTOFFSET" ) &&
					mouse.mouse.pos.y <= pad.settings.get( "CANVAS_HEIGHT" ) + pad.settings.get( "CANVAS_EVENTOFFSET" ) ){
					mouse.mouseIn = true;
				} else {
					mouse.mouseIn = false;
				}

				if( mouse.mouse.pos.x >= 0 &&
					mouse.mouse.pos.x <= pad.settings.get( "CANVAS_WIDTH" ) &&
					mouse.mouse.pos.y >= 0 &&
					mouse.mouse.pos.y <= pad.settings.get( "CANVAS_HEIGHT" ) ){
					mouse.mouseInner = true;
				} else {
					mouse.mouseInner = false;
				}
			}
		};
		return mouse;
	};
	
	mouse = mouse();		
	
	return mouse;
});
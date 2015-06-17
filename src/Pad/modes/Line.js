define([
	"../object"
], function( object ){
	var Line = function(){
		var pad = false, 
			axis = [], 
			lastSamePoint = 0,
			lastMouse = {x: 0, y: 0},
			lastMouseInState = false,
			lastMouseClickedState = false,
			drawState = false;	
		
		return object.Mode({
			name: "Line",
			thisIndex: 0,
			regisPad: function( padObject ){
				if( pad === false ){
					pad = padObject;
				}
			},
			play: function( data, callback ){
				var d = this.defines;

				if( !this.dataCheck(data) ){
					return false;
				}
				if( data[d.axis].length < 2 ){
					return true;
				}

				pad.layer.index( data[d.layer] );
				pad.setStyle( data[ d.color ], data[ d.width ] );
					
				var iNow = 1,
					dataLength = data[ d.axis ].length,
					dThis = this,
					limiter = pad.settings.get( "replaySpeed" ) / pad.settings.get( "TIME_DELAY" );

				function checkCallback(){
					callback( dThis );
				}
				function time(){
					var count = limiter;
					while(count-- > 0){
						var cP = new object.Position( data[d.axis][iNow - 1] );
						var cN = new object.Position( data[d.axis][iNow] );
						dThis.draw( cP, cN );
						iNow++;
						if( iNow >= dataLength - 1 ){
							dThis.eventSave();
							checkCallback();
							return;
						}
					}
					setTimeout(function(){ time(); } , pad.settings.get( "TIME_DELAY" ) / pad.settings.get( "replaySpeed" ));
				}
				setTimeout(function(){ time(); } , pad.settings.get( "TIME_DELAY" ) / pad.settings.get( "replaySpeed" ));
			},
			draw: function ( cStart, cNow ){
				if( cStart.compare(cNow) ){
					cNow.x( cNow.x() + 1 ); cNow.y( cNow.y() + 1 );
				}
				
				var context = pad.layer.write().getDOM( "context" );
				context.beginPath();
				context.lineJoin = "round";
				context.lineCap = "round";
				context.moveTo(cStart.x(), cStart.y());
				context.lineTo(cNow.x() , cNow.y());
				context.closePath();
				context.stroke();
			},
			eventTrigger: function(){
				var me = pad.mouse;
				// If click state change
				if ( lastMouseClickedState !== me.mouseClicked ){
					if ( me.mouseInner ){
						if ( me.mouseClicked ){
							this.eventStart();
						} else {
							this.eventStop();
						}
					}else{
						if ( !me.mouseClicked ){
							this.eventStop();
						}
					}
				}else if( me.mouseClicked && me.mouseIn ){
					if( lastMouseInState !== me.mouseIn ){
						if( me.mouseIn ){ 
							this.eventStart();
						} else {
							this.eventStop();
						}
					} else if( drawState ) {
						this.eventAdd();
					}
				}else if( !me.mouseIn ){
					this.eventStop();
				}
				
				
				lastMouseClickedState = me.mouseClicked;
				lastMouseInState = me.mouseIn;
				
				if ( drawState ){
					pad.setStyle( "flow", true );
				} else {
					pad.setStyle( "flow", false );
				}
			},
			eventStart: function(){
				var me = pad.mouse;

				drawState = true;

				var pos = new object.Position( me.mouse.pos ),
					a = [];
				a.push( pos.getInt() );
				axis = a;
				lastMouse = pos;
				
				pad.history.countTime();
			},
			eventAdd: function(){
				var me = pad.mouse,
					pos = new object.Position( me.mouse.pos );
					
				if ( pos.compare( lastMouse ) ){
					lastSamePoint++;
				} else {
					lastSamePoint = 0;
				}
				
				if( lastSamePoint > pad.settings.get( "SAMEPOINT_LIMIT" )){
					return false;
				}

				// Add to Pad
				this.draw( lastMouse, pos );
				
				// Add to historyObject
				axis.push( pos.getInt() );
				lastMouse = pos;
				
				// count Time
				pad.history.countTime();
			},
			eventStop: function(){
				if ( drawState ){
					drawState = false;
				} else {
					return false;
				}
				
				lastSamePoint = 0;
				this.eventAdd();
				this.eventSave();
								
				// Debug
				$("#value_jsize").html((history.getSize() / 1024).toFixed(2) + " KB");
				$("#value_msize").html((history.getMsgPackSize() / 1024).toFixed(2) + " KB");
			},
			eventSave: function( ){
				var d = this.defines;

				var data = {};
				data[d.drawType] = this.thisIndex;
				data[d.time]     = pad.history.getTimeStep() - axis.length;
				data[d.axis]     = axis;
				data[d.layer]    = pad.layer.index();

				// count Event
				pad.history.countEvent();
				
				// add Event
				pad.history.addEvent( data );
				
				var nowlayer = pad.layer.getLayer(),
					elem = pad.layer.write().getDOM( "element" );
				nowlayer.getDOM( "context" ).drawImage( elem, 0, 0 );
				nowlayer.getDOM( "contextPad" ).drawImage( elem, 0, 0 );
				pad.layer.write().getDOM( "context" ).clearRect( 0, 0, pad.settings.get( "CANVAS_WIDTH" ), pad.settings.get( "CANVAS_HEIGHT" ) );

				// add History
				pad.history.addHistory({
					data: {
						img: pad.layer.getLayer().getDOM("element").toDataURL(),
						mode: this.thisIndex,
						line: true,
						layer: pad.layer()
					},
					undo: function( history, callback ){
						pad.layer.index( this.data.layer );
						while( history.back() !== false &&
							history.now().data.line !== true &&
							history.now().data.layer !== this.data.layer 
						){}
						
						if( history.index() < 0 ){
							pad.layer().clear();
						}else{
							pad.layer().setDataURL( history.now().data.img );						
						}
						
						if( typeof callback === "function" ){
							callback();
						}
					},
					redo: function( history, callback ){
						pad.layer.index( this.data.layer );
						pad.layer().setDataURL( this.data.img );

						if( typeof callback === "function" ){
							callback();
						}
					}
				});
			},
		});
	};
	
	Line = Line();
	
	return Line;
});
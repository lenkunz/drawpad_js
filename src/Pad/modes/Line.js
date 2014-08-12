define([
	"../object"
], function( object ){
	var Line = function(){
		var setting = new object.Settings({
			lastMouseClickedState: false,
			lastMouse: {x: 0, y: 0},
			axis: [],
			drawState: false,
			lastSamePoint: 0,
			previousDrawpad: false,
			pad: false
		});
		setting = setting.create( "index" );
		
		var pad;
		
		return object.Mode({
			name: "Line",
			thisIndex: 0,
			regisPad: function( padObject ){
				if( setting.get( "pad" ) === false ){
					setting.set( "pad", padObject );
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

				pad.history.data.drawingState = true;
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
						var cP = new pad.object.Position( data[d.axis][iNow - 1] );
						var cN = new pad.object.Position( data[d.axis][iNow] );
						dThis.draw( cP, cN );
						iNow++;
						if( iNow >= dataLength - 1 ){
							pad.history.save( checkCallback );
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
				
				var context = this.pad.layer.write().getDOM( "context" );
				context.beginPath();
				context.lineJoin = "round";
				context.lineCap = "round";
				context.moveTo(cStart.x(), cStart.y());
				context.lineTo(cNow.x() , cNow.y());
				context.closePath();
				context.stroke();
			},
			eventTrigger: function(){
				var s = setting;
				var me = pad.mouseEvent;
				// If click state change
				if ( s.get( "lastMouseClickedState" ) !== me.mouseClicked ){
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
					if( s.get( "lastMouseInState" ) !== me.mouseIn ){
						if( me.mouseIn ){ 
							this.eventStart();
						} else {
							this.eventStop();
						}
					} else if( s.get( "drawState" ) ){
						this.eventAdd();
					}
				}else if( !me.mouseIn ){
					this.eventStop();
				}
				
				s.set( "lastMouseClickedState", me.mouseClicked );
				s.set( "lastMouseInState", me.mouseIn );
				
				if ( s.get( "drawState" ) ){
					pad.setStyle( "flow", true );
				} else {
					pad.setStyle( "flow", false );
				}
			},
			eventStart: function(){
				var s = setting,
					me = pad.mouseEvent;

				this.data.drawState = true;

				var pos = new pad.object.Position( me.mouse.pos ),
					a = [];
				a.push( pos.getInt() );
				s.set( "axis", a );
				s.set( "lastMouse", pos );
				
				pad.history.countTime();
			},
			eventAdd: function(){
				var s = setting,
					me = pad.mouseEvent,
					pos = new object.Position( me.pos );
					
				if ( pos.compare( s.get( "lastMouse" ) ) ){
					s.add( "lastSamePoint" );
				} else {
					s.add( "lastSamePoint", 0 );
				}
				
				if(s.get( "lastSamePoint" ) > pad.settings.get( "SAMEPOINT_LIMIT" )){
					return false;
				}

				// Add to Pad
				this.draw( s.get( "lastMouse" ), pos );
				
				// Add to historyObject
				s.get( "axis" ).push( pos.getInt() );
				s.set( "lastMouse", pos );
				
				// count Time
				pad.history.countTime();
			},
			eventStop: function(){
				var s = setting;

				if ( s.get( "drawState" ) ){
					s.set( "drawState", false );
				} else {
					return false;
				}
				
				s.set( "lastSamePoint", 0 );
				this.eventAdd();
				this.eventSave();
								
				// Debug
				$("#value_jsize").html((history.getSize() / 1024).toFixed(2) + " KB");
				$("#value_msize").html((history.getMsgPackSize() / 1024).toFixed(2) + " KB");
			},
			eventSave: function(){
				var s = setting;
				var pad = s.get( "pad" );
				var d = this.defines;

				var data = {};
				data[d.drawType] = this.thisIndex;
				data[d.time]     = pad.history.getTime() - s.get( "data", "axis" ).length;
				data[d.axis]     = s.get( "axis" );
				data[d.layer]    = pad.layer.index();

				// count Event
				pad.history.countEvent();
				
				// add Event
				pad.history.addEvent( data );
				var dThis = this;
				
				// add History
				pad.history.addHistory({
					data: {
						img: pad.layer.getDataURI,
						mode: this.thisIndex,
						layer: pad.layer()
					},
					undo: function( history, callback ){
						pad.layer.index( this.data.layer );
						while( history.index() > 0 &&
							history.back().data.mode !== dThis.thisIndex &&
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
define(function(){
		
	var history = function(){
		var EventCount = -1,
			TimeCount = -1,
			historyEvent = [],
			History = [],
			pad = false,
			drawingState = false,
			replayState = false,
			replayLastState = false;
			
		var history = {
			get: function( str ){
				if( str === "replayState" ){
					return replayState;
				}
			},
			regisPad: function( padObject ){
				if( pad === false ){
					pad = padObject;
				}
			},
			undo: function(){
				if(EventCount > 0 && History[EventCount - 1]){
					var EventIndex = --EventCount;
					var history = {
						back: function(){
							if ( EventIndex > 0 ){
								EventIndex--;
								return this.now();
							} else {
								return false;
							}
						},
						now: function(){
							return historyEvent[EventIndex];
						},
						index: function(){
							return EventIndex;
						}
					};
					History[EventCount].undo( history );
				}
			},
			redo: function (){
				if(EventCount < History.length){
					var EventIndex = ++EventCount;
					var history = {
						forward: function(){
							if ( EventIndex > 0 ){
								EventIndex++;
								return this.now();
							} else {
								return false;
							}
						},
						now: function(){
							return historyEvent[EventIndex];
						},
						index: function(){
							return EventIndex;
						}
					};
					History[EventCount].redo( history );
				}
			},
			clearRedo: function(){
				History.length = EventCount;
				historyEvent.length = EventCount + 1;
			},
			clearHistory: function(){
				History = [];
				historyEvent = [];
			},
			countTime: function(){
				TimeCount++;
			},
			getTimeStep: function(){
				return TimeCount;			
			},
			countEvent: function(){
				EventCount++;
			},
			addHistory: function( data ){
				if( typeof data.undo !== "undefined" &&
					typeof data.redo !== "undefined" &&
					typeof data.data !== "undefined"){
					History.push( data );
				}
			},
			addEvent: function( data ){
				historyEvent.push( data );
			},
			replay: function(){
				if( replayState === true ){
					return false;
				}
				replayState = false;
				
				console.groupCollapsed("%c[drawpad.history.replay] Start replay state.", "color: darkgreen; font-weight: bold");
				
				// Clear redo before save history
				this.clearRedo();
				
				var h = historyEvent;
				historyEvent = [];

				// Clear all session
				this.clearHistory();
				pad.layer.removeAll();
				pad.layer.write().clear();
				
				var timeIndex = 0;
				var eventIndex = 0;
				var endLength = h.length;
				var recall = {
					call: false
				};
				
				function callerback(){
					drawingState = false;
					if( replayLastState ){
						replayLastState = false;
						replayState = false;
						
						console.debug("[drawpad.history.replay] index = [%s], frame = [%s] [%ss:%sms], countPerFrame = [%s], mode = [%s]", 
							(" END").slice(-4),
							("     " + timeIndex).slice(-5), 
							("000" + Math.floor(timeIndex * pad.settings.TIME_DELAY / 1000)).slice(-3), 
							("   " + Math.floor(timeIndex * pad.settings.TIME_DELAY % 1000)).slice(-3), 
							("      " + pad.settings.replaySpeed).slice(-6),
							"LAST"
						);
						console.log("%c[drawpad.history.replay] End replay state.", "color: darkgreen; font-weight: bold");
						console.groupEnd();
					}
					if(recall.call){
						recall.call();
					}
				}
				
				function timeout(){
					if( recall.call ){
						recall.call = false;
					}
					while(h[eventIndex][pad.modes.define.time] <= Math.floor(timeIndex)){
						if( drawingState ){
							recall.call = timeout;
							return;
						}else{
							console.debug("[drawpad.history.replay] index = [%s], frame = [%s] [%ss:%sms], countPerFrame = [%s], mode = [%s]", 
								("    " + eventIndex).slice(-4),
								("     " + timeIndex).slice(-5), 
								("000" + Math.floor(timeIndex * pad.settings.TIME_DELAY / 1000)).slice(-3), 
								("   " + Math.floor(timeIndex * pad.settings.TIME_DELAY % 1000)).slice(-3), 
								("      " + pad.settings.replaySpeed).slice(-6),
								pad.modes[h[eventIndex][pad.modes.define.drawType]].name
							);
							drawingState = true;
							pad.modes[h[eventIndex][pad.modes.define.drawType]]
								.play(h[eventIndex], callerback);
							eventIndex++;
							if(eventIndex >= endLength){
								replayLastState = true;
								historyEvent = h;
								return true;
							}
						}
					}
					timeIndex += pad.settings.get( "replaySpeed" );
					setTimeout(timeout, 1);
				}
				timeout();
			},
			getSize: function(){
				return JSON.stringify( historyEvent ).length;
			},
			getMsgPackSize: function(){
				return msgpack.pack( historyEvent ).length;
			}
		};
		
		return history;
	};
	
	history = history();
	
	return history;
});
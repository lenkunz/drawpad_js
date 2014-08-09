define(function(){
	var Settings = function( obj ){
			if(obj){
				this.set(obj);
			}
			return this;
		};

	Settings.prototype = {
		ex: {},
		get: function( obj ){
			if(typeof obj !== "undefined" && typeof this[obj] !== "undefined"){
				return this[obj];
			}
			return 0;
		},
		create: function( obj ){
			this[obj] = $.extend({}, this.ex);
			return this[obj];
		},
		set: function( obj ){
			var eventF, setF;
			
			eventF = {
				add: function( name, call ){
					name = "_" + name;
					if( typeof name === "undefined" ){
						return false;
					}
					if( typeof this.event[name] !== "undefined" ){
						this.event[name] = [];
					}
					if( typeof call !== "undefined" ){
						this.event[name].push(call);
					}
					return true;
				},
				remove: function( name, call ){
					var index, count = 0;
					name = "_" + name;
					while( (index = this.event[name].indexOf(call)) !== -1 ){
						this.event[name].splice(index, 1);
						count++;
					}
					return count;
				},
				run: function( name, data ){
					name = "_" + name;
					if( typeof event[name] === "undefined" ){
						return false;
					}
					for( var call in event[name] ){
						try{
							call( data );
						}catch( e ){}
					}
					return true;
				}
			};
			
			setF = function ( a, b ){
				if(typeof a !== "undefined" && a !== "event" && a !== "set"){
					if(typeof b !== "undefined"){
						this[a] = b;
					}else{
						$.extend(this, a, {event: eventF, set: setF});
					}
				} else {
					return false;
				}
				return this;
			};
			
			this.ex = $.extend({}, obj, {event: eventF, set: setF});
			this.ex.set = setF;
			this.ex.event = eventF;
			return this;
		}			
	};
	
	return Settings;
});
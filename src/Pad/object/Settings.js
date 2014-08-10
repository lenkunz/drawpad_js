define(function(){
	var Settings = function(){
		var Settings = {};
		
		Settings = function( obj ){
			if( obj ){
				this.set(obj);
				data[this] = {};
			}
		};
		
		var data = {};
		
		Settings.prototype = {
			ex: {},
			get: function( obj ){
				if(typeof obj !== "undefined" && typeof this[obj] !== "undefined"){
					return data[ this ][ obj ];
				}
				return 0;
			},
			create: function( obj ){
				data[ this ][ obj ] = $.extend({}, this.ex);
				return data[ this ][ obj ];
			},
			set: function( obj ){
				var event, set, add, get, isset;
				
				event = {
					data: {},
					add: function( name, call ){
						if( typeof name === "undefined" ){
							return false;
						}
						if( typeof this.event.data[name] === "undefined" ){
							this.data[name] = [];
						}
						if( typeof call === "function" ){
							this.data[name].push(call);
						}
						return true;
					},
					remove: function( name, call ){
						var index, count = 0;
						if( typeof this.data[name] === "undefined" ){
							return count;
						}
						while( (index = this.data[name].indexOf(call)) !== -1 ){
							this.data[name].splice(index, 1);
							count++;
						}
						return count;
					},
					run: function( name, sender, data ){
						if( typeof this.data[name] === "undefined" ){
							return false;
						}
						for( var call in this.data[name] ){
							try{
								this.data[name][call]( sender, data );
							}catch( e ){}
						}
						return true;
					},
					has: function( name, call ){
						for( var index in this.data ){
							if( index === name ){
								if( typeof call !== "undefined" ){
									call();
								}
								return true;
							}
						}
						return false;
					},
					list: function(){
						var result = [];
						for( var index in this.data ){
							result.push( index );
						}
						return result;
					},
					on: function( name, func ){
						if( this.has( name ) ){
							this.add( name, func );
						}
					}
				};
				
				set = function ( a, b ){
					if( typeof a !== "undefined"){
						if( typeof b !== "undefined" ){
							if( arguments.length > 2 ){
								var referer = this.data[ a ][ b ], i;
								for( i = 2; i < arguments.length - 2; i++ ){
									referer = referer[ arguments[ i ] ];
								}
								referer[ arguments[ i ] ] = arguments[ i + 1 ];
							} else {
								this.data[ a ] = b;
							}
						} else {
							extend( this.data, a );
						}
					} else {
						return false;
					}
					return this;
				};
				
				// Get values from setting
				// @a - name of variables
				// @... - subname of parameters before this
				get = function ( a ){
					if( typeof a !== "undefined" && typeof this.data[ a ] !== "undefined" ){
						var value, v;
						value = this.data;

						for( var i in arguments ){
							v = arguments[i];
							if( typeof value[ v ] !== "undefined" ){
								value = value[ v ];
							} else {
								return undefined;
							}
						}
						
						return value;
					} else {
						return undefined;
					}
				};
				
				isset = function( name ){
					if( typeof name !== "undefined" && typeof this.data[ name ] !== "undefined" ){
						var value, v;

						for( var i in arguments ){
							v = arguments[i];
							if( typeof value[ v ] !== "undefined" ){
								value = value[ v ];
							} else {
								return false;
							}
						}
						
						return true;
					} else {
						return false;
					}
				};
				
				add = function ( a, returnAdded ){
					if( typeof a !== "undefined" && !isNaN( this.data[ a ] ) ){
						if( typeof returnAdded !== "undefined" && returnAdded === true ){
							return ++this.data[ a ];
						} else {
							return this.data[ a ]++;
						}
					} else {
						return false;
					}
				};

				this.ex = {
					data: obj,
					event: event,
					set: set,
					get: get,
					add: add,
					isset: isset,
				};
				
				return this;
			}			
		};
		
		return Settings;
	};
	
	Settings = Settings();
	return Settings;
});
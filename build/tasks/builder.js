/* requirejs builder */
module.exports = function( grunt ){

	"use strict";
	
	var fs = require('fs'),
		config = {
			baseUrl: "/../../src",
			paths:{
				jquery: "jquery"
			},
			name: "drawpad",
			out: "dist/drawpad.js",
			optimize: "none",
			skipSemiColonInsertion: true
		};
	
	grunt.registerMultitask(
		"builder",
		"Concatenate source, and some edit ^w^",
		function(){
			var done = this.async(),
				version = grunt.config( "pkg.version" );
			
			if( process.env.COMMIT ){
				version += "_" + process.env.COMMIT
			}
			
			if( this.data.name ){
				config.name = this.data.name;
			}
			
			if( this.data.dest ){
				config.out = this.data.dest;
			}
			
			grunt.config.set( "pkg.version", version );
		}
	);
}
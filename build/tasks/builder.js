/* requirejs builder */
module.exports = function( grunt ){

	"use strict";
	
	var fs = require('fs'),
		requirejs = require('requirejs'),
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
	
	grunt.registerMultiTask(
		"builder",
		"Concatenate source, and some edit ^w^",
		function(){
			var done = this.async(),
				version = grunt.config( "pkg.version" ),
				name = this.data.dest;
			
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
			
			config.out = function( complied ){
				complied = complied
					.replace( /@VERSION/g, version )
				grunt.file.write( name, complied );
			}
			
			requirejs.optimize( config, function( response ){
				grunt.verbose.writeln( response );
				grunt.log.ok( "File " + name + " created." );
			});
		}
	);
}
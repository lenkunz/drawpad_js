/* requirejs builder */
module.exports = function( grunt ){

	"use strict";
	
	var fs = require('fs'),
		requirejs = require('requirejs'),
		rdefineEnd = /\}\);[^}\w]*$/,
		config = {
			baseUrl: "src",
			paths:{
				jquery: "jquery"
			},
			name: "drawpad",
			out: "dist/drawpad.js",
			optimize: "none",
			findNestedDependencies: true,
			skipSemiColonInsertion: true,
			wrap: {
				startFile: "src/intro.js",
				endFile: "src/outro.js"
			},
			onBuildWrite: function(name, paths, content){
				var split = content.split("\n");
				var n = "";
				for( var s in split ){
					n += "\t" + split[s];
				}
				return n + "\n";
			}
		};
	
	grunt.registerMultiTask(
		"build",
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
					.replace( /@DATE/g, ( new Date() ).toISOString().replace( /:\d+\.\d+Z$/, "Z" ) );

				grunt.file.write( name, complied );
			}
			
			requirejs.optimize( config, function( response ){
				grunt.verbose.writeln( response );
				grunt.log.ok( "File " + name + " created." );
				done();
			});
		}
	);
}
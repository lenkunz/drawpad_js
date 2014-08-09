"use strict";

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON("package.json"),
		banner: "/*! <%= pkg.title || pkg.name %> v<%= pkg.version %> |" +
			" Copyright (c) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %> |" +
			" <%= pkg.licenses.url %> */\n",
		// Task configuration.
		clean: {
			files: [ "dist/*.js" ]
		},
		build: {
			all: {
				dest: "dist/drawpad.js",
				name: "drawpad"
			}
		},
		uglify: {
			options: {
				banner: "<%= banner %>",
				compress: {
					unused: false
				},
			},
			build: {
				src: "<%= build.all.dest %>",
				dest: "dist/<%= pkg.name %>.min.js"
			},
		},
		jshint: {
			options: {
				jshintrc: true
			},
			gruntfile: {
				src: "Gruntfile.js"
			},
			build: {
				src: [ "src/*.js", "src/**/*.js" ]
			},
			dist: {
				src: [ "dist/*.js" ]
			}
		},
		watch: {
			gruntfile: {
				files: "<%= jshint.gruntfile.src %>",
				tasks: [ "jshint:gruntfile" ]
			},
			src: {
				files: "<%= jshint.src.src %>",
				tasks: [ "jshint:src", "qunit" ]
			},
			test: {
				files: "<%= jshint.test.src %>",
				tasks: [ "jshint:test", "qunit" ]
			},
		},
		jsonlint: {
			pkg : {
				src : [ "package.json" ]
			},
			src : {
				src: [	"src/.jshintrc", 
						"src/**/.jshintrc", 
						"dist/.jshintrc", 
						"dist/**/.jshintrc" ]
			}
		},
	});
	
	// load-grunt-task from NPM
	require( "load-grunt-tasks" )( grunt );
	
	// load specified task
	grunt.loadTasks( "build/tasks" );
	
	// These plugins provide necessary tasks.
	// Check if it has installed
	grunt.loadNpmTasks( "grunt-contrib-clean" );
	grunt.loadNpmTasks( "grunt-contrib-uglify" );
	grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.loadNpmTasks( "grunt-contrib-watch" );
	grunt.loadNpmTasks( "grunt-jsonlint" );
	grunt.loadNpmTasks( "grunt-contrib-csslint" );

	// Default task.
	grunt.registerTask( "lint", [ "jshint" ] );
	grunt.registerTask( "dev", [ "clean", "build", "lint"]);
	grunt.registerTask( "default", [ "jsonlint", "dev", "uglify" ]);
};

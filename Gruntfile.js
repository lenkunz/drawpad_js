'use strict';

module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('drawpad.jquery.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		clean: {
			files: [ 'dist' ]
		},
		builder: {
			dest: 'dist/drawpad.js',
			name: 'drawpad'
		},
		uglify: {
			options: {
				banner: '<%= banner %>',
				compress: {
					unused: false
				},
			},
			build: {
				src: '<%= concat.dist.dest %>',
				dest: 'dist/<%= pkg.name %>.min.js'
			},
		},
		jshint: {
			options: {
				jshintrc: true
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			src: {
				src: [ 'src/**/*.js' ]
			},
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: [ 'jshint:gruntfile' ]
			},
			src: {
				files: '<%= jshint.src.src %>',
				tasks: [ 'jshint:src', 'qunit' ]
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: [ 'jshint:test', 'qunit' ]
			},
		},
		jsonlint: {
			pkg : {
				src : [ "package.json" ]
			}
		},
	});
	
	// load-grunt-task from NPM
	require( "load-grunt-tasks" )( grunt );
	
	// load specified task
	grunt.loadTasks( "build/tasks" );
	
	// These plugins provide necessary tasks.
	// Check if it has installed
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-jsonlint' );
	grunt.loadNpmTasks( 'grunt-contrib-csslint' );

	// Default task.
	grunt.registerTask( "lint", [ "jshint" ] );
	grunt.registerTask( "build", [ "lint", "clean", "builder"]);
	grunt.registerTask( "default", [ "jsonlint", "build", "uglify" ]);
};

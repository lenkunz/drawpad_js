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
			files: ['dist']
		},
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
		    build: {
				files: [
					// Core
					{
						dest: 'dist/each/pad/core.js',
						src: [
							'src/pad/core.js',
							'src/pad/core.*.js'
						]
					},
					// Layer container
					{
						dest: 'dist/each/pad/layerContainer.js',
						src: [
							'src/pad/layerContainer.js',
							'src/pad/layerContainer.*.js',
							'src/pad/layerContainer/*.js'
						]
					},
					{
						dest: 'dist/each/drawpad.controll.js'
					}
				]
			},
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
				src: ['src/**/*.js']
			},
			test: {
				src: ['test/**/*.js']
			},
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			src: {
				files: '<%= jshint.src.src %>',
				tasks: ['jshint:src', 'qunit']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'qunit']
			},
		},
		jsonlint: {
			pkg : {
				src : [ "package.json" ]
			}
		},
	});

	// These plugins provide necessary tasks.
	// Check if it has installed
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jsonlint');
	grunt.loadNpmTasks('grunt-contrib-csslint');

	// Default task.
	grunt.registerTask('lint' ['jshint']);
	grunt.registerTask('build', ['lint', 'clean', 'concat']);
	grunt.registerTask('default', ['jsonlint', 'build', 'uglify']);
};

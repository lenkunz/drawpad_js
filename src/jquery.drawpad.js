/*
 * drawpad
 * https://github.com/lenkyun/drawpad_js
 *
 * Copyright (c) 2014 Rapeapach Suwasri
 * Licensed under the CC0, 1.0 licenses.
 */

(function($) {

  // Collection method.
  $.fn.drawpad = function() {
    return this.each(function(i) {
      // Do something awesome to each selected element.
      $(this).html('awesome' + i);
    });
  };

  // Static method.
  $.drawpad = function(options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.drawpad.options, options);
    // Return something awesome.
    return 'awesome' + options.punctuation;
  };

  // Static method default options.
  $.drawpad.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].drawpad = function(elem) {
    // Is this element awesome?
    return $(elem).text().indexOf('awesome') !== -1;
  };

}(jQuery));

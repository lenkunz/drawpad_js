/*
 * drawpad_js
 * http://lenkyun.tk/drawpad_js/
 *
 * Copyright (c) 2014 Rapeapach Suwasri
 * Licensed under the MIT license.
 */

(function($) {

  // Collection method.
  $.fn.drawpad_js = function() {
    return this.each(function(i) {
      // Do something awesome to each selected element.
      $(this).html('awesome' + i);
    });
  };

  // Static method.
  $.drawpad_js = function(options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.drawpad_js.options, options);
    // Return something awesome.
    return 'awesome' + options.punctuation;
  };

  // Static method default options.
  $.drawpad_js.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].drawpad_js = function(elem) {
    // Is this element awesome?
    return $(elem).text().indexOf('awesome') !== -1;
  };

}(jQuery));

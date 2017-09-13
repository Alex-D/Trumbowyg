(function($) {
    'use strict';

    $('.js-code-to-eval').each(function() {
        eval($(this).text()); // jshint ignore:line
    });
})(jQuery);

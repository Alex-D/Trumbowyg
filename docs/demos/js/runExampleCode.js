(function($) {
    'use strict';

    $('.js-code-to-eval').each(function() {
        eval($(this).text()); // jshint ignore:line
        $(this).text(
          $(this).text()
              .replace(/'Client-ID\s[a-z0-9]+'/, '\'Client-ID xxxxxxxxxxxx\'')
              .replace(/apiKey:\s+'.*'/, 'apiKey: \'xxxxxxxxxxxx\'')
        );
    });
})(jQuery);

(function ($, Prism) {
    'use strict';

    // My plugin default options
    var defaultOptions = {};

    function highlightIt(text, language) {
        return [
            '<pre class="language-' + language + '">',
            '<code class="language-' + language + '">' + Prism.highlight(text, Prism.languages[language]) + '</code>',
            '</pre>',
            '<p></p>'
        ].join('');
    }

    // If my plugin is a button
    function buildButtonDef(trumbowyg) {
        return {
            fn: function () {
                var $modal = trumbowyg.openModal('Code', [
                        '<div class="form-group">',
                        '   <select class="form-control" id="language">',
                        (function () {
                            var options = '';

                            for (var lang in Prism.languages) {
                                if (Prism.languages[lang].comment) options += '<option value="' + lang + '">' + lang + '</option>';
                            }

                            return options;
                        })(),
                        '   </select>',
                        '</div>',
                        '<div class="form-group">',
                        '   <textarea class="form-control" id="code"></textarea>',
                        '</div>',
                    ].join('\n')),
                    $language = $modal.find('#language'),
                    $code = $modal.find('#code');

                // Listen clicks on modal box buttons
                $modal.on('tbwconfirm', function (e) {
                    trumbowyg.range.deleteContents();
                    trumbowyg.range.insertNode($(highlightIt($code.val(), $language.val()))[0]);
                    trumbowyg.closeModal();
                });

                $modal.on('tbwcancel', function (e) {
                    trumbowyg.closeModal();
                });
            }
        }
    }

    $.extend(true, $.trumbowyg, {
        // Add some translations
        langs: {
            en: {
                highlight: 'Code syntax highlight'
            }
        },
        // Add our plugin to Trumbowyg registred plugins
        plugins: {
            highlight: {
                init: function (trumbowyg) {
                    // Fill current Trumbowyg instance with my plugin default options
                    trumbowyg.o.plugins.highlight = $.extend(true, {},
                        defaultOptions,
                        trumbowyg.o.plugins.highlight || {}
                    );

                    // If my plugin is a button
                    trumbowyg.addBtnDef('highlight', buildButtonDef(trumbowyg));
                }
            }
        }
    })
})(jQuery, Prism);
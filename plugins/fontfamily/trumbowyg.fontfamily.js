(function ($) {
    'use strict';

    $.extend(true, $.trumbowyg, {
        langs: {
            // jshint camelcase:false
            en: {
                fontFamily: 'Font'
            },
            da: {
                fontFamily: 'Skrifttype'
            },
            fr: {
                fontFamily: 'Police'
            },
            de: {
                fontFamily: 'Schriftart'
            },
            nl: {
                fontFamily: 'Lettertype'
            },
            tr: {
                fontFamily: 'Yazı Tipi'
            },
            zh_tw:{
                fontFamily: '字體',
            }
        }
    });
    // jshint camelcase:true

    var defaultOptions = {
        fontList: [
            {name: 'Arial', family: 'Arial, Helvetica, sans-serif'},
            {name: 'Arial Black', family: '\'Arial Black\', Gadget, sans-serif'},
            {name: 'Comic Sans', family: '\'Comic Sans MS\', Textile, cursive, sans-serif'},
            {name: 'Courier New', family: '\'Courier New\', Courier, monospace'},
            {name: 'Georgia', family: 'Georgia, serif'},
            {name: 'Impact', family: 'Impact, Charcoal, sans-serif'},
            {name: 'Lucida Console', family: '\'Lucida Console\', Monaco, monospace'},
            {name: 'Lucida Sans', family: '\'Lucida Sans Uncide\', \'Lucida Grande\', sans-serif'},
            {name: 'Palatino', family: '\'Palatino Linotype\', \'Book Antiqua\', Palatino, serif'},
            {name: 'Tahoma', family: 'Tahoma, Geneva, sans-serif'},
            {name: 'Times New Roman', family: '\'Times New Roman\', Times, serif'},
            {name: 'Trebuchet', family: '\'Trebuchet MS\', Helvetica, sans-serif'},
            {name: 'Verdana', family: 'Verdana, Geneva, sans-serif'}
        ],
        currentSelect: 'default'
    };

    // Add dropdown with web safe fonts
    $.extend(true, $.trumbowyg, {
        plugins: {
            fontfamily: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.fontfamily = trumbowyg.o.plugins.fontfamily || defaultOptions;
                    trumbowyg.addBtnDef('fontfamily', {
                        dropdown: buildDropdown(trumbowyg),
                        hasIcon: false,
                        text: trumbowyg.o.plugins.fontfamily.currentSelect
                    });
                },
              tagHandler: function (element, trumbowyg) {
                var $btn = $('.' + trumbowyg.o.prefix + 'fontfamily' + '-button', trumbowyg.$btnPane);
                var documentSelection = trumbowyg.doc.getSelection();
                var $focusElement = $(documentSelection.focusNode).parent();
                var styleFont = $focusElement.attr('style');

                if (styleFont) {
                  var font = styleFont.slice(0, styleFont.indexOf(','));
                  var name = defaultOptions.fontList.filter(function (el) {
                    return ~font.indexOf(el.name);
                  });
                  $btn.text(name[0] ? name[0].name : font);
                }
                else {
                  $btn.text(trumbowyg.o.plugins.fontfamily.currentSelect);
                }
                return ['fontfamily'];
              }
            }
        }
    });

    function buildDropdown(trumbowyg) {
        var dropdown = [];

        $.each(trumbowyg.o.plugins.fontfamily.fontList, function (index, font) {
            trumbowyg.addBtnDef('fontfamily_' + index, {
                title: '<span style="font-family: ' + font.family + ';">' + font.name + '</span>',
                hasIcon: false,
                fn: function () {
                    trumbowyg.execCmd('fontName', font.family, true);
                    var $btn = $('.' + 'trumbowyg-' + 'fontfamily' + '-button', trumbowyg.$btnPane);
                    $btn.text(font.name);
                }
            });
            dropdown.push('fontfamily_' + index);
        });

        return dropdown;
    }
})(jQuery);

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
        ]
    };

  function getDefaultName () {
    var body = document.getElementsByTagName('textarea')[0];
    var style = window.getComputedStyle(body, null).getPropertyValue('font-family');
    var font = style.slice(0, style.indexOf(','));
    var fontName = defaultOptions.fontList.filter(function (el) {
      return ~font.indexOf(el.name);
    });
    return fontName[0] ? fontName[0].name : font;
  }

    // Add dropdown with web safe fonts
    $.extend(true, $.trumbowyg, {
        plugins: {
            fontfamily: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.fontfamily = trumbowyg.o.plugins.fontfamily || defaultOptions;
                    trumbowyg.addBtnDef('fontfamily', {
                        dropdown: buildDropdown(trumbowyg),
                        hasIcon: false,
                        text: getDefaultName()
                    });
                },
                tagHandler: function (element, t) {
                    var $btn = $('.' + t.o.prefix + 'fontfamily' + '-button', t.$btnPane);
                    var focusElement = $(t.doc.getSelection().focusNode).parent().get(0);
                    var styleFont = focusElement.style.fontFamily;

                    if (styleFont) {
                        var font = styleFont.slice(0, styleFont.indexOf(',')).replace(/"/g, '');
                        $btn.text(font);
                    } else {
                        $btn.text(getDefaultName());
                    }
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

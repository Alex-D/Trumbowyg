
/* ===========================================================
 * trumbowyg.paragraph.js v1.0
 * Indent or Outdent plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Fabien COLAS (Fabacks)
 *          Website : alex-d.fr
 */

 (function ($) {
    'use strict';

    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                indent: 'Indent',
                outdent: 'Outdent'  
            },
            fr: {
                indent: 'Augmenter le retrait',
                outdent: 'Diminuer le retrait'
            }
        }
    });

    // Adds the extra button definition
    $.extend(true, $.trumbowyg, {
        plugins: {
            paragraph: {
                init: function (trumbowyg) {
                    var indentBtnDef = {
                        fn: 'indent',
                        title: trumbowyg.lang.indent,
                        isSupported: function () { 
                            return !!document.queryCommandSupported && !!document.queryCommandSupported('indent'); 
                        },
                        hasIcon: false,
                    };

                    var outdentBtnDef = {
                        fn: 'outdent',
                        title: trumbowyg.lang.outdent,
                        isSupported: function () { 
                            return !!document.queryCommandSupported && !!document.queryCommandSupported('outdent'); 
                        },
                        hasIcon: false,
                    };

                    trumbowyg.addBtnDef('indent', indentBtnDef);
                    trumbowyg.addBtnDef('outdent', outdentBtnDef);
                }
            }
        }
    })
})(jQuery);
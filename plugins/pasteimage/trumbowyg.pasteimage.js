/* ===========================================================
 * trumbowyg.pasteimage.js v1.0
 * Basic base64 paste plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Alexandre Demode (Alex-D)
 *          Twitter : @AlexandreDemode
 *          Website : alex-d.fr
 */

(function ($) {
    'use strict';

    $.extend(true, $.trumbowyg, {
        opts: {
            pasteHandler: function (pasteEvent, tbw) {
                try {
                    var items = (pasteEvent.originalEvent || pasteEvent).clipboardData.items,
                        reader;

                    if (items[0].type.match(/^image\//)) {
                        reader = new FileReader();
                        /* jshint -W083 */
                        reader.onloadend = function (event) {
                            tbw.execCmd('insertImage', event.target.result, true);
                        };
                        /* jshint +W083 */
                        reader.readAsDataURL(items[0].getAsFile());
                    }
                } catch (c) {
                }
            }
        }
    });
})(jQuery);

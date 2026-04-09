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

    var defaultOptions = {
        maxFileSize: 0
    };

    $.extend(true, $.trumbowyg, {
        plugins: {
            pasteImage: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.pasteImage = trumbowyg.o.plugins.pasteImage || defaultOptions;

                    trumbowyg.pasteHandlers.push(function (pasteEvent) {
                        try {
                            var items = (pasteEvent.originalEvent || pasteEvent).clipboardData.items,
                                mustPreventDefault = false,
                                reader,
                                file;

                            for (var i = items.length - 1; i >= 0; i -= 1) {
                                if (items[i].type.match(/^image\//)) {
                                    file = items[i].getAsFile();

                                    // Validate file size
                                    var maxFileSize = trumbowyg.o.plugins.pasteImage.maxFileSize || 0;
                                    if (maxFileSize > 0 && file.size > maxFileSize) {
                                        continue;
                                    }

                                    reader = new FileReader();
                                    /* jshint -W083 */
                                    reader.onloadend = function (event) {
                                        trumbowyg.execCmd('insertImage', event.target.result, false, true);
                                    };
                                    /* jshint +W083 */
                                    reader.readAsDataURL(file);

                                    mustPreventDefault = true;
                                }
                            }

                            if (mustPreventDefault) {
                                pasteEvent.stopPropagation();
                                pasteEvent.preventDefault();
                            }
                        } catch (c) {
                        }
                    });
                }
            }
        }
    });
})(jQuery);

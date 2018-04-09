/* ===========================================================
 * trumbowyg.pasteembed.js v1.0
 * Url paste to iframe with noembed. Plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Max Seelig
 *          Facebook : https://facebook.com/maxse
 *          Website : https://www.maxmade.nl/
 */

(function($) {
    "use strict";

    $.extend(true, $.trumbowyg, {
        plugins: {
            pasteImage: {
                init: function(trumbowyg) {
                    trumbowyg.pasteHandlers.push(function(pasteEvent) {
                        try {
                            var clipboardData = (pasteEvent.originalEvent || pasteEvent).clipboardData;
                            var pastedData = clipboardData.getData("Text");
                            var request = null;

                            if (pastedData.startsWith("http")) {

                                pasteEvent.stopPropagation();
                                pasteEvent.preventDefault();

                                var query = {
                                    url: pastedData.trim()
                                };
                                var content = "";
                                var fails = 0;

                                if (request && request.transport) request.transport.abort();

                                request = $.ajax({
                                    crossOrigin: true,
                                    url: "https://noembed.com/embed?nowrap=on",
                                    url2: "https://api.maxmade.nl/url2iframe/embed",
                                    type: "GET",
                                    data: query,
                                    cache: false,
                                    dataType: "jsonp",
                                    success: function(res) {
                                        if (res.html) {
                                            fails = 0;
                                            content = res.html;
                                        } else {
                                            fails++;
                                        }
                                    },
                                    error: function(res) {
                                        fails++;
                                    },
                                    complete: function() {
                                        if (fails === 1) {
                                            this.url = this.url2;
                                            this.data = query;
                                            $.ajax(this);
                                        }
                                        if (fails === 2) {
                                            content = $("<a>", {
                                                href: pastedData,
                                                text: pastedData
                                            }).prop('outerHTML');
                                        }
                                        if (content.length > 0) {
                                            fails = 0;
                                            trumbowyg.execCmd("insertHTML", content);
                                        }
                                    }
                                });
                            }
                        } catch (c) {}
                    });
                }
            }
        }
    });
})(jQuery);
/* ===========================================================
 * trumbowyg.pasteurl.js v1.0
 * Url paste handling with noembed. Plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Max Seelig
 *          Facebook : https://facebook.com/maxse
 *          Website : https://www.maxmade.nl/
 */

(function ($) {
    'use strict';

    $.extend(true, $.trumbowyg, {
        plugins: {
            pasteImage: {
                init: function (trumbowyg) {
                    trumbowyg.pasteHandlers.push(function (pasteEvent) {
                        try {
                          var clipboardData = (pasteEvent.originalEvent || pasteEvent).clipboardData;
                          var pastedData = clipboardData.getData('Text');
                          var request = null;
                              if(pastedData.startsWith("http")){
                                pasteEvent.stopPropagation();
                                pasteEvent.preventDefault();

                                var url = pastedData;
                                var query = { url : url.trim() };

                                if (request && request.transport) request.transport.abort();

                                request = $.ajax({
                                  crossOrigin: true,
                                  url: "https://noembed.com/embed?nowrap=on",
                                  type: "GET",
                                  data: query,
                                  cache: false,
                                  dataType: "json",
                                  success: function(res) {
                                    if (res.html) {
                                      let content = res.html;
                                      trumbowyg.execCmd('insertHTML', content);
                                    }
                                    else {
                                      let content = "<a href='"+pastedData+"'>"+pastedData+"</a>";
                                      trumbowyg.execCmd('insertHTML', content);
                                    }
                                  },
                                  error: function() {
                                    console.log('Error connecting to noembed');
                                  }
                                });
                              }
                        } catch (c) {
                        }
                    });
                }
            }
        }
    });
})(jQuery);

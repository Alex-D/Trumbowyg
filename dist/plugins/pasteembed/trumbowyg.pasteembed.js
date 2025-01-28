/* ===========================================================
 * trumbowyg.pasteembed.js v1.0
 * Url paste to iframe with noembed. Plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Max Seelig
 *          Facebook : https://facebook.com/maxse
 *          Website : https://www.maxmade.nl/
 */

/* global AbortSignal:true */
(function($) {
    'use strict';

    var defaultOptions = {
        enabled: true,
        endpoint: 'https://noembed.com/embed?nowrap=on'
    };

    $.extend(true, $.trumbowyg, {
        plugins: {
            pasteEmbed: {
                init: function(trumbowyg) {
                    trumbowyg.o.plugins.pasteEmbed = $.extend(true, {}, defaultOptions, trumbowyg.o.plugins.pasteEmbed || {});

                    // Compatibility layer with older 'endpoints' array options
                    if (Array.isArray(trumbowyg.o.plugins.pasteEmbed.endpoints)) {
                        trumbowyg.o.plugins.pasteEmbed.endpoint = trumbowyg.o.plugins.pasteEmbed.endpoints[0];
                    }

                    if (!trumbowyg.o.plugins.pasteEmbed.enabled) {
                        return;
                    }

                    trumbowyg.pasteHandlers.push(function(pasteEvent) {
                        try {
                            var clipboardData = (pasteEvent.originalEvent || pasteEvent).clipboardData,
                                pastedData = clipboardData.getData('Text'),
                                endpoint = trumbowyg.o.plugins.pasteEmbed.endpoint;

                            if (!pastedData.startsWith('http')) {
                                return;
                            }

                            pasteEvent.stopPropagation();
                            pasteEvent.preventDefault();

                            // Build request URL
                            var requestUrl = new URL(endpoint);
                            requestUrl.searchParams.append('url', pastedData.trim());

                            // Launch async request
                            fetch(requestUrl, {
                                method: 'GET',
                                cache: 'no-cache',
                                signal: AbortSignal.timeout(2000)
                            }).then((response) => {
                                return response.json().then((json) => {
                                    return json.html;
                                });
                            }).catch(() => {
                                return undefined;
                            }).then((content) => {
                                if (content === undefined) {
                                    content = $('<a>', {
                                        href: pastedData,
                                        text: pastedData
                                    })[0].outerHTML;
                                }

                                trumbowyg.execCmd('insertHTML', content);
                            });
                        } catch (c) {}
                    });
                }
            }
        }
    });
})(jQuery);

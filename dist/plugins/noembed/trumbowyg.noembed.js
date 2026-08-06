/* ===========================================================
 * trumbowyg.noembed.js v1.0
 * noEmbed plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Jake Johns (jakejohns)
 */

/* global AbortSignal:true */
(function ($) {
    'use strict';

    var defaultOptions = {
        proxy: 'https://noembed.com/embed?nowrap=on',
        urlFiled: 'url',
        data: [],
        success: undefined,
        error: undefined
    };

    $.extend(true, $.trumbowyg, {
        langs: {
            // jshint camelcase:false
            en: {
                noembed: 'Noembed',
                noembedError: 'Error'
            },
            az: {
                noembed: 'Noembed',
                noembedError: 'Xəta'
            },
            by: {
                noembedError: 'Памылка'
            },
            cs: {
                noembedError: 'Chyba'
            },
            da: {
                noembedError: 'Fejl'
            },
            de: {
                noembed: 'Noembed',
                noembedError: 'Fehler'
            },
            et: {
                noembed: 'Noembed',
                noembedError: 'Viga'
            },
            fr: {
                noembedError: 'Erreur'
            },
            hu: {
                noembed: 'Noembed',
                noembedError: 'Hiba'
            },
            ja: {
                noembedError: 'エラー'
            },
            ko: {
                noembed: 'oEmbed 넣기',
                noembedError: '에러'
            },
            pt_br: {
                noembed: 'Incorporar',
                noembedError: 'Erro'
            },
            ru: {
                noembedError: 'Ошибка'
            },
            sl: {
                noembed: 'Noembed',
                noembedError: 'Napaka'
            },
            sk: {
                noembedError: 'Chyba'
            },
            tr: {
                noembedError: 'Hata'
            },
            zh_tw: {
                noembed: '插入影片',
                noembedError: '錯誤'
            },
            // jshint camelcase:true
        },

        plugins: {
            noembed: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.noembed = $.extend(true, {}, defaultOptions, trumbowyg.o.plugins.noembed || {});

                    var btnDef = {
                        fn: function () {
                            var $modal = trumbowyg.openModalInsert(
                                // Title
                                trumbowyg.lang.noembed,

                                // Fields
                                {
                                    url: {
                                        label: 'URL',
                                        required: true
                                    }
                                },

                                // Callback
                                function (data) {
                                    // Build request URL
                                    var requestUrl = new URL(trumbowyg.o.plugins.noembed.proxy);
                                    Object.keys(data).forEach((key) => {
                                        requestUrl.searchParams.append(key, data[key].trim());
                                    });

                                    // Launch async request
                                    fetch(requestUrl, {
                                        method: 'GET',
                                        cache: 'no-cache',
                                        signal: AbortSignal.timeout(2000)
                                    }).then((response) => {
                                        if (trumbowyg.o.plugins.noembed.success) {
                                            trumbowyg.o.plugins.noembed.success(data, trumbowyg, $modal);
                                            return;
                                        }

                                        return response.json().then((json) => {
                                            if (!json.html) {
                                                trumbowyg.addErrorOnModalField(
                                                    $('input[type=text]', $modal),
                                                    json.error
                                                );
                                                return;
                                            }

                                            trumbowyg.execCmd('insertHTML', json.html);
                                            setTimeout(function () {
                                                trumbowyg.closeModal();
                                            }, 250);
                                        });
                                    }).catch((...args) => {
                                        if (trumbowyg.o.plugins.noembed.error) {
                                            trumbowyg.o.plugins.noembed.error(...args);
                                            return;
                                        }

                                        trumbowyg.addErrorOnModalField(
                                            $('input[type=text]', $modal),
                                            trumbowyg.lang.noembedError
                                        );
                                    });
                                }
                            );
                        }
                    };

                    trumbowyg.addBtnDef('noembed', btnDef);
                }
            }
        }
    });
})(jQuery);

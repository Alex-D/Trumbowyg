/* ===========================================================
 * trumbowyg.noembed.js v1.0
 * noEmbed plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Jake Johns (jakejohns)
 */

(function ($) {
    'use strict';

    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                noembed: 'noEmbed',
                noembedError: 'Error'
            },
            sk: {
                noembedError: 'Chyba'
            },
            fr: {
                noembed: 'noEmbed',
                noembedError: 'Erreur'
            },
            cs: {
                noembedError: 'Chyba'
            }
        },

        opts: {
            noembed: {
                proxy: 'https://noembed.com/embed?nowrap=on',
                urlFiled: 'url',
                data: [],
                success: undefined,
                error: undefined
            },
            btnsDef: {
                noembed: {
                    fn: function (params, tbw) {
                        var $modal = tbw.openModalInsert(
                            // Title
                            tbw.lang.noembed,

                            // Fields
                            {
                                url: {
                                    label: 'URL',
                                    required: true
                                }
                            },

                            // Callback
                            function (data) {
                                $.ajax({
                                    url: tbw.o.noembed.proxy,
                                    type: 'GET',
                                    data: data,
                                    cache: false,
                                    dataType: 'json',

                                    success: tbw.o.noembed.success || function (data) {
                                        if (data.html) {
                                            tbw.execCmd('insertHTML', $(data.html).unwrap().html());
                                            setTimeout(function () {
                                                tbw.closeModal();
                                            }, 250);
                                        } else {
                                            tbw.addErrorOnModalField(
                                                $('input[type=text]', $modal),
                                                data.error
                                            );
                                        }
                                    },
                                    error: tbw.o.noembed.error || function () {
                                        tbw.addErrorOnModalField(
                                            $('input[type=text]', $modal),
                                            tbw.lang.noembedError
                                        );
                                    }
                                });
                            }
                        );
                    },
                    ico: 'insertImage'
                }
            }
        }
    });
})(jQuery);

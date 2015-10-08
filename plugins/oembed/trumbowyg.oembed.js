/* ===========================================================
 * trumbowyg.oembed.js v1.0
 * oEmbed plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Jake Johns (jakejohns)
 */

(function($){
    'use strict';

    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                oembed: "oEmbed",
                oembedError: "Error"
            },
            sk: {
                oembedError: "Chyba"
            },
            fr: {
                oembedError: "Erreur"
            },
            cs: {
                oembedError: "Chyba"
            }
        },

        oembed: {
            proxy: 'https://noembed.com/embed',
            urlFiled: 'url',
            data: [],
            success: undefined,
            error: undefined
        },

        opts: {
            btnsDef: {
                oembed: {
                    func: function(params, tbw){

                        var $modal = tbw.openModalInsert(
                            // Title
                            tbw.lang.oembed,

                            // Fields
                            {
                                url: {
                                    required: true
                                }
                            },

                            // Callback
                            function(data){

                                $.ajax({
                                    url:            $.trumbowyg.oembed.proxy,
                                    type:           'GET',
                                    data:           data,
                                    cache:          false,
                                    dataType:       'json',

                                    success: $.trumbowyg.oembed.success || function(data){
                                        if(data.html) {
                                            tbw.execCmd('insertHTML', data.html);
                                            setTimeout(function(){
                                                tbw.closeModal();
                                            }, 250);
                                        } else {
                                            tbw.addErrorOnModalField(
                                                $('input[type=text]', $modal),
                                                data.error
                                            );
                                        }
                                    },
                                    error: $.trumbowyg.oembed.error || function(){
                                        tbw.addErrorOnModalField(
                                            $('input[type=text]', $modal),
                                            tbw.lang.oembedError
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

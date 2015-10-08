/* ===========================================================
 * trumbowyg.noembed.js v1.0
 * noEmbed plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Jake Johns (jakejohns)
 */

(function($){
    'use strict';

    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                noembed: "noEmbed",
                noembedError: "Error"
            },
            sk: {
                noembedError: "Chyba"
            },
            fr: {
                noembedError: "Erreur"
            },
            cs: {
                noembedError: "Chyba"
            }
        },

        noembed: {
            proxy: 'https://nnoembed.com/embed',
            urlFiled: 'url',
            data: [],
            success: undefined,
            error: undefined
        },

        opts: {
            btnsDef: {
                noembed: {
                    func: function(params, tbw){

                        var $modal = tbw.openModalInsert(
                            // Title
                            tbw.lang.noembed,

                            // Fields
                            {
                                url: {
                                    required: true
                                }
                            },

                            // Callback
                            function(data){

                                $.ajax({
                                    url:            $.trumbowyg.noembed.proxy,
                                    type:           'GET',
                                    data:           data,
                                    cache:          false,
                                    dataType:       'json',

                                    success: $.trumbowyg.noembed.success || function(data){
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
                                    error: $.trumbowyg.noembed.error || function(){
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

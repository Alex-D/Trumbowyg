/* ===========================================================
 * trumbowyg.base64.js
 * Base64 plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Cyril Biencourt (lizardK)
 */

(function($){

    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                base64: "Image as base64",
                file:   "File",
                errFileReaderNotSupported: "FileReader is not supported by your browser."
            },
            fr: {
                base64: "Image en base64",
                file:   "Fichier",
                errFileReaderNotSupported: "FileReader n'est pas supporté par votre navigateur."
            }
        },

        opts: {
            btnsDef: {
                base64: {
                    func: function(params, tbw){
                        if(typeof FileReader === "undefined"){
                            alert(tbw.lang['errFileReaderNotSupported']);
                            return;
                        }
                        var file,
                            $modal = tbw.openModalInsert(
                                // Title
                                tbw.lang['base64'],

                                // Fields
                                {
                                    file: {
                                        type: 'file',
                                        required: true
                                },
                                alt: {
                                    label: 'description'
                                }
                              },

                              // Callback
                              function(values, fields){
                                  var data = new FormData(),
                                      fReader  = new FileReader();

                                  fReader.onloadend = function () {
                                      tbw.execCommand('insertImage', fReader.result);
                                      tbw.closeModal();
                                  }

                                  fReader.readAsDataURL(file);
                              }
                        );

                        $('input[type=file]').on('change', function(e){
                            file = e.target.files[0];
                        });
                    }
                }
            }
        }
    });

})(jQuery);

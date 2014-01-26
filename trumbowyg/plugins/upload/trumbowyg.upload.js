/* ===========================================================
 * trumbowyg.upload.js
 * Upload plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Alexandre Demode (Alex-D)
 *          Twitter : @AlexandreDemode
 *          Website : alex-d.fr
 */


/**
 *
 * /!\ IN DEV - NOT FUNCTIONAL /!\
 * This plugin is in developement, do not use it
 * 
 */
(function($){
    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                upload: "Upload",
                file:   "File"
            },
            fr: {
                upload: "Envoi",
                file:   "Fichier"
            }
        },

        upload: {
            serverPath: './trumbowyg/plugins/upload/trumbowyg.upload.php'
        },

        opts: {
            btnsDef: {
                insertImage: { dropdown: ['insertImage', 'upload'] },
                upload: {
                    func: function(params, tbw){
                        var files;

                        $modal = tbw.openModalInsert(
                            // Title
                            tbw.lang['upload'],

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
                                var data = new FormData();
                                $.each(files, function(key, value){
                                    data.append(key, value);
                                });

                                $.ajax({
                                    url:            $.trumbowyg.upload.serverPath,
                                    type:           'POST',
                                    data:           data,
                                    cache:          false,
                                    dataType:       'json',
                                    processData:    false,
                                    contentType:    false,

                                    success:        function(data){
                                        tbw.execCommand('insertImage', data.files[0]);
                                        tbw.closeModal();
                                    },
                                    error:          function(data){
                                        tbw.addErrorOnModalField(fields['file'], "Error");
                                    }
                                });
                            }
                        );

                        $('input[type=file]').on('change', function(e){
                            files = e.target.files;
                        });
                    }
                }
            }
        }
    });
})(jQuery);
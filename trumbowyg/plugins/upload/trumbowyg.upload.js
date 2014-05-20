/* ===========================================================
 * trumbowyg.upload.js
 * Upload plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Alexandre Demode (Alex-D)
 *          Twitter : @AlexandreDemode
 *          Website : alex-d.fr
 */

(function($){
    addXhrProgressEvent();

    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                upload: "Upload",
                file:   "File",
                uploadError: "Error"
            },
            fr: {
                upload: "Envoi",
                file:   "Fichier",
                uploadError: "Erreur"
            }
        },

        upload: {
            serverPath: './trumbowyg/plugins/upload/trumbowyg.upload.php'
        },

        opts: {
            btnsDef: {
                upload: {
                    func: function(params, tbw){
                        var file,
                            pfx = tbw.o.prefix;

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
                                data.append('fileToUpload', file);

                                if($('.' + pfx +'progress', $modal).length == 0)
                                    $('.' + pfx + 'modal-title', $modal)
                                    .after(
                                        $('<div/>', {
                                            'class': pfx +'progress'
                                        })
                                        .append(
                                            $('<div/>', {
                                                'class': pfx +'progress-bar'
                                            })
                                        )
                                    );

                                $.ajax({
                                    url:            $.trumbowyg.upload.serverPath,
                                    type:           'POST',
                                    data:           data,
                                    cache:          false,
                                    dataType:       'json',
                                    processData:    false,
                                    contentType:    false,

                                    progressUpload: function(e){
                                        $('.' + pfx + 'progress-bar').stop().animate({
                                            width: Math.round(e.loaded * 100 / e.total) + '%'
                                        }, 200);
                                    },

                                    success: function(data){
                                        if(data.message == "uploadSuccess") {
                                            data.file = data.file.substring(1).toLowerCase();
                                            tbw.execCommand('insertImage', data.file);
                                            setTimeout(function(){
                                                tbw.closeModal();
                                            }, 250);
                                        } else {
                                            tbw.addErrorOnModalField(
                                                $('input[type=file]', $modal),
                                                tbw.lang[data.message]
                                            );
                                        }
                                    },
                                    error: function(data){
                                        tbw.addErrorOnModalField(
                                            $('input[type=file]', $modal),
                                            tbw.lang['uploadError']
                                        );
                                    }
                                });
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


    function addXhrProgressEvent(){
        var originalXhr = $.ajaxSettings.xhr;

        $.ajaxSetup({
            xhr: function() {
                var req  = originalXhr(),
                    that = this;

                if(req && typeof req.upload == "object" && that.progressUpload !== undefined)
                    req.upload.addEventListener("progress", function(e){
                        that.progressUpload(e);
                    }, false);

                return req;
            }
        });
    }
})(jQuery);

/* ===========================================================
 * trumbowyg.upload.js v1.1
 * Upload plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Alexandre Demode (Alex-D)
 *          Twitter : @AlexandreDemode
 *          Website : alex-d.fr
 */

(function ($) {
    'use strict';

    function getDeep(object, propertyParts) {
        var mainProperty = propertyParts.shift(),
            otherProperties = propertyParts;

        if (object !== null) {
            if (otherProperties.length === 0) {
                return object[mainProperty];
            }

            if (typeof object === 'object') {
                return getDeep(object[mainProperty], otherProperties);
            }
        }
        return object;
    }

    addXhrProgressEvent();

    $.extend(true, $.trumbowyg, {
        langs: {
            // jshint camelcase:false
            en: {
                upload: 'Upload',
                file: 'File',
                uploadError: 'Error'
            },
            sk: {
                upload: 'Nahrať',
                file: 'Súbor',
                uploadError: 'Chyba'
            },
            fr: {
                upload: 'Envoi',
                file: 'Fichier',
                uploadError: 'Erreur'
            },
            cs: {
                upload: 'Nahrát obrázek',
                file: 'Soubor',
                uploadError: 'Chyba'
            },
            zh_cn: {
                upload: '上传',
                file: '文件',
                uploadError: '错误'
            }
        },
        // jshint camelcase:true

        opts: {
            upload: {
                serverPath: './src/plugins/upload/trumbowyg.upload.php',
                fileFieldName: 'fileToUpload',
                data: [],
                headers: {},
                xhrFields: {},
                urlPropertyName: 'file',
                statusPropertyName: 'success',
                success: undefined,
                error: undefined
            },
            btnsDef: {
                upload: {
                    fn: function (params, tbw) {
                        var file,
                            prefix = tbw.o.prefix;

                        var $modal = tbw.openModalInsert(
                            // Title
                            tbw.lang.upload,

                            // Fields
                            {
                                file: {
                                    type: 'file',
                                    required: true
                                },
                                alt: {
                                    label: 'description',
                                    value: tbw.getRangeText()
                                }
                            },

                            // Callback
                            function (values) {
                                var data = new FormData();
                                data.append(tbw.o.upload.fileFieldName, file);

                                tbw.o.upload.data.map(function (cur) {
                                    data.append(cur.name, cur.value);
                                });

                                if ($('.' + prefix + 'progress', $modal).length === 0) {
                                    $('.' + prefix + 'modal-title', $modal)
                                        .after(
                                            $('<div/>', {
                                                'class': prefix + 'progress'
                                            }).append(
                                                $('<div/>', {
                                                    'class': prefix + 'progress-bar'
                                                })
                                            )
                                        );
                                }

                                $.ajax({
                                    url: tbw.o.upload.serverPath,
                                    headers: tbw.o.upload.headers,
                                    xhrFields: tbw.o.upload.xhrFields,
                                    type: 'POST',
                                    data: data,
                                    cache: false,
                                    dataType: 'json',
                                    processData: false,
                                    contentType: false,

                                    progressUpload: function (e) {
                                        $('.' + prefix + 'progress-bar').stop().animate({
                                            width: Math.round(e.loaded * 100 / e.total) + '%'
                                        }, 200);
                                    },

                                    success: tbw.o.upload.success || function (data) {
                                        if (!!getDeep(data, tbw.o.upload.statusPropertyName.split('.'))) {
                                            var url = getDeep(data, tbw.o.upload.urlPropertyName.split('.'));
                                            tbw.execCmd('insertImage', url);
                                            $('img[src="' + url + '"]:not([alt])', tbw.$box).attr('alt', values.alt);
                                            setTimeout(function () {
                                                tbw.closeModal();
                                            }, 250);
                                        } else {
                                            tbw.addErrorOnModalField(
                                                $('input[type=file]', $modal),
                                                tbw.lang[data.message]
                                            );
                                        }
                                    },
                                    error: tbw.o.upload.error || function () {
                                        tbw.addErrorOnModalField(
                                            $('input[type=file]', $modal),
                                            tbw.lang.uploadError
                                        );
                                    }
                                });
                            }
                        );

                        $('input[type=file]').on('change', function (e) {
                            try {
                                // If multiple files allowed, we just get the first.
                                file = e.target.files[0];
                            } catch (err) {
                                // In IE8, multiple files not allowed
                                file = e.target.value;
                            }
                        });
                    }
                }
            }
        }
    });


    function addXhrProgressEvent() {
        if (!$.trumbowyg && !$.trumbowyg.addedXhrProgressEvent) {   // Avoid adding progress event multiple times
            var originalXhr = $.ajaxSettings.xhr;
            $.ajaxSetup({
                xhr: function () {
                    var req = originalXhr(),
                        that = this;
                    if (req && typeof req.upload === 'object' && that.progressUpload !== undefined) {
                        req.upload.addEventListener('progress', function (e) {
                            that.progressUpload(e);
                        }, false);
                    }

                    return req;
                }
            });
            $.trumbowyg.addedXhrProgressEvent = true;
        }
    }
})(jQuery);

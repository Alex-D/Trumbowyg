/* ===========================================================
 * trumbowyg.upload.js v1.2
 * Upload plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Alexandre Demode (Alex-D)
 *          Twitter : @AlexandreDemode
 *          Website : alex-d.fr
 * Mod by : Aleksandr-ru
 *          Twitter : @Aleksandr_ru
 *          Website : aleksandr.ru
 */

(function ($) {
    'use strict';

    var defaultOptions = {
        serverPath: '',
        fileFieldName: 'fileToUpload',
        data: [],                       // Additional data for ajax [{name: 'key', value: 'value'}]
        headers: {},                    // Additional headers
        xhrFields: {},                  // Additional fields
        urlPropertyName: 'file',        // How to get url from the json response (for instance 'url' for {url: ....})
        statusPropertyName: 'success',  // How to get status from the json response
        success: undefined,             // Success callback: function (data, trumbowyg, $modal, values) {}
        error: undefined,               // Error callback: function () {}
        imageWidthModalEdit: false      // Add ability to edit image width
    };

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

    function runXhrRequest(url, data, options) {
        var xhrRequest = new XMLHttpRequest();
        xhrRequest.open(
            'POST',
            url,
            true
        );

        // Set Headers
        Object.keys(options.headers).forEach((headerKey) => {
            xhrRequest.setRequestHeader(headerKey, options.headers[headerKey]);
        });

        // Set XHR fields
        Object.keys(options.xhrFields).forEach((xhrFieldKey) => {
            xhrRequest[xhrFieldKey] = options.headers[xhrFieldKey];
        });

        // Progress
        xhrRequest.upload.addEventListener('progress', function (e) {
            options.progress(e);
        }, false);

        // Success
        xhrRequest.onreadystatechange = function() {
            if (xhrRequest.readyState !== 4) {
                return;
            }

            if ((xhrRequest.status < 200 || xhrRequest.status >= 300) && xhrRequest.status !== 304) {
                options.error();
                xhrRequest = null;
                return;
            }

            var jsonResponse = JSON.parse(xhrRequest.responseText);
            options.success(jsonResponse);

            xhrRequest = null;
        };

        xhrRequest.send(data);
    }

    $.extend(true, $.trumbowyg, {
        langs: {
            // jshint camelcase:false
            en: {
                upload: 'Upload',
                file: 'File',
                uploadError: 'Error'
            },
            az: {
                upload: 'Yüklə',
                file: 'Fayl',
                uploadError: 'Xəta'
            },
            by: {
                upload: 'Загрузка',
                file: 'Файл',
                uploadError: 'Памылка'
            },
            ca: {
                upload: 'Pujar fitxer',
                file: 'Fitxer',
                uploadError: 'Error'
            },
            cs: {
                upload: 'Nahrát obrázek',
                file: 'Soubor',
                uploadError: 'Chyba'
            },
            da: {
                upload: 'Upload',
                file: 'Fil',
                uploadError: 'Fejl'
            },
            de: {
                upload: 'Hochladen',
                file: 'Datei',
                uploadError: 'Fehler'
            },
            es: {
                upload: 'Subir archivo',
                file: 'Archivo',
                uploadError: 'Error'
            },
            et: {
                upload: 'Lae üles',
                file: 'Fail',
                uploadError: 'Viga'
            },
            fr: {
                upload: 'Envoi',
                file: 'Fichier',
                uploadError: 'Erreur'
            },
            hu: {
                upload: 'Feltöltés',
                file: 'Fájl',
                uploadError: 'Hiba'
            },
            ja: {
                upload: 'アップロード',
                file: 'ファイル',
                uploadError: 'エラー'
            },
            ko: {
                upload: '그림 올리기',
                file: '파일',
                uploadError: '에러'
            },
            pt_br: {
                upload: 'Enviar do local',
                file: 'Arquivo',
                uploadError: 'Erro'
            },
            ru: {
                upload: 'Загрузка',
                file: 'Файл',
                uploadError: 'Ошибка'
            },
            sl: {
                upload: 'Naloži datoteko',
                file: 'Datoteka',
                uploadError: 'Napaka'
            },
            sk: {
                upload: 'Nahrať',
                file: 'Súbor',
                uploadError: 'Chyba'
            },
            tr: {
                upload: 'Yükle',
                file: 'Dosya',
                uploadError: 'Hata'
            },
            zh_cn: {
                upload: '上传',
                file: '文件',
                uploadError: '错误'
            },
            zh_tw: {
                upload: '上傳',
                file: '文件',
                uploadError: '錯誤'
            },
        },
        // jshint camelcase:true

        plugins: {
            upload: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.upload = $.extend(true, {}, defaultOptions, trumbowyg.o.plugins.upload || {});
                    var btnDef = {
                        fn: function () {
                            trumbowyg.saveRange();

                            var file,
                                prefix = trumbowyg.o.prefix;

                            var fields = {
                                file: {
                                    type: 'file',
                                    required: true,
                                    attributes: {
                                        accept: 'image/*'
                                    }
                                },
                                alt: {
                                    label: 'description',
                                    value: trumbowyg.getRangeText()
                                }
                            };

                            if (trumbowyg.o.plugins.upload.imageWidthModalEdit) {
                                fields.width = {
                                    value: ''
                                };
                            }

                            // Prevent multiple submissions while uploading
                            var isUploading = false;

                            var $modal = trumbowyg.openModalInsert(
                                // Title
                                trumbowyg.lang.upload,

                                // Fields
                                fields,

                                // Callback
                                function (values) {
                                    const uploadPluginOptions = trumbowyg.o.plugins.upload;

                                    if (isUploading) {
                                        return;
                                    }
                                    isUploading = true;

                                    var data = new FormData();
                                    data.append(uploadPluginOptions.fileFieldName, file);

                                    uploadPluginOptions.data.map(function (cur) {
                                        data.append(cur.name, cur.value);
                                    });

                                    $.map(values, function (curr, key) {
                                        if (key !== 'file') {
                                            data.append(key, curr);
                                        }
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

                                    runXhrRequest(
                                        uploadPluginOptions.serverPath,
                                        data,
                                        {
                                            headers: uploadPluginOptions.headers,
                                            xhrFields: uploadPluginOptions.xhrFields,

                                            progress: function (e) {
                                                $('.' + prefix + 'progress-bar').css('width', Math.round(e.loaded * 100 / e.total) + '%');
                                            },

                                            success: function (data) {
                                                isUploading = false;

                                                if (uploadPluginOptions.success) {
                                                    uploadPluginOptions.success(data, trumbowyg, $modal, values);
                                                    return;
                                                }

                                                if (!getDeep(data, uploadPluginOptions.statusPropertyName.split('.'))) {
                                                    trumbowyg.addErrorOnModalField(
                                                        $('input[type=file]', $modal),
                                                        trumbowyg.lang[data.message]
                                                    );
                                                    trumbowyg.$c.trigger('tbwuploaderror', [trumbowyg, data]);
                                                    return;
                                                }

                                                var url = getDeep(data, uploadPluginOptions.urlPropertyName.split('.'));
                                                trumbowyg.execCmd('insertImage', url, false, true);
                                                var $img = $('img[src="' + url + '"]:not([alt])', trumbowyg.$box);
                                                $img.attr('alt', values.alt);
                                                if (uploadPluginOptions.imageWidthModalEdit && parseInt(values.width) > 0) {
                                                    $img.attr({
                                                        width: values.width
                                                    });
                                                }
                                                setTimeout(function () {
                                                    trumbowyg.closeModal();
                                                }, 250);
                                                trumbowyg.$c.trigger('tbwuploadsuccess', [trumbowyg, data, url]);
                                            },

                                            error: uploadPluginOptions.error || function () {
                                                trumbowyg.addErrorOnModalField(
                                                    $('input[type=file]', $modal),
                                                    trumbowyg.lang.uploadError
                                                );
                                                trumbowyg.$c.trigger('tbwuploaderror', [trumbowyg]);

                                                isUploading = false;
                                            }
                                        }
                                    );
                                }
                            );

                            $('input[type=file]').on('change', function (e) {
                                // We just get the first.
                                file = e.target.files[0];
                            });
                        }
                    };

                    trumbowyg.addBtnDef('upload', btnDef);
                }
            }
        }
    });
})(jQuery);

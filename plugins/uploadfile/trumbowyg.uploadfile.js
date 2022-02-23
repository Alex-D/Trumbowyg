/* ===========================================================
 * trumbowyg.uploadfile.js v1
 * Upload file plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Alexandre Demode (Alex-D)
 *          Twitter : @AlexandreDemode
 *          Website : alex-d.fr
 * Mod by : Humam Abdullah (humam-abd)
 *          Twitter : @HAbd_Ind
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

  addXhrProgressEvent();

  $.extend(true, $.trumbowyg, {
    langs: {
      // jshint camelcase:false
      en: {
        upload: 'Upload',
        file: 'File',
        uploadError: 'Error',
      },
      cs: {
        upload: 'Nahrát obrázek',
        file: 'Soubor',
        uploadError: 'Chyba',
      },
      da: {
        upload: 'Upload',
        file: 'Fil',
        uploadError: 'Fejl',
      },
      de: {
        upload: 'Hochladen',
        file: 'Datei',
        uploadError: 'Fehler',
      },
      et: {
        upload: 'Lae üles',
        file: 'Fail',
        uploadError: 'Viga',
      },
      fr: {
        upload: 'Envoi',
        file: 'Fichier',
        uploadError: 'Erreur',
      },
      hu: {
        upload: 'Feltöltés',
        file: 'Fájl',
        uploadError: 'Hiba',
      },
      ja: {
        upload: 'アップロード',
        file: 'ファイル',
        uploadError: 'エラー',
      },
      ko: {
        upload: '그림 올리기',
        file: '파일',
        uploadError: '에러',
      },
      pt_br: {
        upload: 'Enviar do local',
        file: 'Arquivo',
        uploadError: 'Erro',
      },
      ru: {
        upload: 'Загрузка',
        file: 'Файл',
        uploadError: 'Ошибка',
      },
      sk: {
        upload: 'Nahrať',
        file: 'Súbor',
        uploadError: 'Chyba',
      },
      tr: {
        upload: 'Yükle',
        file: 'Dosya',
        uploadError: 'Hata',
      },
      zh_cn: {
        upload: '上传',
        file: '文件',
        uploadError: '错误',
      },
      zh_tw: {
        upload: '上傳',
        file: '文件',
        uploadError: '錯誤',
      },
    },
    // jshint camelcase:true

    plugins: {
      uploadfile: {
        init: function (trumbowyg) {
          trumbowyg.o.plugins.uploadfile = $.extend(
            true,
            {},
            defaultOptions,
            trumbowyg.o.plugins.uploadfile || {}
          );
          var btnDef = {
            fn: function () {
              trumbowyg.saveRange();

              var file,
                prefix = trumbowyg.o.prefix;

              var fields = {
                file: {
                  type: 'file',
                  required: true,
                },
                text: {
                  label: 'text',
                  value: trumbowyg.getRangeText(),
                },
              };
           
              // Prevent multiple submissions while uploading
              var isUploading = false;

              var $modal = trumbowyg.openModalInsert(
                // Title
                trumbowyg.lang.upload,

                // Fields
                fields,

                // Callback
                function (values) {
                  if (isUploading) return;
                  isUploading = true;

                  var data = new FormData();
                  data.append(
                    trumbowyg.o.plugins.uploadfile.fileFieldName,
                    file
                  );

                  trumbowyg.o.plugins.uploadfile.data.map(function (cur) {
                    return data.append(cur.name, cur.value);
                  });

                  $.map(values, function (curr, key) {
                    if (key !== 'file') data.append(key, curr);
                  });

                  if ($('.' + prefix + 'progress', $modal).length === 0) {
                    $('.' + prefix + 'modal-title', $modal).after(
                      $('<div/>', {
                        class: prefix + 'progress',
                      }).append(
                        $('<div/>', {
                          class: prefix + 'progress-bar',
                        })
                      )
                    );
                  }

                  $.ajax({
                    url: trumbowyg.o.plugins.uploadfile.serverPath,
                    headers: trumbowyg.o.plugins.uploadfile.headers,
                    xhrFields: trumbowyg.o.plugins.uploadfile.xhrFields,
                    type: 'POST',
                    data: data,
                    cache: false,
                    dataType: 'json',
                    processData: false,
                    contentType: false,

                    progressUpload: function (e) {
                      $('.' + prefix + 'progress-bar').css(
                        'width',
                        Math.round((e.loaded * 100) / e.total) + '%'
                      );
                    },

                    success: function (data) {
                      if (trumbowyg.o.plugins.uploadfile.success) {
                        trumbowyg.o.plugins.uploadfile.success(
                          data,
                          trumbowyg,
                          $modal,
                          values
                        );
                      } else {
                        if (!!(getDeep(data, trumbowyg.o.plugins.uploadfile.statusPropertyName.split('.')))) {
                          var url = getDeep(data, trumbowyg.o.plugins.uploadfile.urlPropertyName.split('.'));

                          var link = $(
                            [
                              '<a href="',
                              url,
                              '">',
                              values.text || url,
                              '</a>',
                            ].join('')
                          );

                          trumbowyg.range.deleteContents();
                          trumbowyg.range.insertNode(link[0]);
                          trumbowyg.syncCode();
                          trumbowyg.$c.trigger('tbwchange');

                          setTimeout(function () {
                            trumbowyg.closeModal();
                          }, 250);

                          trumbowyg.$c.trigger('tbwuploadfilesuccess', [trumbowyg, data, url]);
                        } else {
                          trumbowyg.addErrorOnModalField(
                            $('input[type=file]', $modal),
                            trumbowyg.lang[data.message]
                          );
                          trumbowyg.$c.trigger('tbwuploadfileerror', [
                            trumbowyg,
                            data,
                          ]);
                        }
                      }
                      
                      isUploading = false;
                    },

                    error:
                      trumbowyg.o.plugins.uploadfile.error ||
                      function () {
                        trumbowyg.addErrorOnModalField(
                          $('input[type=file]', $modal),
                          trumbowyg.lang.uploadError
                        );
                        trumbowyg.$c.trigger('tbwuploadfileerror', [trumbowyg]);

                        isUploading = false;
                      },
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
            },
            ico: 'upload',
            text: 'Upload File',
          };

          trumbowyg.addBtnDef('uploadfile', btnDef);
        },
      },
    },
  });

  function addXhrProgressEvent() {
    if (!$.trumbowyg.addedXhrProgressEvent) {
      // Avoid adding progress event multiple times
      var originalXhr = $.ajaxSetup.xhr;
      $.ajaxSetup({
        xhr: function () {
          var that = this,
            req = originalXhr();

          if (
            req &&
            typeof req.uploadfile === 'object' &&
            that.progressUpload !== undefined
          ) {
            req.uploadfile.addEventListener(
              'progress',
              function (e) {
                that.progressUpload(e);
              },
              false
            );
          }
          return req;
        },
      });
      $.trumbowyg.addedXhrProgressEvent = true;
    }
  }
})(jQuery);

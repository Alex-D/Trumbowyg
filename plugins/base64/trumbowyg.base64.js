/* ===========================================================
 * trumbowyg.base64.js v1.0
 * Base64 plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Cyril Biencourt (lizardK)
 */

(function ($) {
    'use strict';

    var isSupported = function () {
        return typeof FileReader !== 'undefined';
    };

    var isValidImage = function (type) {
        return /^data:image\/[a-z]?/i.test(type);
    };

    var defaultOptions = {
        maxFileSize: 0
    };

    $.extend(true, $.trumbowyg, {
        langs: {
            // jshint camelcase:false
            en: {
                base64: 'Image as base64',
                file: 'File',
                errFileReaderNotSupported: 'FileReader is not supported by your browser.',
                errInvalidImage: 'Invalid image file.',
                errFileTooLarge: 'Image file is too large.'
            },
            az: {
                base64: 'base64 olaraq şəkil',
                file: 'Fayl',
                errFileReaderNotSupported: 'FileReader brauzeriniz tərəfindən dəstəklənmir.',
                errInvalidImage: 'Yanlış şəkil faylı.',
                errFileTooLarge: 'Şəkil faylı çox böyükdür.'
            },
            by: {
                base64: 'Выява (фармат base64)',
                file: 'Файл',
                errFileReaderNotSupported: 'FileReader не падтрымліваецца вашым браўзэрам.',
                errInvalidImage: 'Несапраўдны файл выявы.',
                errFileTooLarge: 'Файл выявы занадта вялікі.'
            },
            cs: {
                base64: 'Vložit obrázek',
                file: 'Soubor'
            },
            da: {
                base64: 'Billede som base64',
                file: 'Fil',
                errFileReaderNotSupported: 'FileReader er ikke understøttet af din browser.',
                errInvalidImage: 'Ugyldig billedfil.',
                errFileTooLarge: 'Billedfilen er for stor.'
            },
            de: {
                base64: 'Bild als base64',
                file: 'Datei',
                errFileReaderNotSupported: 'FileReader ist nicht in deinem Browser unterstützt.',
                errInvalidImage: 'Ungültige Bilddatei.',
                errFileTooLarge: 'Bilddatei ist zu groß.'
            },
            et: {
                base64: 'Pilt base64 formaadis',
                file: 'Fail',
                errFileReaderNotSupported: 'Teie veebilehitseja ei toeta FileReader funktsiooni.',
                errInvalidImage: 'Vigane pildifail.',
                errFileTooLarge: 'Pildifail on liiga suur.'
            },
            fr: {
                base64: 'Image en base64',
                file: 'Fichier',
                errFileReaderNotSupported: 'FileReader n\'est pas supporté par votre navigateur.',
                errInvalidImage: 'Fichier image invalide.',
                errFileTooLarge: 'Le fichier image est trop volumineux.'
            },
            hu: {
                base64: 'Kép beszúrás inline',
                file: 'Fájl',
                errFileReaderNotSupported: 'Ez a böngésző nem támogatja a FileReader funkciót.',
                errInvalidImage: 'Érvénytelen képfájl.',
                errFileTooLarge: 'A képfájl túl nagy.'
            },
            ja: {
                base64: '画像 (Base64形式)',
                file: 'ファイル',
                errFileReaderNotSupported: 'あなたのブラウザーはFileReaderをサポートしていません',
                errInvalidImage: '画像形式が正しくありません',
                errFileTooLarge: '画像ファイルが大きすぎます'
            },
            ko: {
                base64: '그림 넣기(base64)',
                file: '파일',
                errFileReaderNotSupported: 'FileReader가 현재 브라우저를 지원하지 않습니다.',
                errInvalidImage: '유효하지 않은 파일',
                errFileTooLarge: '이미지 파일이 너무 큽니다.'
            },
            nl: {
                base64: 'Afbeelding inline',
                file: 'Bestand',
                errFileReaderNotSupported: 'Uw browser ondersteunt deze functionaliteit niet.',
                errInvalidImage: 'De gekozen afbeelding is ongeldig.',
                errFileTooLarge: 'Het afbeeldingsbestand is te groot.'
            },
            pt_br: {
                base64: 'Imagem em base64',
                file: 'Arquivo',
                errFileReaderNotSupported: 'FileReader não é suportado pelo seu navegador.',
                errInvalidImage: 'Arquivo de imagem inválido.',
                errFileTooLarge: 'O arquivo de imagem é muito grande.'
            },
            ru: {
                base64: 'Изображение как код в base64',
                file: 'Файл',
                errFileReaderNotSupported: 'FileReader не поддерживается вашим браузером.',
                errInvalidImage: 'Недопустимый файл изображения.',
                errFileTooLarge: 'Файл изображения слишком большой.'
            },
            sl: {
                base64: 'Slika kot base64',
                file: 'Datoteka',
                errFileReaderNotSupported: 'FileReader ni podprt v tem brskalniku.',
                errInvalidImage: 'Neveljavna datoteka s sliko.',
                errFileTooLarge: 'Slikovna datoteka je prevelika.'
            },
            tr: {
                base64: 'Base64 olarak resim',
                file: 'Dosya',
                errFileReaderNotSupported: 'FileReader tarayıcınız tarafından desteklenmiyor.',
                errInvalidImage: 'Geçersiz resim dosyası.',
                errFileTooLarge: 'Resim dosyası çok büyük.'
            },
            zh_cn: {
                base64: '图片（Base64编码）',
                file: '文件'
            },
            zh_tw: {
                base64: '圖片(base64編碼)',
                file: '檔案',
                errFileReaderNotSupported: '你的瀏覽器不支援FileReader',
                errInvalidImage: '不正確的檔案格式',
                errFileTooLarge: '圖片檔案過大'
            },
        },
        // jshint camelcase:true

        plugins: {
            base64: {
                shouldInit: isSupported,
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.base64 = $.extend({},
                        defaultOptions,
                        trumbowyg.o.plugins.base64 || {}
                    );

                    var btnDef = {
                        isSupported: isSupported,
                        fn: function () {
                            trumbowyg.saveRange();

                            var file;
                            var $modal = trumbowyg.openModalInsert(
                                // Title
                                trumbowyg.lang.base64,

                                // Fields
                                {
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
                                },

                                // Callback
                                function (values) {
                                    // Validate file size
                                    var maxFileSize = trumbowyg.o.plugins.base64.maxFileSize;
                                    if (maxFileSize > 0 && file.size > maxFileSize) {
                                        trumbowyg.addErrorOnModalField(
                                            $('input[type=file]', $modal),
                                            trumbowyg.lang.errFileTooLarge
                                        );
                                        return;
                                    }

                                    var fReader = new FileReader();

                                    fReader.onloadend = function (e) {
                                        if (isValidImage(e.target.result)) {
                                            trumbowyg.execCmd('insertImage', fReader.result, false, true);
                                            $(['img[src="', fReader.result, '"]:not([alt])'].join(''), trumbowyg.$box).attr('alt', values.alt);
                                            trumbowyg.syncCode();
                                            trumbowyg.closeModal();
                                        } else {
                                            trumbowyg.addErrorOnModalField(
                                                $('input[type=file]', $modal),
                                                trumbowyg.lang.errInvalidImage
                                            );
                                        }
                                    };

                                    fReader.readAsDataURL(file);
                                }
                            );

                            $('input[type=file]').on('change', function (e) {
                                file = e.target.files[0];
                            });
                        }
                    };

                    trumbowyg.addBtnDef('base64', btnDef);
                }
            }
        }
    });
})(jQuery);

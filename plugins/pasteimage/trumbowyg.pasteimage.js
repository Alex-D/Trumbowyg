/* ===========================================================
 * trumbowyg.pasteimage.js v1.1
 * Basic base64 paste plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Alexandre Demode (Alex-D)
 *          Twitter : @AlexandreDemode
 *          Website : alex-d.fr
 */

(function ($) {
    'use strict';

    var defaultOptions = {
        maxFileSize: 0,                     // Maximum image size, in bytes. 0 means unlimited.

        // Compression of images which are too large.
        // When enabled, an image bigger than maxFileSize, maxWidth or maxHeight is
        // downscaled and re-encoded through a canvas instead of being ignored.
        compress: false,
        maxWidth: 0,                        // Maximum image width, in px. 0 means unlimited.
        maxHeight: 0,                       // Maximum image height, in px. 0 means unlimited.
        mimeType: 'image/jpeg',             // Output type: 'image/jpeg' or 'image/webp' (falls back to JPEG when unsupported)
        quality: 0.8,                       // Starting quality, between 0 and 1
        minQuality: 0.5,                    // Quality floor, dimensions are reduced below it
        maxInputFileSize: 25 * 1024 * 1024, // Images bigger than this, in bytes, are not even decoded. 0 means unlimited.
        onError: undefined                  // Called when an image can't be pasted: function (message, file) {}
    };

    $.extend(true, $.trumbowyg, {
        langs: {
            // jshint camelcase:false
            en: {
                pasteImageTooLarge: 'This image is too large, even after compression. Please use a smaller image.',
                pasteImageUnreadable: 'This image could not be read.'
            },
            fr: {
                pasteImageTooLarge: 'Cette image est trop lourde, même après compression. Merci d\'utiliser une image plus petite.',
                pasteImageUnreadable: 'Cette image n\'a pas pu être lue.'
            }
        }
    });

    var encoderSupport = {};

    function canEncode(mimeType) {
        if (!(mimeType in encoderSupport)) {
            var canvas = document.createElement('canvas');
            canvas.width = canvas.height = 1;
            // Browsers which can't encode a type silently return a PNG instead
            encoderSupport[mimeType] = canvas.toDataURL(mimeType).indexOf('data:' + mimeType) === 0;
        }
        return encoderSupport[mimeType];
    }

    function dataUrlBytes(dataUrl) {
        var commaIndex = dataUrl.indexOf(','),
            payloadLength = dataUrl.length - commaIndex - 1,
            isBase64 = dataUrl.slice(0, commaIndex).indexOf(';base64') !== -1;

        return isBase64 ? Math.floor(payloadLength * 3 / 4) : payloadLength;
    }

    function fitsFileSize(bytes, options) {
        return !options.maxFileSize || bytes <= options.maxFileSize;
    }

    function fitsDimensions(img, options) {
        return (!options.maxWidth || img.naturalWidth <= options.maxWidth) &&
            (!options.maxHeight || img.naturalHeight <= options.maxHeight);
    }

    function readAsDataUrl(file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function (event) {
                resolve(event.target.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function loadImage(file) {
        return new Promise(function (resolve, reject) {
            var url = URL.createObjectURL(file),
                img = new Image();

            img.onload = function () {
                URL.revokeObjectURL(url);
                if (img.naturalWidth && img.naturalHeight) {
                    resolve(img);
                } else {
                    reject();
                }
            };
            img.onerror = function () {
                URL.revokeObjectURL(url);
                reject();
            };
            img.src = url;
        });
    }

    // Re-encode the image, lowering the quality first and then the dimensions, until it fits maxFileSize.
    // Returns null when it still doesn't fit.
    function encode(img, options) {
        var mimeType = canEncode(options.mimeType) ? options.mimeType : 'image/jpeg',
            scale = Math.min(
                1,
                options.maxWidth ? options.maxWidth / img.naturalWidth : 1,
                options.maxHeight ? options.maxHeight / img.naturalHeight : 1
            ),
            quality = options.quality,
            canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            dataUrl;

        for (var attempt = 0; attempt < 10; attempt += 1) {
            // Resizing the canvas also clears it
            canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
            canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
            if (mimeType === 'image/jpeg') {
                // JPEG has no alpha channel: paint transparent areas in white instead of black
                context.fillStyle = '#fff';
                context.fillRect(0, 0, canvas.width, canvas.height);
            }
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            dataUrl = canvas.toDataURL(mimeType, quality);

            if (fitsFileSize(dataUrlBytes(dataUrl), options)) {
                return dataUrl;
            }
            if (quality - 0.1 >= options.minQuality) {
                quality -= 0.1;
            } else {
                scale *= 0.8;
            }
        }

        return null;
    }

    // Resolves with the data URL to insert, compressed only when the image is too large
    function compress(file, options, lang) {
        if (options.maxInputFileSize > 0 && file.size > options.maxInputFileSize) {
            return Promise.reject(new Error(lang.pasteImageTooLarge));
        }

        return loadImage(file).then(function (img) {
            if (fitsFileSize(file.size, options) && fitsDimensions(img, options)) {
                return readAsDataUrl(file);
            }

            var dataUrl = encode(img, options);
            if (dataUrl === null) {
                throw new Error(lang.pasteImageTooLarge);
            }
            return dataUrl;
        }, function () {
            throw new Error(lang.pasteImageUnreadable);
        });
    }

    $.extend(true, $.trumbowyg, {
        plugins: {
            pasteImage: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.pasteImage = $.extend({},
                        defaultOptions,
                        trumbowyg.o.plugins.pasteImage || {}
                    );

                    var options = trumbowyg.o.plugins.pasteImage;

                    function insertImage(dataUrl) {
                        trumbowyg.execCmd('insertImage', dataUrl, false, true);
                    }

                    function reportError(file) {
                        return function (error) {
                            if (typeof options.onError === 'function') {
                                options.onError(error && error.message ? error.message : String(error), file);
                            }
                        };
                    }

                    trumbowyg.pasteHandlers.push(function (pasteEvent) {
                        try {
                            var items = (pasteEvent.originalEvent || pasteEvent).clipboardData.items,
                                files = [],
                                file;

                            for (var i = items.length - 1; i >= 0; i -= 1) {
                                if (items[i].type.match(/^image\//)) {
                                    file = items[i].getAsFile();

                                    // Validate file size, unless too large images get compressed
                                    if (!options.compress && !fitsFileSize(file.size, options)) {
                                        continue;
                                    }

                                    files.push(file);
                                }
                            }

                            if (files.length === 0) {
                                return;
                            }

                            pasteEvent.stopPropagation();
                            pasteEvent.preventDefault();

                            if (!options.compress) {
                                files.forEach(function (file) {
                                    readAsDataUrl(file).then(insertImage, reportError(file));
                                });
                                return;
                            }

                            // Compression takes a while: keep the caret position in case the focus moves meanwhile
                            trumbowyg.saveRange();
                            var isFirstImage = true;

                            // Compress the images one after another, to insert them in order
                            files.reduce(function (chain, file) {
                                return chain.then(function () {
                                    return compress(file, options, trumbowyg.lang)
                                        .then(function (dataUrl) {
                                            if (isFirstImage) {
                                                trumbowyg.restoreRange();
                                                isFirstImage = false;
                                            }
                                            insertImage(dataUrl);
                                        }, reportError(file));
                                });
                            }, Promise.resolve());
                        } catch (c) {
                        }
                    });
                }
            }
        }
    });
})(jQuery);

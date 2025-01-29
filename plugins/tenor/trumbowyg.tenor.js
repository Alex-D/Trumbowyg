// adapted from giphy plugin
/* global AbortController: true */
(function ($) {
    'use strict';

    $.extend(true, $.trumbowyg, {
        langs: {
            // jshint camelcase:false
            en: {
                tenor: 'Insert GIF'
            },
            az: {
                tenor: 'GIF yerləşdir'
            },
            by: {
                tenor: 'Уставіць GIF'
            },
            de: {
                tenor: 'GIF einfügen'
            },
            et: {
                tenor: 'Sisesta GIF'
            },
            fr: {
                tenor: 'Insérer un GIF'
            },
            hu: {
                tenor: 'GIF beszúrás'
            },
            ru: {
                tenor: 'Вставить GIF'
            },
            sl: {
                tenor: 'Vstavi GIF'
            },
            tr: {
                tenor: 'GIF ekle'
            }
            // jshint camelcase:true
        }
    });

    var tenorLogo = '<svg viewBox="0 0 1584 447" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><path d="M314.8 295.7c2.4 18 7.6 34.1 16.8 48.6 21.6 34.1 53 50.3 93.2 50 33-.2 61.3-12.2 85.7-34.2 12.8-11.6 30.8-9.4 39.8 4.5 6.5 10 5.2 22.1-3.8 31.1-27.3 27.3-59.8 44.3-98.3 49-25.2 3.1-50.3 2.5-74.8-5.1-55.8-17.3-92.9-54.3-109.4-109.9-19.3-65.3-9-126 36.5-178.2 30.9-35.3 70.9-52.1 118-51.3 40.6.7 76 14.5 104.5 44 23.7 24.5 36.8 54.4 42.8 87.6 2.3 12.6 3.3 25.4 3.9 38.2.7 14.1-10.3 25.1-24.4 25.8-2 .1-4 0-6 0H321.9c-2-.1-4.1-.1-7.1-.1zM510 245.4c-1.5-13-5.2-25-10.1-36.7-29.2-68.7-105.1-70.5-144.1-37-20.5 17.6-32.6 40.1-38.6 66.1-.6 2.4-.8 4.8-1.3 7.6H510zM970.4 271.3c.1-88.4 68.6-171.5 173.4-171.3 97.7.1 172.6 75.8 172.4 174.2-.2 96.7-76.6 172.1-174.5 172.2-94.3 0-171.5-78.8-171.3-175.1zm286.6 4.6c-.5-34.3-10.4-62.9-32.1-87.1-44.3-49.5-125.2-47.6-167.7 3.4-35.4 42.5-37.9 117.5 3.2 163.7 36.6 41.2 102.4 49.7 147.2 17.7 34.1-24.4 48.4-58.9 49.4-97.7zM683.5 148.6c6.3-6 11.4-11.1 16.7-15.9 25.6-23.4 56.2-33 90.3-32.7 26.9.3 52.2 6.3 74.6 21.9 27.8 19.4 42.9 46.9 48.8 79.6 1.9 10.6 2.9 21.5 3 32.3.3 61.2.1 122.3.1 183.5 0 11.7-7.4 22.8-18.3 26.8-11.4 4.2-22.1 2.5-30.9-6.3-6.2-6.1-8.9-13.8-8.9-22.6.1-56.7.3-113.3-.2-170-.1-11.2-1.7-22.7-4.4-33.5-8.5-33.1-32.2-53.2-66.1-57.1-24.1-2.8-47 1-67.1 15.6-26.7 19.4-37.4 47-37.5 79-.2 55.8 0 111.7-.1 167.5 0 21.4-20.8 35.3-40.6 27.2-10.5-4.3-17.6-15.7-17.6-28.5v-286c0-11.3 5.2-19.9 14.8-25.5 9.9-5.8 20.2-5.5 29.9.6 8.3 5.3 13.3 13 13.5 23.2.1 6.6 0 13 0 20.9zM124.9 106.8h78.5c10.8 0 19.6 3.5 25.2 13.2 9.3 16.3-.2 36-18.8 38.8-2.9.4-6 .5-9 .5h-75.9v184.1c0 12 1.9 23.5 10 33.3 6.6 8 15.5 11.4 25.2 12.9 14.5 2.3 28.9 1.1 43-3.3 13.4-4.3 26.6 1.7 31.1 14.2 4.6 12.7-1.9 25.2-14.3 31.2-16.8 8.2-34.4 11.8-53 12.8-48.2 2.4-91.5-32.6-98.8-80.4-1-6.2-1.3-12.6-1.3-18.9-.1-59.5-.1-119-.1-178.5v-6.9c-2.2-.1-4-.3-5.7-.3-11 0-22 .2-33-.1-18-.5-29.6-14-26.9-31 1.9-12 12.8-21 26.5-21.4 10.8-.3 21.7-.1 32.5-.1 6.6 0 6.6 0 6.6-6.9V30.5c0-17 12.3-30 28.7-30.2 16.4-.2 29.3 12.9 29.4 30.1.1 23.3 0 46.7 0 70 .1 1.9.1 3.9.1 6.4zM1432.4 170.1c8.6-9.8 16.2-19.5 25-28.1 20.1-19.6 43.7-33.3 71.5-38.8 8.4-1.7 17.2-2.1 25.8-1.7 16.3.9 28.5 14.5 28.5 30.5 0 15.8-12.4 29.2-28.5 30.7-11.9 1.1-24 1.3-35.7 3.8-32.1 6.9-54.8 26.3-69.4 55.4-12.8 25.4-17.1 52.8-17.2 80.9-.2 37.5 0 75 0 112.5 0 17.4-12.8 30.9-29.3 30.8-16.6-.1-29.1-13-29.1-30.4V128.8c0-13 9.2-24.8 21.6-27.9 13.6-3.4 26.8 2.2 32.7 14.7 2.3 4.8 3.6 10.4 3.8 15.8.6 11.1.2 22.3.2 33.5.1 1.7.1 3.3.1 5.2z"/></g></svg>'; // jshint ignore:line

    var CANCEL_EVENT = 'tbwcancel';
    var nextCursor = null;

    // Throttle helper
    function trumbowygThrottle(callback, delay) {
        var last;
        var timer;

        return function () {
            var context = this;
            var now = new Date().getTime();
            var args = arguments;

            if (last && now < last + delay) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    last = now;
                    callback.apply(context, args);
                }, delay);
            } else {
                last = now;
                callback.apply(context, args);
            }
        };
    }

    function registerGifClickEventInModal(trumbowyg, $tenorModal) {
        $tenorModal.on('click', 'img', function () {
            var src = $(this).attr('data-full'),
                alt = $(this).attr('alt');
            trumbowyg.restoreRange();
            trumbowyg.execCmd('insertImage', src, false, true);

            // relay alt tag into inserted image
            if (alt) {
                var $img = $('img[src="' + src + '"]:not([alt])', trumbowyg.$box);
                $img.attr('alt', alt);
                // Note: This seems to fire relatively early and could be wrapped in a setTimeout if needed
                trumbowyg.syncCode();
            }
            $tenorModal.off('click', 'img');
            trumbowyg.closeModal();
        });
    }

    // Fills modal with response gifs
    function renderGifs(response, $tenorModal, trumbowyg, mustEmpty) {
        var $tenorLoading = $tenorModal.siblings('.' + trumbowyg.o.prefix + 'tenor-loading');
        var modalWidth = $tenorModal.width();
        var gapBetweenImages = 10;
        var imagesPerRow = 3;
        var imageWidth = (modalWidth - (gapBetweenImages * (imagesPerRow + 1))) / imagesPerRow;

        nextCursor = response.next;
        var columnHeights = Array(imagesPerRow).fill(gapBetweenImages);

        if (!mustEmpty) {
            columnHeights = $tenorModal.data('columnHeights') || columnHeights;
        }

        var html = response.results
            .map(function (gifData) {
                // jshint camelcase:false
                var image = gifData.media_formats.tinygif,
                    imageRatio = image.dims[1] / image.dims[0],
                    altText = gifData.content_description;

                var full_size = gifData.media_formats.gif.url;

                var imgHtml = '<img src=' + image.url + ' width="' + imageWidth + '" height="' + imageRatio * imageWidth + '" alt="' + altText + '" loading="lazy" data-full="' + full_size + '" />';

                var minHeight = Math.min(...columnHeights);
                var columnIndex = columnHeights.indexOf(minHeight);
                var top = columnHeights[columnIndex];
                var left = gapBetweenImages + (columnIndex * (imageWidth + gapBetweenImages));

                columnHeights[columnIndex] += imageRatio * imageWidth + gapBetweenImages;

                var divHtml = '<div class="img-container" style="position:absolute; top:' + top + 'px; left:' + left + 'px;">' + imgHtml + '</div>';
                return divHtml;
            })
            .join('');

        if (mustEmpty === true) {
            if (html.length === 0) {
                if ($('.' + trumbowyg.o.prefix + 'tenor-no-result', $tenorModal).length > 0) {
                    return;
                }

                html = '<img class="' + trumbowyg.o.prefix + 'tenor-no-result" src="' + trumbowyg.o.plugins.tenor.noResultGifUrl + '"/>';
            }

            $tenorModal.empty();
        }
        $tenorModal.append(html);

        if (!nextCursor || nextCursor.length === 0) {
            $tenorLoading.hide();
        } else {
            $tenorLoading.show();
        }

        // Remove gray overlay on image load
        // moved here from inline callback definition due to CSP issue
        // Note: this is being done post-factum because load event doesn't bubble up and so can't be delegated
        var addLoadedClass = function (img) {
            img.classList.add('tbw-loaded');
        };
        $('img', $tenorModal).each(function () {
            var img = this;
            if (img.complete) { // images load instantly when cached and esp. when loaded in previous modal open
                addLoadedClass(img);
                return;
            }

            img.addEventListener('load', function () {
                addLoadedClass(this);
            });
        });

        $tenorModal.data('columnHeights', columnHeights);

        var maxHeight = Math.max(...columnHeights);
        $tenorModal.css({
            position: 'relative',
            height: maxHeight,
        });
    }

    var defaultOptions = {
        apiKey: null,
        locale: 'en_US',
        contentFilter: 'off',
        throttleDelay: 300,
        noResultGifUrl: 'https://media1.tenor.com/m/KOZLvzU0o4kAAAAC/no-results.gif'
    };

    // Add dropdown with font sizes
    $.extend(true, $.trumbowyg, {
        plugins: {
            tenor: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.tenor = $.extend({},
                        defaultOptions,
                        trumbowyg.o.plugins.tenor || {}
                    );

                    trumbowyg.addBtnDef('tenor', {
                        fn: function () {
                            if (trumbowyg.o.plugins.tenor.apiKey === null) {
                                throw new Error('You must set a Tenor API Key');
                            }

                            var BASE_URL = 'https://g.tenor.com/v2/search?ar_range=all&media_filter=gif,tinygif&limit=10&key=' +
                                trumbowyg.o.plugins.tenor.apiKey +
                                '&locale=' + trumbowyg.o.plugins.tenor.locale +
                                '&contentfilter=' + trumbowyg.o.plugins.tenor.contentFilter;

                            var DEFAULT_URL = BASE_URL.replace('/search', '/featured');
                            var prefix = trumbowyg.o.prefix;
                            var abortController = new AbortController();

                            // Create and open the modal
                            var searchInput = '<input name="" class="' + prefix + 'tenor-search" placeholder="Search a GIF" autofocus="autofocus">',
                                closeButton = '<button class="' + prefix + 'tenor-close" title="' + trumbowyg.lang.close + '"><svg><use xlink:href="' + trumbowyg.svgPath + '#' + prefix + 'close"/></svg></button>',
                                poweredByTenor = '<div class="' + prefix + 'powered-by-tenor"><span>Powered by</span>' + tenorLogo + '</div>',
                                tenorModalHtml = searchInput + closeButton + poweredByTenor + '<div class="' + prefix + 'tenor-modal-scroll"><div class="' + prefix + 'tenor-modal"></div><p class="' + prefix + 'tenor-loading"><img src="https://media.tenor.com/YtAOA9y7VG0AAAAM/loading.gif"> Loading more gifs...</p></div>';

                            trumbowyg
                                .openModal(null, tenorModalHtml, false)
                                .one(CANCEL_EVENT, function () {
                                    try {
                                        abortController.abort();
                                        abortController = new AbortController();
                                    } catch (e) {
                                    }

                                    trumbowyg.closeModal();
                                });

                            var $tenorInput = $('.' + prefix + 'tenor-search'),
                                $tenorClose = $('.' + prefix + 'tenor-close'),
                                $tenorModal = $('.' + prefix + 'tenor-modal'),
                                $tenorModalScroll = $('.' + prefix + 'tenor-modal-scroll');

                            var onError = function () {
                                if (navigator.onLine || $('.' + prefix + 'tenor-offline', $tenorModal).length) {
                                    return;
                                }

                                $tenorModal.empty();
                                $tenorModal.append('<p class="' + prefix + 'tenor-offline">You are offline</p>');
                            };

                            registerGifClickEventInModal(trumbowyg, $tenorModal);

                            // Load trending gifs as default
                            fetch(DEFAULT_URL, {
                                method: 'GET',
                                cache: 'no-cache',
                                signal: abortController.signal
                            }).then((response) => {
                                response.json().then((responseJson) => {
                                    renderGifs(responseJson, $tenorModal, trumbowyg, true);
                                });
                            }).catch(() => {
                                onError();
                            });

                            var searchGifsOnInput = function () {
                                var query = $tenorInput.val();

                                if (query.length === 0) {
                                    return;
                                }

                                try {
                                    abortController.abort();
                                    abortController = new AbortController();
                                } catch (e) {
                                }

                                $tenorModalScroll.scrollTop(0);
                                fetch(BASE_URL + '&q=' + encodeURIComponent(query), {
                                    method: 'GET',
                                    cache: 'no-cache',
                                    signal: abortController.signal
                                }).then((response) => {
                                    response.json().then((responseJson) => {
                                        renderGifs(responseJson, $tenorModal, trumbowyg, true);
                                    });
                                }).catch(() => {
                                    onError();
                                });
                            };
                            var throttledInputRequest = trumbowygThrottle(searchGifsOnInput, trumbowyg.o.plugins.tenor.throttleDelay);

                            $tenorInput.on('input', throttledInputRequest);
                            $tenorInput.focus();

                            $tenorClose.one('click', function () {
                                $tenorModal.trigger(CANCEL_EVENT);
                            });

                            var throttledQuery = trumbowygThrottle(function () {
                                if ($tenorModalScroll.scrollTop() + $tenorModalScroll.innerHeight() >= $tenorModalScroll[0].scrollHeight - 100) {
                                    if (nextCursor) {
                                        var query = $tenorInput.val();
                                        var url = query.length === 0 ? DEFAULT_URL : BASE_URL + '&q=' + encodeURIComponent(query);
                                        url += '&pos=' + nextCursor;

                                        fetch(url, {
                                            method: 'GET',
                                            cache: 'no-cache',
                                            signal: abortController.signal
                                        }).then((response) => {
                                            response.json().then((responseJson) => {
                                                renderGifs(responseJson, $tenorModal, trumbowyg, false);
                                            });
                                        }).catch(() => {
                                            onError();
                                        });
                                    }
                                }
                            }, 500);

                            // Infinite scrolling
                            $tenorModalScroll.on('scroll', throttledQuery);
                        }
                    });
                }
            }
        }
    });
})(jQuery);

(function ($) {
  'use strict';

  $.extend(true, $.trumbowyg, {
    langs: {
      // jshint camelcase:false
      en: {
        giphy: 'Insert GIF',
      },
      fr: {
        giphy: 'Insérer un GIF',
      },
    }
  });
  // jshint camelcase:true

  var CANCEL_EVENT = 'tbwcancel';

  // Throttle helper
  function trumbowygThrottle(callback, delay) {
    var last;
    var timer;

    return function () {
      var context = this;
      var now = +new Date();
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

  // Fills modal with response gifs
  function renderGifs(response, $giphyModal, trumbowyg, mustEmpty) {
    mustEmpty = mustEmpty === true;
    var width = ($giphyModal.width() - 20) / 3;

    var html = response.data
      .filter(function (gifData) {
        return gifData.images.downsized.url !== '';
      })
      .map(function (gifData) {
        var image = gifData.images.downsized,
            imageRatio = image.height / image.width;

        return '<div class="img-container"><img src=' + image.url + ' width="' + width + '" height="' + imageRatio * width + '" loading="lazy" onload="this.classList.add(\'tbw-loaded\')"/></div>';
      })
      .join('')
    ;

    if (mustEmpty) {
      $giphyModal.empty();
    }
    $giphyModal.append(html);
    $('img', $giphyModal).on('click', function () {
      trumbowyg.restoreRange();
      trumbowyg.execCmd('insertImage', $(this).attr('src'), false, true);
      $('img', $giphyModal).off();
      trumbowyg.closeModal();
    });
  }

  var defaultOptions = {
    rating: 'g',
    apiKey: null,
  };

  // Add dropdown with font sizes
  $.extend(true, $.trumbowyg, {
    plugins: {
      giphy: {
        init: function (trumbowyg) {
          trumbowyg.o.plugins.giphy = $.extend({},
            defaultOptions,
            trumbowyg.o.plugins.giphy || {}
          );

          if (trumbowyg.o.plugins.giphy.apiKey === null) {
            throw new Error('You must set a Giphy API Key');
          }

          trumbowyg.addBtnDef('giphy', {
            fn: function() {
              var BASE_URL = 'https://api.giphy.com/v1/gifs/search?api_key=' + trumbowyg.o.plugins.giphy.apiKey;
              var DEFAULT_URL = BASE_URL.replace('/search', '/trending');
              var previousAjaxCall = {abort: function () {}};

              // Create and open the modal
              var searchInput = '<input name="" class="' + trumbowyg.o.prefix + 'giphy-search" placeholder="Search a GIF" autofocus="autofocus">';
              var giphyModalHtml = searchInput + '<div class="' + trumbowyg.o.prefix + 'giphy-modal-scroll"><div class="' + trumbowyg.o.prefix + 'giphy-modal"></div></div>';
              trumbowyg
                .openModal(null, giphyModalHtml, false)
                .one(CANCEL_EVENT, function () {
                  try {
                    previousAjaxCall.abort();
                  } catch (e) {}

                  trumbowyg.closeModal();
                });
              var $giphyInput = $('.' + trumbowyg.o.prefix + 'giphy-search');
              var $giphyModal = $('.' + trumbowyg.o.prefix + 'giphy-modal');

              // Load trending gifs as default
              $.ajax({
                url: DEFAULT_URL,
                dataType: 'json',

                success: function(response) {
                  renderGifs(response, $giphyModal, trumbowyg, true);
                }
              });

              var searchGifsOnInput = function () {
                try {
                  previousAjaxCall.abort();
                } catch (e) {}

                previousAjaxCall = $.ajax({
                  url: BASE_URL + '&q=' + encodeURIComponent($giphyInput.val()),
                  dataType: 'json',

                  success: function(response) {
                    renderGifs(response, $giphyModal, trumbowyg, true);
                  }
                });
              };
              var throttledInputRequest = trumbowygThrottle(searchGifsOnInput, 300);

              $giphyInput.on('input', throttledInputRequest);
            },
          });
        }
      }
    }
  });
})(jQuery);

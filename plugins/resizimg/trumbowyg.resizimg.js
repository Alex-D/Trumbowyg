(function ($) {
  'use strict';

  var defaultOptions = {
    minSize: 32,
    step: 4,
  };
  
  var preventDefault = ev => ev.preventDefault();

  $.extend(true, $.trumbowyg, {

    langs: {
      en: {
        resizimg: 'resizable images'
      }
    },

    plugins: {
      resizimg: {
        init: function (trumbowyg) {

          trumbowyg.o.plugins.resizimg = $.extend(true, {},
            defaultOptions,
            trumbowyg.o.plugins.resizimg || {}, {
              resizable: {
                resizeWidth: false,
                onDragStart: function (ev, $el, optResizable) {
                  var opt = trumbowyg.o.plugins.resizimg;
                  var x = ev.pageX - $el.offset().left;
                  var y = ev.pageY - $el.offset().top;
                  if (x < $el.width() - opt.minSize || y < $el.height() - opt.minSize) return false;
                },
                onDrag: function (ev, $el, newWidth, newHeight, opt) {
                  var opt = trumbowyg.o.plugins.resizimg;
                  if (newHeight < opt.minSize) newHeight = opt.minSize;
                  newHeight -= newHeight % opt.step;
                  $el.height(newHeight);
                  return false;
                },
                onDragEnd: function (ev, $el, optResizable) {
                  trumbowyg.$c.trigger('tbwchange');
                },
              }
            }
          );

          function initResizable() {
            trumbowyg.$ed.find('img:not(.resizable)')
              .resizable(trumbowyg.o.plugins.resizimg.resizable)
              .on('mousedown', preventDefault);
          }

          function destroyResizable() {
            trumbowyg.$ed.find('img.resizable')
              .resizable('destroy')
              .off('mousedown', preventDefault);
            trumbowyg.syncTextarea();
          }
          
          trumbowyg.$c.on('tbwinit', initResizable);
          trumbowyg.$c.on('tbwfocus', initResizable);
          trumbowyg.$c.on('tbwchange', initResizable);
          trumbowyg.$c.on('tbwblur', destroyResizable);
          trumbowyg.$c.on('tbwclose', destroyResizable);

        },
      },
    },

  })
})(jQuery);
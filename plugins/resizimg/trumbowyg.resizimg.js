/* global ResizeWithCanvas */

(function ($) {
    'use strict';

    var defaultOptions = {
        minSize: 32,
        step: 4,
    };

    //object to interact with canvas
    var rszwtcanvas = new ResizeWithCanvas();
         
    function preventDefault(ev) {
        // tell the browser we're handling this event
        ev.stopPropagation();
        return ev.preventDefault();
    }

    function destroyResizable(trumbowyg) {
        //clean html code
        trumbowyg.$ed.find('canvas.resizable')
            .resizable('destroy')
            .off('mousedown', preventDefault)
            .removeClass('resizable');

        rszwtcanvas.reset();

        trumbowyg.syncCode();
    }

    $.extend(true, $.trumbowyg, {
        plugins: {
            resizimg: {
                init: function (trumbowyg) {
                    
                    trumbowyg.o.plugins.resizimg = $.extend(true, {},
                        defaultOptions,
                        trumbowyg.o.plugins.resizimg || {},
                        {
                            resizable: {
                                resizeWidth: false,
                                onDragStart: function (ev, $el) {
                                    var opt = trumbowyg.o.plugins.resizimg;
                                    var x = ev.pageX - $el.offset().left;
                                    var y = ev.pageY - $el.offset().top;
                                    if (x < $el.width() - opt.minSize || y < $el.height() - opt.minSize) {
                                        return false;
                                    }
                                },
                                onDrag: function (ev, $el, newWidth, newHeight) {
                                    var opt = trumbowyg.o.plugins.resizimg;
                                    if (newHeight < opt.minSize) {
                                        newHeight = opt.minSize;
                                    }
                                    newHeight -= newHeight % opt.step;
                                    $el.height(newHeight);
                                    return false;
                                },
                                onDragEnd: function () {
                                    //resize update canvas information
                                    rszwtcanvas.refresh();
                                    trumbowyg.syncCode();
                                }
                            }
                        }
                    );

                    
                    function initResizable() {

                        trumbowyg.$ed.find('img')
                            .off('click')
                            .on('click', function (ev) {
                                //if I'm already do a resize, reset it
                                if (rszwtcanvas.isActive()){
                                    rszwtcanvas.reset();
                                }
                                //initialize resize of image
                                rszwtcanvas.setup(this, trumbowyg.o.plugins.resizimg.resizable);
                                // tell the browser we're handling this event
                                preventDefault(ev);
                            });
                    }

                    // Init
                    trumbowyg.$c.on('tbwinit', function () {
                        initResizable();

                        //disable resize when click on other items
                        trumbowyg.$ed.on('click', function (ev) {
                            //check if I've clicked out of canvas or image to reset it
                            if (!($(ev.target).is('img') || ev.target.id === rszwtcanvas.canvasId())) {
                                // tell the browser we're handling this event
                                preventDefault(ev);

                                rszwtcanvas.reset();
                                
                                //save changes
                                trumbowyg.$c.trigger('tbwchange');
                            }
                        });

                        trumbowyg.$ed.on('scroll', function () {
                            rszwtcanvas.reCalcOffset();
                        });
                    });

                    trumbowyg.$c.on('tbwfocus', function () {
                            initResizable(); 
                    });
                    trumbowyg.$c.on('tbwchange', initResizable);
                    trumbowyg.$c.on('tbwresize', function (){ rszwtcanvas.reCalcOffset(); });


                    // Destroy
                    trumbowyg.$c.on('tbwblur', function () {
                        //if I have already focused the canvas avoid destroy
                        if(rszwtcanvas.isFocusedNow()){
                            rszwtcanvas.UnFocusNow();
                        }
                        else{                 
                            destroyResizable(trumbowyg);
                        }
                    });
                    trumbowyg.$c.on('tbwclose', function () {
                        destroyResizable(trumbowyg);
                    });

                    //Init resize with canvas events
                    rszwtcanvas.presskeyesc = function(obj){
                        //reset it because the image is replaced by the canvas and have to reset it manually - the IsActive check in initResizable doesn't fire because have a canvas and not the image
                        obj.reset();
                        initResizable();
                    };
                    rszwtcanvas.presskeydelorcanc = function(obj){
                        $(obj.resizecanvas).replaceWith('');
                        obj.resizeimg = null;
                    };
                },
                destroy: function (trumbowyg) {
                    destroyResizable(trumbowyg);
                }
            }
        }
    });
})(jQuery);

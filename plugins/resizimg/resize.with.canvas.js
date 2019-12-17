var ResizeWithCanvas = (function ($) {
    'use strict';

 return function ResizeWithCanvas() {

        //variable to create canvas and save img in resize mode
        this.resizecanvas = document.createElement('canvas');
        //to allow canvas to get focus
        this.resizecanvas.setAttribute('tabindex','0');
        this.resizecanvas.id = 'tbwresizeme';
        this.ctx = null;
        this.resizeimg = null;

        //function callback to do something when appen something
        this.beforecanvasreplaced = function (canvas, image){};
        this.presskeyesc = function (obj){};
        this.presskeydelorcanc = function (obj){};

        //PRIVATE FUNCTION
        var isfocusednow = false;
        var cursors = ['default', 'se-resize', 'not-allowed'];
        var currentCursor = 0;
        var stylesFilled = ['rgb(0, 0, 0)', 'rgb(200, 0, 0)'];

        var shapesFilled = [];
        shapesFilled.push({
            points: { x: 0, y: 0, width: 0, height: 0 },
            cursor: 2,
            style: 0
        });
        shapesFilled.push({
            points: { x: 0, y: 0, width: 0, height: 0 },
            cursor: 2,
            style: 0
        });
        shapesFilled.push({
            points: { x: 0, y: 0, width: 0, height: 0 },
            cursor: 2,
            style: 0
        });
        shapesFilled.push({
            points: { x: 0, y: 0, width: 0, height: 0 },
            cursor: 1,
            style: 1
        });

        //calculate offset to change mouse over square in the canvas
        var offsetX, offsetY;
        var reOffset = function (canvas) {
            var BB = canvas.getBoundingClientRect();
            offsetX = BB.left;
            offsetY = BB.top;
        };

        var drawRect = function (shapedata, ctx) {
            ctx.beginPath();
            ctx.fillStyle = stylesFilled[shapedata.style];
            ctx.rect(shapedata.points.x, shapedata.points.y, shapedata.points.width, shapedata.points.height);
            ctx.fill();
        };

        var updateCanvas = function(canvas, ctx, img, canvasWidth, canvasHeight){
            
            //square in the angle
            shapesFilled[0].points = { x: -10, y: -10, width: 20, height: 20 };
            shapesFilled[1].points = { x: canvasWidth - 10, y: -10, width: 20, height: 20 };
            shapesFilled[2].points = { x: -10, y: canvasHeight - 10, width: 20, height: 20 };
            shapesFilled[3].points = { x: canvasWidth - 10, y: canvasHeight - 10, width: 20, height: 20 };

            for (var i = 0; i < shapesFilled.length; i++) {
                drawRect(shapesFilled[i], ctx);
            }

            //border
            ctx.beginPath();
            ctx.rect(5, 5, canvasWidth - 10, canvasHeight - 10);
            ctx.stroke();

            //image
            ctx.drawImage(img, 10, 10, canvasWidth - 20, canvasHeight - 20);

            //get the offset to change the mouse cursor 
            reOffset(canvas);

            return ctx;
        };

        //PUBLIC FUNCTION
        //necessary to correctly print cursor over square. Called once for instance. unuseful with trumbowyg
        this.init = function(){
            var _this = this;
            window.onscroll=function() { reOffset(_this.resizecanvas); };
            window.onresize=function() { reOffset(_this.resizecanvas); }; 
        };

        this.reCalcOffset = function(){
            reOffset(this.resizecanvas);
        };

        this.canvasId = function () {
            return this.resizecanvas.id;
        };

        this.isActive = function () {
            return this.resizeimg !== null;
        };

        this.isFocusedNow = function () {
            return isfocusednow;
        };

        this.UnFocusNow = function () {
            isfocusednow = false;
        };

        //restore image in the HTML of the editor
        this.reset = function () {

            if (this.resizeimg !== null) {
                this.resizeimg.width = this.resizecanvas.clientWidth - 20;
                this.resizeimg.height = this.resizecanvas.clientHeight - 20;
                //clear style of image to avoid issue on resize because this attribute have priority over width and height attribute
                this.resizeimg.style = '';

                this.beforecanvasreplaced(this.resizecanvas, this.resizeimg);

                //sostituisce il canvas con l'immagine
                $(this.resizecanvas).replaceWith($(this.resizeimg));

                //reset canvas style
                this.resizecanvas.style = '';
                this.resizeimg = null;
            }
        };

        //setup canvas with points and border to allow the resizing operation
        this.setup = function (img, resizableopt) {

            this.resizeimg = img;

            if (this.resizecanvas.getContext) {
                isfocusednow = true;
                
                //draw canvas
                this.resizecanvas.width = $(this.resizeimg).width() + 20;
                this.resizecanvas.height = $(this.resizeimg).height() + 20;
                this.ctx = this.resizecanvas.getContext('2d');

                //sostituisce l'immagine con il canvas
                $(this.resizeimg).replaceWith($(this.resizecanvas));

                updateCanvas(this.resizecanvas, this.ctx, this.resizeimg, this.resizecanvas.width, this.resizecanvas.height);

                //enable resize
                $(this.resizecanvas).resizable(resizableopt)
                    .on('mousedown', function (ev) { return ev.preventDefault(); });

                var _this = this;
                var _ctx = this.ctx;
                $(this.resizecanvas)
                    .on('mousemove', function (e) {                    
                        var mouseX = parseInt(e.clientX - offsetX);
                        var mouseY = parseInt(e.clientY - offsetY);

                        // Put your mousemove stuff here
                        var newCursor;
                        for (var i = 0; i < shapesFilled.length; i++) {
                            var s = shapesFilled[i];
                            drawRect(s, _ctx);
                            if (_ctx.isPointInPath(mouseX, mouseY)) {
                                newCursor = s.cursor;
                                break;
                            }
                        }
                        if (!newCursor) {
                            if (currentCursor > 0) {
                                currentCursor = 0;
                                this.style.cursor = cursors[currentCursor];
                            }
                        } else if (newCursor !== currentCursor) {
                            currentCursor = newCursor;
                            this.style.cursor = cursors[currentCursor];
                        }
                    })
                    .on('keydown', function () {
                        var x = event.keyCode;
                        if (x === 27 && _this.isActive()){//ESC
                            _this.presskeyesc(_this);
                        }
                        else if ((x === 46 || x === 8) && _this.isActive()){//CANC DEL
                            _this.presskeydelorcanc(_this);
                        }
                    })
                    .on('focus', function (ev) {
                        // tell the browser we're handling this event
                        ev.stopPropagation();
                        return ev.preventDefault();
                    });

                this.resizecanvas.focus();

                return true;
            }

            return false;
        };

        //update the canvas after the resizing
        this.refresh = function(){
            if (this.resizecanvas.getContext) {
                this.resizecanvas.width = this.resizecanvas.clientWidth;
                this.resizecanvas.height = this.resizecanvas.clientHeight;
                updateCanvas(this.resizecanvas, this.ctx, this.resizeimg, this.resizecanvas.width, this.resizecanvas.height);
            }
        };
    };

})(jQuery);
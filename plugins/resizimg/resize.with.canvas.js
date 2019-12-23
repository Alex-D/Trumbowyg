 (function ($, window) {
    'use strict';

    window.ResizeWithCanvas= function() {

        //variable to create canvas and save img in resize mode
        this.resizeCanvas = document.createElement('canvas');
        //to allow canvas to get focus
        this.resizeCanvas.setAttribute('tabindex','0');
        this.resizeCanvas.id = 'tbwresizeme';
        this.ctx = null;
        this.resizeImg = null;

        /* jshint unused:vars */
        //function callback to do something when appen something
        this.beforeCanvasReplaced = function (canvas, image){

        };
        this.pressKeyEsc = function (obj){
            obj.reset();
        };
        this.pressKeyDelOrCanc = function (obj){
            $(obj.resizeCanvas).replaceWith('');
            obj.resizeImg = null;
        };

        //PRIVATE FUNCTION
        var focusedNow = false;
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

            for (var i = 0; i < shapesFilled.length; i+=1) {
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
            window.onscroll=function() { reOffset(_this.resizeCanvas); };
            window.onresize=function() { reOffset(_this.resizeCanvas); }; 
        };

        this.reCalcOffset = function(){
            reOffset(this.resizeCanvas);
        };

        this.canvasId = function () {
            return this.resizeCanvas.id;
        };

        this.isActive = function () {
            return this.resizeImg !== null;
        };

        this.isFocusedNow = function () {
            return focusedNow;
        };

        this.UnFocusNow = function () {
            focusedNow = false;
        };

        //restore image in the HTML of the editor
        this.reset = function () {

            if (this.resizeImg !== null) {
                this.resizeImg.width = this.resizeCanvas.clientWidth - 20;
                this.resizeImg.height = this.resizeCanvas.clientHeight - 20;
                //clear style of image to avoid issue on resize because this attribute have priority over width and height attribute
                this.resizeImg.style = '';

                this.beforeCanvasReplaced(this.resizeCanvas, this.resizeImg);

                //sostituisce il canvas con l'immagine
                $(this.resizeCanvas).replaceWith($(this.resizeImg));

                //reset canvas style
                this.resizeCanvas.style = '';
                this.resizeImg = null;
            }
        };

        //setup canvas with points and border to allow the resizing operation
        this.setup = function (img, resizableopt) {

            this.resizeImg = img;

            if (this.resizeCanvas.getContext) {
                focusedNow = true;
                
                //draw canvas
                this.resizeCanvas.width = $(this.resizeImg).width() + 20;
                this.resizeCanvas.height = $(this.resizeImg).height() + 20;
                this.ctx = this.resizeCanvas.getContext('2d');

                //sostituisce l'immagine con il canvas
                $(this.resizeImg).replaceWith($(this.resizeCanvas));

                updateCanvas(this.resizeCanvas, this.ctx, this.resizeImg, this.resizeCanvas.width, this.resizeCanvas.height);

                //enable resize
                $(this.resizeCanvas).resizable(resizableopt)
                    .on('mousedown', function (ev) { return ev.preventDefault(); });

                var _this = this;
                var _ctx = this.ctx;
                $(this.resizeCanvas)
                    .on('mousemove', function (e) {                    
                        var mouseX = parseInt(e.clientX - offsetX);
                        var mouseY = parseInt(e.clientY - offsetY);

                        // Put your mousemove stuff here
                        var newCursor;
                        for (var i = 0; i < shapesFilled.length; i+=1) {
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
                            _this.pressKeyEsc(_this);
                        }
                        else if ((x === 46 || x === 8) && _this.isActive()){//CANC DEL
                            _this.pressKeyDelOrCanc(_this);
                        }
                    })
                    .on('focus', function (ev) {
                        // tell the browser we're handling this event
                        ev.stopPropagation();
                        return ev.preventDefault();
                    });

                this.resizeCanvas.focus();

                return true;
            }

            return false;
        };

        //update the canvas after the resizing
        this.refresh = function(){
            if (this.resizeCanvas.getContext) {
                this.resizeCanvas.width = this.resizeCanvas.clientWidth;
                this.resizeCanvas.height = this.resizeCanvas.clientHeight;
                updateCanvas(this.resizeCanvas, this.ctx, this.resizeImg, this.resizeCanvas.width, this.resizeCanvas.height);
            }
        };
    };

})(jQuery, window);
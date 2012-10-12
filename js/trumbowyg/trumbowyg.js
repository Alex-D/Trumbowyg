$.trumbowyg = {
    langs: {
        en: {
            viewHTML: "View HTML",

            formatting: "Formatting",
            p: "Paragraph",
            blockquote: "Quote",
            code: "Code",
            header: "Header",

            bold: "Bold",
            italic: "Italic",
            strikethrough: "Stroke",
            underline: "Underline",

            strong: "Strong",
            em: "Emphasis",

            unorderedList: "Unordered list",
            orderedList: "Ordered list",

            insertImage: "Insert Image...",
            insertVideo: "Insert Video...",
            link: "Link",
            createLink: "Insert link...",
            unlink: "Remove link",

            justifyLeft: "Align Left",
            justifyCenter: "Align Center",
            justifyRight: "Align Right",
            justifyFull: "Align Justify",

            insertHorizontalRule: "Insert horizontal rule",

            fullscreen: "fullscreen",

            close: "Close",

            confirm: "Confirm",
            cancel: "Cancel"
        }
    }
};


(function($){
    $.fn.trumbowyg = function(opts){
        return this.each(function(){
            var $that = $(this);

            if(!$that.data('trumbowyg'))
                $that.data('trumbowyg', new Trumbowyg(this, opts));
        });
    };
    $.fn.destroyTrumbowyg = function(){
        this.data('trumbowyg').destroy();
    };
    $.fn.getCode = function(){
        return this.data('trumbowyg').getCode();
    };



    var Trumbowyg = function(editorElem, opts){
        // jQuery object of the editor
        this.$e = $(editorElem);
        this.$creator = $(editorElem);

        // Localization management
        if(typeof opts === 'undefined' || typeof opts.lang === 'undefined' || typeof $.trumbowyg.langs[opts.lang] === 'undefined')
            this.lang = $.trumbowyg.langs['en'];
        else
            this.lang = $.extend(true, {}, $.trumbowyg.langs['en'], $.trumbowyg.langs[opts.lang]);

        // Read only options
        this.global = {
            buttonsGroups: {
                design : ['bold', 'italic', 'underline', 'strikethrough'],
                semantic : ['strong', 'em'],
                justify: ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                lists: ['unorderedList', 'orderedList']
            }
        };

        // CSS class prefixed by opts.prefix
        this.cssClass = {
            editorBox: 'box',
            editorEditor: 'editor',
            editorTextarea: 'textarea',
            buttonPane: 'button-pane',
            separator: 'separator',
            dropdown: 'dropdown',
            fullscreen: 'fullscreen',
            close: 'close',
            notDisable: 'not-disable',
            buttonsRight: 'buttons-right',
            modal: 'modal',
            fixedTop: 'fixed-top'
        };

        // Defaults Options
        this.opts = $.extend(true, {
            lang: 'en',
            dir: 'ltr',
            duration: 200, // Duration of modal box animations

            mobile: false,
            tablet: true,
            closable: false,
            fullscreenable: true,
            fixedButtonPane: false,
            fixedFullWidth: false,
            semantic: false,
            resetCss: false,
            autoAjustHeight: false,

            prefix: 'trumbowyg-',

            convertLink: true,

            buttons: ['viewHTML', 
                        '|', 'formatting',
                        '|', this.global.buttonsGroups.design,
                        '|', 'link', 
                        '|', 'insertImage',
                        '|', this.global.buttonsGroups.justify,
                        '|', this.global.buttonsGroups.lists,
                        '|', 'insertHorizontalRule'],
            buttonsAdd: [],

            /**
             * When the button is associated to a empty object
             * func and title attributs are defined from the button key value
             *
             * For example
             *      foo: {}
             * is equivalent to :
             *      foo: {
             *          func: 'foo',
             *          title: this.lang.foo
             *      }
             */
            buttonsDef: {
                viewHTML: {
                    func: 'toggle'
                },

                formatting: {
                    dropdown: {
                        defaultFunc: 'formatBlock',
                        p: {},
                        blockquote: {},
                        h1: {
                            title: this.lang.header + ' 1'
                        },
                        h2: {
                            title: this.lang.header + ' 2'
                        },
                        h3: {
                            title: this.lang.header + ' 3'
                        },
                        h4: {
                            title: this.lang.header + ' 4'
                        }
                    }
                },

                bold: {},
                italic: {},
                underline: {},
                strikethrough: {},

                strong: {
                    func: 'bold'
                },
                em: {
                    func: 'italic'
                },

                link: {
                    dropdown: {
                        createLink: {},
                        unlink: {}
                    }
                },

                insertImage: {},

                justifyLeft: {},
                justifyCenter: {},
                justifyRight: {},
                justifyFull: {},

                unorderedList: {
                    func: 'insertUnorderedList'
                },
                orderedList: {
                    func: 'insertOrderedList'
                },

                insertHorizontalRule: {}
            }
        }, opts);

        if(this.opts.semantic){
            this.opts.buttons = [
                'viewHTML', 
                '|', 'formatting',
                '|', this.global.buttonsGroups.semantic,
                '|', 'link', 
                '|', 'insertImage',
                '|', this.global.buttonsGroups.justify,
                '|', this.global.buttonsGroups.lists,
                '|', 'insertHorizontalRule'
            ];
        }

        this.init();
    }

    Trumbowyg.prototype = {
        init: function(){
            this.height = this.$e.css('height');

            if(this.isEnabled()){
                this.buildEditor(true);
                return;
            }

            this.buildEditor();
            this.buildButtonPane();
            
            this.fixedButtonPaneEvents();

            this.buildOverlay();
        },

        buildEditor: function(disable){
            if(disable === true){
                if(!this.$e.is('textarea')){
                    var textarea = this.buildTextarea().val(this.$e.val());
                    this.$e.hide().after(textarea);
                }
                return;
            }


            this.$box = $('<div/>', {
                'class': this.opts.prefix + this.cssClass.editorBox + ' ' + this.opts.prefix + this.opts.lang + ' trumbowyg'
            });

            this.isTextarea = true;
            if(this.$e.is('textarea')){
                this.$editor = $('<div/>');
            } else {
                this.$editor = this.$e;
                this.$e = this.buildTextarea().val(this.$e.val());
                this.isTextarea = false;
            }

            this.$e.hide()
                   .addClass(this.opts.prefix + this.cssClass.editorTextarea);

            var html = '';
            if(this.isTextarea){
                html = this.$e.val();
                this.$box.insertAfter(this.$e)
                         .append(this.$editor)
                         .append(this.$e);
            } else {
                html = this.$editor.html();
                this.$box.insertAfter(this.$editor)
                         .append(this.$e)
                         .append(this.$editor);
                this.syncCode();
            }

            this.$editor.addClass(this.opts.prefix + this.cssClass.editorEditor)
                        .attr('contenteditable', true)
                        .attr('dir', this.opts.dir)
                        .html(html);

            if(this.opts.resetCss)
                this.$editor.addClass(this.opts.prefix + 'reset-css');

            if(!this.opts.autoAjustHeight){
                this.$editor.css({
                    height: this.height,
                    overflow: 'auto'
                });
                this.$e.css({
                    height: this.height,
                    overflow: 'auto'
                });
            }



            var that = this;
            this.$editor.on('dblclick', 'img', function(){
                $(this).attr('src', that.getUrl($(this).attr('src')));
                return false;
            });
            this.$editor.on('mousedown', function(e){
                that.sementicCode();
            });
        },

        buildTextarea: function(){
            return $('<textarea name="'+this.$e.attr('id')+'"></textarea>', {
                height: this.height
            });
        },

        buildButtonPane: function(){
            if(this.opts.buttons === false) return;

            this.$buttonPane = $('<ul/>', {
                'class': this.opts.prefix + this.cssClass.buttonPane
            });

            $.each(this.opts.buttons.concat(this.opts.buttonsAdd), $.proxy(function(i, btn){
                if(!$.isArray(btn)) btn = [btn];
                $.each(btn, $.proxy(function(i, btn){
                    try {
                        var li = $('<li/>');

                        if(btn == '|'){
                            li.addClass(this.opts.prefix + this.cssClass.separator);
                        } else {
                            if(btn == 'viewHTML')
                                li.addClass(this.opts.prefix + this.cssClass.notDisable);
                            li.append(this.buildButton(btn));
                        }

                        this.$buttonPane.append(li);
                    } catch(e){}
                }, this));
            }, this));



            var $liRight = $('<li/>', {
                'class': this.opts.prefix + this.cssClass.notDisable + ' ' + this.opts.prefix + this.cssClass.buttonsRight
            });

            if(this.opts.fullscreenable)
                $liRight.append(this.buildRightButton('fullscreen').on('click', $.proxy(function(e){
                    var cssClass = this.opts.prefix + this.cssClass.fullscreen;
                    this.$box.toggleClass(cssClass);

                    if(this.$box.hasClass(cssClass)){
                        $('body').css('overflow', 'hidden');
                        this.$box.css({
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            margin: 0,
                            padding: 0,
                            zIndex: 10
                        });
                        $([this.$editor, this.$e]).each(function(){
                            $(this).css({
                                height: '100%',
                                overflow: 'auto'
                            });
                        });
                        this.$buttonPane.css({
                            width: '100%'
                        });
                    } else {
                        $('body').css('overflow', 'auto');
                        this.$box.removeAttr('style');
                        if(!this.opts.autoAjustHeight){
                            var h = this.height;
                            $([this.$editor, this.$e]).each(function(){
                                $(this).css({
                                    height: h
                                });
                            });
                        }

                    }
                    $(window).trigger('scroll');
                }, this)));

            if(this.opts.closable)
                $liRight.append(this.buildRightButton('close').on('click', $.proxy(function(e){
                    if(this.$box.hasClass(cssClass))
                        $('body').css('overflow', 'auto');
                    this.destroy();
                }, this)));

            this.$buttonPane.append($liRight);

            this.$box.prepend(this.$buttonPane);
        },

        buildButton: function(name){
            var btnDef = this.opts.buttonsDef[name];
            var that = this;
            var btn = $('<a/>', {
                href: 'javascript:void(null);',
                'class': this.opts.prefix + name +'-button',
                text: btnDef.text || btnDef.title || this.lang[name] || name,
                title: btnDef.title || btnDef.text || this.lang[name] || name,
                mousedown: function(e){
                    if(!btnDef.dropdown || that.$box.find('.'+name+'-'+that.opts.prefix + that.cssClass.dropdown).is(':hidden'))
                        $('body').trigger('mousedown');

                    if(that.$buttonPane.hasClass(that.opts.prefix + 'disable') 
                        && !$(this).parent().hasClass(that.opts.prefix + that.cssClass.notDisable))
                        return false;

                    that.execCommand((btnDef.dropdown ? 'dropdown' : '') || btnDef.func || name,
                                     btnDef.param || name);

                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            });



            if(btnDef.dropdown){
                var cssClass = this.opts.prefix + this.cssClass.dropdown
                             + ' ' + this.opts.prefix + this.cssClass.fixedTop;

                var dropdown = $('<div/>', {
                    'class': name + '-' + cssClass + ' ' + cssClass
                });
                dropdown.data('visible', false);
                for(var subName in btnDef.dropdown){
                    if($.isObject(btnDef.dropdown[subName]))
                        dropdown.append(this.buildSubButton(btnDef.dropdown, subName));
                }
                this.$box.append(dropdown.hide());
            }

            return btn;
        },
        buildSubButton: function(dropdown, name){
            $('body').trigger('mousedown');

            var btnDef = dropdown[name];
            return $('<a/>', {
                href: 'javascript:void(null);',
                text: btnDef.text || btnDef.title || this.lang[name] || name,
                title: btnDef.title || btnDef.text || this.lang[name] || name,
                mousedown: $.proxy(function(e){
                    $('body').trigger('mousedown');

                    this.execCommand(dropdown.defaultFunc || btnDef.func || name,
                                     btnDef.param || name);

                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }, this)
            });
        },
        buildRightButton: function(name){
            return $('<a/>', {
                href: 'javascript:void(null);',
                'class': this.opts.prefix + (this.cssClass[name] || name) + '-button',
                title: this.lang[name],
                text: this.lang[name]
            });
        },

        buildOverlay: function(){
            return this.$overlay = $('<div/>', {
                'class': this.opts.prefix + 'overlay'
            }).css({
                top: this.$buttonPane.css('height'),
                height: this.$editor.outerHeight()
            }).appendTo(this.$box);
        },
        showOverlay: function(){
            $(window).trigger('scroll');
            this.$overlay.fadeIn(200);
        },
        hideOverlay: function(){
            this.$overlay.fadeOut(200);
        },

        fixedButtonPaneEvents: function(){
            if(!this.opts.fixedButtonPane)
                return;

            this.isFixed = false;

            $(window).on('scroll', $.proxy(function(e){
                if(!this.$box)
                    return;

                this.syncCode();

                var wScroll = $(window).scrollTop();
                var offset = this.$box.offset().top + 2;
                var toFixed = (wScroll - offset > 0) && ((wScroll - offset - parseInt(this.height.replace('px', ''))) < 0);

                if(toFixed){
                    if(!this.isFixed){
                        this.isFixed = true;
                        this.$buttonPane.css({
                            position: 'fixed',
                            top: 0,
                            left: (this.opts.fixedFullWidth) ? '0' : 'auto',
                            width: (this.opts.fixedFullWidth) ? '100%' : this.$box.css('width'),
                            zIndex: 7
                        });
                        this.$editor.css({ marginTop: this.$buttonPane.css('height') });
                        this.$e.css({ marginTop: this.$buttonPane.css('height') });
                    }

                    $('.' + this.opts.prefix + this.cssClass.fixedTop, this.$box).css({
                        position: this.opts.fixedFullWidth ? 'fixed' : 'absolute',
                        top: this.opts.fixedFullWidth ? this.$buttonPane.css('height') : parseInt(this.$buttonPane.css('height').replace('px', '')) + (wScroll - offset) + 'px',
                        zIndex: 15
                    });
                } else if(this.isFixed) {
                    this.isFixed = false;
                    this.$buttonPane.css({ position: 'relative' });
                    this.$editor.css({ marginTop: 0 });
                    this.$e.css({ marginTop: 0 });
                    $('.' + this.opts.prefix + this.cssClass.fixedTop, this.$box).css({
                        position: 'absolute',
                        top: this.$buttonPane.css('height')
                    });
                }
            }, this));
        },




        destroy: function(){
            var html = this.getCode();

            if(this.isTextarea)
                this.$box.after(this.$e.css({height: this.height})
                                       .val(html)
                                       .removeClass(this.opts.prefix + this.cssClass.editorTextarea)
                                       .show());
            else 
                this.$box.after(this.$editor.css({height: this.height})
                                            .removeClass(this.opts.prefix + this.cssClass.editorEditor)
                                            .attr('contenteditable', false)
                                            .html(html)
                                            .show());

            this.$box.remove();
            this.$creator.removeData('trumbowyg');
        },




        toggle: function(){
            this.sementicCode();
            this.$editor.toggle();
            this.$e.toggle();
            this.$buttonPane.toggleClass(this.opts.prefix + 'disable');
        },

        dropdown: function(name){
            var $dropdown = this.$box.find('.'+name+'-'+this.opts.prefix + this.cssClass.dropdown);
            var $btn = this.$buttonPane.find('.'+this.opts.prefix+name+'-button');

            if($dropdown.is(':hidden')){
                $btn.addClass(this.opts.prefix + 'active');

                $dropdown.css({
                    position: 'absolute',
                    top: this.$buttonPane.css('height'),
                    left: (this.opts.fixedFullWidth && this.isFixed) ? $btn.offset().left+'px' : ($btn.offset().left - this.$buttonPane.offset().left)+'px'
                }).show();

                $(window).trigger('scroll');

                $('body').on('mousedown', $.proxy(function(e){
                    $('.' + this.opts.prefix + this.cssClass.dropdown).hide();
                    $('.' + this.opts.prefix + 'active').removeClass(this.opts.prefix + 'active');
                    $('body').off('mousedown');
                }, this));
            } else {
                $('body').trigger('mousedown');
            }
        },



        

        getCode: function(){
            return this.$e.val();
        },
        setCode: function(html){
            this.$e.val(html);
        },
        syncCode: function(){
            if(this.$editor.is(':visible'))
                this.$e.val(this.$editor.html());
            else
                this.$editor.html(this.$e.val());

            if(this.opts.autoAjustHeight){
                this.height = this.$editor.css('height');
                this.$e.css({height: this.height});
            }
        },

        sementicCode: function(){
            this.syncCode();

            if(this.opts.semantic){
                this.sementicTag('b', 'strong');
                this.sementicTag('i', 'em');

                this.$e.val(this.$editor.html());
            }
        },
        sementicTag: function(oldTag, newTag){
            $(oldTag, this.$editor).each(function(){
                $(this).replaceWith(function(){ return '<'+newTag+'>' + $(this).html() + '</'+newTag+'>'; });
            });
        },



        createLink: function(){
            this.saveSelection();
            this.buildInsert(this.lang.insertImage, {
                title: {
                    label: 'Title',
                    name: 'title',
                    value: this.selection
                },
                text: {
                    label: 'Text',
                    name: 'text',
                    value: this.selection
                }
            }, 'createLink');
        },
        formatBlock: function(param){
            if($.browser.msie)
                param = '<' + param + '>';

            document.execCommand('formatBlock', false, param);
            this.syncCode();
        },
        insertImage: function(){
            this.saveSelection();
            this.buildInsert(this.lang.insertImage, {
                alt: {
                    label: 'Alt',
                    name: 'alt',
                    value: this.selection
                }
            }, 'insertImage');
        },

        buildInsert: function(title, fields, cmd){
            var html = '<label>URL : <input type="text" name="url" value="http://"></label>';
            for(f in fields){
                f = fields[f];
                html += '<label>'+f.label+' : <input type="text" name="'+f.name+'" value="'+ (f.value || '') +'"></label>';
            }

            var modal = this.openModal(title, html);

            modal.on(this.opts.prefix + 'confirm', $.proxy(function(e, m){
                var $modal = $(m);

                var values = {};
                fields['url'] = {};
                for(f in fields){
                    values[f] = $('input[name="'+f+'"]', $modal).val();
                }
                
                if(values['url'] != 'http://'){
                    this.restoreSelection();
                    document.execCommand(cmd, false, values['url']);
                    this.syncCode();
                    this.closeModal();
                    modal.off(this.opts.prefix + 'confirm');
                } else {
                    $modal.append('<span class="error">Invalid URL</span>');
                }
            }, this));
            modal.one(this.opts.prefix + 'cancel', $.proxy(function(){
                modal.off(this.opts.prefix + 'confirm');
                this.closeModal();
                this.restoreSelection();
            }, this));
        },



        execCommand: function(cmd, param){
            if(cmd != 'dropdown')
                this.$editor.focus();

            try {
                this[cmd](param);
            } catch(e){
                try {
                    cmd(param);
                } catch(e){
                    this.$editor.focus();
                    document.execCommand(cmd, false, param);
                }
            }
            this.syncCode();
        },



        openModal: function(title, content){
            this.saveSelection();
            this.showOverlay();

            // Disable all buttonPane buttons
            this.$buttonPane.addClass(this.opts.prefix + 'disable');
            $('.' + this.opts.prefix + this.cssClass.notDisable, this.$buttonPane)
                .not('.' + this.opts.prefix + this.cssClass.buttonsRight)
                .removeClass(this.opts.prefix + this.cssClass.notDisable)
                .addClass(this.opts.prefix + this.cssClass.notDisable + '-old');


            // Build out of ModalBox, it's the mask for animations
            var $modal = $('<div/>', {
                'class': this.opts.prefix + this.cssClass.modal + ' ' + this.opts.prefix + this.cssClass.fixedTop
            }).css({
                top: this.$buttonPane.css('height')
            }).appendTo(this.$box);


            // Build ModalBox and animate to show them
            var $modalBox = $('<div/>', {
                'class': this.opts.prefix + this.cssClass.modal + '-box',
                html: content
            }).css({
                top: '-' + $modal.css('height')
            }).appendTo($modal)
            .animate({
                top: 0
            }, this.opts.duration);


            // Append title
            $('<span/>', {
                text: title,
                'class': this.opts.prefix + this.cssClass.modal + '-title'
            }).prependTo($modalBox);


            // Append Cancel and Confirm buttons
            this.buildModalButton('cancel', $modalBox);
            this.buildModalButton('confirm', $modalBox);


            $('body').trigger('scroll');

            return $modalBox;
        },
        buildModalButton: function(name, modal){
            return $('<a/>', {
                href: 'javascript:void(null);',
                'class': this.opts.prefix + this.cssClass.modal + '-button '+ this.opts.prefix + this.cssClass.modal + '-' + name,
                text: this.lang[name] || name,
                title: this.lang[name] || name,
                click: $.proxy(function(e){
                    modal.trigger(this.opts.prefix + name, modal);
                }, this)
            }).appendTo(modal);
        },
        closeModal: function(){
            this.$buttonPane.removeClass(this.opts.prefix + 'disable');

            $('.' + this.opts.prefix + this.cssClass.notDisable + '-old', this.$buttonPane)
                .removeClass(this.opts.prefix + this.cssClass.notDisable + '-old')
                .addClass(this.opts.prefix + this.cssClass.notDisable);

            var that = this;
            var $modalBox = $('.' + this.opts.prefix + this.cssClass.modal + '-box', this.$box);
            $modalBox.animate({
                top: '-' + $modalBox.css('height')
            }, this.opts.duration, function(){
                $(this).parent().remove();
                that.hideOverlay();
            });
        },





        saveSelection: function(){
            this.selection = null;
            if(window.getSelection){
                var sel = window.getSelection();
                if(sel.getRangeAt && sel.rangeCount)
                    this.selection = sel.getRangeAt(0);
            } else if(document.selection && document.selection.createRange){
                this.selection = document.selection.createRange();
            }
        },
        restoreSelection: function(){
            range = this.selection;
            if(range){
                if(window.getSelection){
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if(document.selection && range.select){
                    range.select();
                }
            }
        },
        



        isEnabled: function(){
            var mobile = "iPhone|iPod|Android|BlackBerry|Windows\sPhone|ZuneWP7";
            var exprTablet = new RegExp("(iPad|webOS)");
            var exprMobile = new RegExp("("+mobile+")");

            return (this.opts.tablet === true && exprTablet.test(navigator.userAgent))
                    || (this.opts.mobile === true && exprMobile.test(navigator.userAgent));
        }
    };

    /* isObject */
    var toString = Object.prototype.toString, hasOwnProp = Object.prototype.hasOwnProperty;
    $.isObject = function(obj) { if(toString.call(obj) !== "[object Object]") return false; var key; for(key in obj){} return !key || hasOwnProp.call(obj, key); };
})(jQuery);
/* ===========================================================
 * trumbowyg.js v1.0
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Alex-D (aka Alexandre Demode)
 *          Twitter : @AlexandreDemode
 */

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

            horizontalRule: "Insert horizontal rule",

            fullscreen: "fullscreen",

            close: "Close",

            submit: "Confirm",
            reset: "Cancel",

            urlInvalid: "Invalid URL"
        }
    },

    btnsGrps: {
        design:     ['bold', 'italic', 'underline', 'strikethrough'],
        semantic:   ['strong', 'em'],
        justify:    ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
        lists:      ['unorderedList', 'orderedList']
    }
};



(function($){
    $.fn.trumbowyg = function(opts, params){
        if($.isObject(opts) || opts == null){
            return this.each(function(){
                var $that = $(this);

                if(!$that.data('trumbowyg'))
                    $that.data('trumbowyg', new Trumbowyg(this, opts));
            });
        } else if(this.length == 1){
            try {
                var tbw = $(this).data('trumbowyg');
                switch(opts){
                    // Modal box
                    case 'openModal':
                        return tbw.openModal(params.title, params.content);
                    case 'closeModal':
                        return tbw.closeModal();
                    case 'openModalInsert':
                        return tbw.buildInsert(opts.title, opts.fields, opts.callback);

                    // Selection
                    case 'saveSelection':
                        return tbw.saveSelection();
                    case 'getSelection':
                        return tbw.selection;
                    case 'getSelectedText':
                        return tbw.selection+'';
                    case 'restoreSelection':
                        return tbw.restoreSelection();

                    // Destroy
                    case 'destroy':
                        return tbw.destroy();

                    // Public options
                    case 'lang':
                        return tbw.lang;
                    case 'duration':
                        return tbw.o.duration;
                }
            } catch(e){}
        }
        return false;
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

        // Defaults Options
        this.o = $.extend(true, {
            lang: 'en',
            dir: 'ltr',
            duration: 200, // Duration of modal box animations

            mobile: false,
            tablet: true,
            closable: false,
            fullscreenable: true,
            fixedBtnPane: false,
            fixedFullWidth: false,
            semantic: false,
            resetCss: false,
            autogrow: false,

            prefix: 'trumbowyg-',

            convertLink: true,

            btns: ['viewHTML', 
                        '|', 'formatting',
                        '|', $.trumbowyg.btnsGrps.design,
                        '|', 'link', 
                        '|', 'insertImage',
                        '|', $.trumbowyg.btnsGrps.justify,
                        '|', $.trumbowyg.btnsGrps.lists,
                        '|', 'horizontalRule'],
            btnsAdd: [],

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
            btnsDef: {
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

                // Formatting flat
                p: {
                    func: 'formatBlock'
                },
                blockquote: {
                    func: 'formatBlock'
                },
                h1: {
                    func: 'formatBlock',
                    title: this.lang.header + ' 1'
                },
                h2: {
                    func: 'formatBlock',
                    title: this.lang.header + ' 2'
                },
                h3: {
                    func: 'formatBlock',
                    title: this.lang.header + ' 3'
                },
                h4: {
                    func: 'formatBlock',
                    title: this.lang.header + ' 4'
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

                horizontalRule: {
                    func: 'insertHorizontalRule'
                }
            }
        }, opts);

        if(this.o.semantic && !opts.btns){
            this.o.btns = [
                'viewHTML', 
                '|', 'formatting',
                '|', $.trumbowyg.btnsGrps.semantic,
                '|', 'link', 
                '|', 'insertImage',
                '|', $.trumbowyg.btnsGrps.justify,
                '|', $.trumbowyg.btnsGrps.lists,
                '|', 'horizontalRule'
            ];
        } else if(opts && opts.btns){
            this.o.btns = opts.btns;
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
            this.buildBtnPane();
            
            this.fixedBtnPaneEvents();

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
                'class': this.o.prefix + 'box ' + this.o.prefix + this.o.lang + ' trumbowyg'
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
                   .addClass(this.o.prefix + 'textarea');

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

            this.$editor.addClass(this.o.prefix + 'editor')
                        .attr('contenteditable', true)
                        .attr('dir', this.o.dir)
                        .html(html);

            if(this.o.resetCss)
                this.$editor.addClass(this.o.prefix + 'reset-css');

            if(!this.o.autogrow){
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
                var img = $(this);
                that.buildInsert(that.lang.insertImage, {
                    url: {
                        label: 'URL',
                        value: img.attr('src')
                    },
                    alt: {
                        label: 'Alt',
                        name: 'alt',
                        value: img.attr('alt')
                    }
                }, function(values){
                    img.attr('src', values['url']);
                    img.attr('alt', values['alt']);
                });
                return false;
            });
            this.$editor.on('mousedown', function(){
                that.sementicCode();
            });
            this.$editor.on('blur', function(){
                that.syncCode();
            });
        },


        // Build the Textarea which contain HTML generated code
        buildTextarea: function(){
            return $('<textarea name="'+this.$e.attr('id')+'"></textarea>', {
                height: this.height
            });
        },


        // Build button pane, use o.btns and o.btnsAdd options
        buildBtnPane: function(){
            if(this.o.btns === false) return;
            var pfx = this.o.prefix;

            this.$btnPane = $('<ul/>', {
                'class': pfx + 'button-pane'
            });

            $.each(this.o.btns.concat(this.o.btnsAdd), $.proxy(function(i, btn){
                // Managment of group of buttons
                try {
                    var b = btn.split('btnGrp-');
                    if(b[1] != undefined)
                        btn = $.trumbowyg.btnsGrps[b[1]];
                } catch(e){}

                if(!$.isArray(btn)) btn = [btn];
                $.each(btn, $.proxy(function(i, btn){
                    try { // Prevent buildBtn error
                        var li = $('<li/>');

                        if(btn == '|'){ // It's a separator
                            li.addClass(pfx + 'separator');
                        } else { // It's a button
                            if(btn == 'viewHTML')
                                li.addClass(pfx + 'not-disable');
                            li.append(this.buildBtn(btn));
                        }

                        this.$btnPane.append(li);
                    } catch(e){}
                }, this));
            }, this));


            // Build right li for fullscreen and close buttons
            var $liRight = $('<li/>', {
                'class': pfx + 'not-disable ' + pfx + 'buttons-right'
            });

            // Add the fullscreen button
            if(this.o.fullscreenable)
                $liRight.append(this.buildRightBtn('fullscreen').on('click', $.proxy(function(e){
                    var cssClass = pfx + 'fullscreen';
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
                        this.$btnPane.css('width', '100%');
                    } else {
                        $('body').css('overflow', 'auto');
                        this.$box.removeAttr('style');
                        if(!this.o.autogrow){
                            h = this.height;
                            $([this.$editor, this.$e]).each(function(){
                                $(this).css('height', h);
                            });
                        }
                    }
                    $(window).trigger('scroll');
                }, this)));

            // Build and add close button
            if(this.o.closable)
                $liRight.append(this.buildRightBtn('close').on('click', $.proxy(function(e){
                    var cssClass = pfx + 'fullscreen';
                    if(this.$box.hasClass(cssClass))
                        $('body').css('overflow', 'auto');
                    this.destroy();
                }, this)));


            // Add right li only if isn't empty
            if($liRight.not(':empty'))
                this.$btnPane.append($liRight);

            this.$box.prepend(this.$btnPane);
        },


        // Build a button and this action
        buildBtn: function(name){
            var btnDef = this.o.btnsDef[name];
            var that = this;
            var btn = $('<a/>', {
                href: 'javascript:void(null);',
                'class': this.o.prefix + name +'-button',
                text: btnDef.text || btnDef.title || this.lang[name] || name,
                title: btnDef.title || btnDef.text || this.lang[name] || name,
                mousedown: function(e){
                    if(!btnDef.dropdown || that.$box.find('.'+name+'-'+that.o.prefix + 'dropdown').is(':hidden'))
                        $('body').trigger('mousedown');

                    if(that.$btnPane.hasClass(that.o.prefix + 'disable') 
                        && !$(this).parent().hasClass(that.o.prefix + 'not-disable'))
                        return false;

                    that.execCommand((btnDef.dropdown ? 'dropdown' : '') || btnDef.func || name,
                                     btnDef.param || name);

                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            });



            if(btnDef.dropdown){
                btn.addClass(this.o.prefix + 'open-dropdown');
                var cssClass = this.o.prefix + 'dropdown'
                             + ' ' + this.o.prefix + 'fixed-top';

                var dropdown = $('<div/>', {
                    'class': name + '-' + cssClass + ' ' + cssClass
                });
                dropdown.data('visible', false);
                for(var subName in btnDef.dropdown){
                    if($.isObject(btnDef.dropdown[subName]))
                        dropdown.append(this.buildSubBtn(btnDef.dropdown, subName));
                }
                this.$box.append(dropdown.hide());
            }

            return btn;
        },
        // Build a button for dropdown menu
        buildSubBtn: function(dropdown, name){
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
        // Build a button for right li
        buildRightBtn: function(name){
            return $('<a/>', {
                href: 'javascript:void(null);',
                'class': this.o.prefix + name+'-button',
                title: this.lang[name],
                text: this.lang[name]
            });
        },

        // Build overlay for modal box
        buildOverlay: function(){
            return this.$overlay = $('<div/>', {
                'class': this.o.prefix + 'overlay'
            }).css({
                top: this.$btnPane.css('height'),
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

        // Management of fixed button pane
        fixedBtnPaneEvents: function(){
            if(!this.o.fixedBtnPane)
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
                        this.$btnPane.css({
                            position: 'fixed',
                            top: 0,
                            left: (this.o.fixedFullWidth) ? '0' : 'auto',
                            width: (this.o.fixedFullWidth) ? '100%' : this.$box.css('width'),
                            zIndex: 7
                        });
                        this.$editor.css({ marginTop: this.$btnPane.css('height') });
                        this.$e.css({ marginTop: this.$btnPane.css('height') });
                    }

                    $('.' + this.o.prefix + 'fixed-top', this.$box).css({
                        position: this.o.fixedFullWidth ? 'fixed' : 'absolute',
                        top: this.o.fixedFullWidth ? this.$btnPane.css('height') : parseInt(this.$btnPane.css('height').replace('px', '')) + (wScroll - offset) + 'px',
                        zIndex: 15
                    });
                } else if(this.isFixed) {
                    this.isFixed = false;
                    this.$btnPane.css({ position: 'relative' });
                    this.$editor.css({ marginTop: 0 });
                    this.$e.css({ marginTop: 0 });
                    $('.' + this.o.prefix + 'fixed-top', this.$box).css({
                        position: 'absolute',
                        top: this.$btnPane.css('height')
                    });
                }
            }, this));
        },




        destroy: function(){
            var html = this.getCode();

            if(this.isTextarea)
                this.$box.after(this.$e.css({height: this.height})
                                       .val(html)
                                       .removeClass(this.o.prefix + 'textarea')
                                       .show());
            else 
                this.$box.after(this.$editor.css({height: this.height})
                                            .removeClass(this.o.prefix + 'editor')
                                            .attr('contenteditable', false)
                                            .html(html)
                                            .show());

            this.$box.remove();
            this.$creator.removeData('trumbowyg');
        },



        // Function call when click on viewHTML button
        toggle: function(){
            this.sementicCode();
            this.$editor.toggle();
            this.$e.toggle();
            this.$btnPane.toggleClass(this.o.prefix + 'disable');
            this.$btnPane.find('.'+this.o.prefix + 'viewHTML-button').toggleClass(this.o.prefix + 'active');
        },

        // Open dropdown when click on a button which open that 
        dropdown: function(name){
            var $dropdown = this.$box.find('.'+name+'-'+this.o.prefix + 'dropdown');
            var $btn = this.$btnPane.find('.'+this.o.prefix+name+'-button');

            if($dropdown.is(':hidden')){
                $btn.addClass(this.o.prefix + 'active');

                $dropdown.css({
                    position: 'absolute',
                    top: this.$btnPane.css('height'),
                    left: (this.o.fixedFullWidth && this.isFixed) ? $btn.offset().left+'px' : ($btn.offset().left - this.$btnPane.offset().left)+'px'
                }).show();

                $(window).trigger('scroll');

                $('body').on('mousedown', $.proxy(function(e){
                    $('.' + this.o.prefix + 'dropdown').hide();
                    $('.' + this.o.prefix + 'active').removeClass(this.o.prefix + 'active');
                    $('body').off('mousedown');
                }, this));
            } else {
                $('body').trigger('mousedown');
            }
        },



        
        // HTML Code management
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

            if(this.o.autogrow){
                this.height = this.$editor.css('height');
                this.$e.css({height: this.height});
            }
        },

        // Analyse and update to semantic code
        sementicCode: function(){
            this.syncCode();

            if(this.o.semantic){
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


        // Function call when user click on « Insert Link... » dropdown menu
        createLink: function(){
            this.saveSelection();
            this.buildInsert(this.lang.createLink, {
                url: {
                    label: 'URL',
                    value: 'http://'
                },
                title: {
                    label: 'Title',
                    value: this.selection
                },
                text: {
                    label: 'Text',
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
                url: {
                    label: 'URL',
                    value: 'http://'
                },
                alt: {
                    label: 'Alt',
                    value: this.selection
                }
            }, 'insertImage');
        },


        /*
         * Call method of trumbowyg if exist
         * else try to call anonymous function
         * and finaly native execCommand
         */
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
                    if(cmd == 'insertHorizontalRule')
                        param = null;

                    document.execCommand(cmd, false, param);
                }
            }
            this.syncCode();
        },


        // Open a modal box
        openModal: function(title, content){
            var pfx = this.o.prefix;

            // No open a modal box when exist other modal box
            if($('.' + pfx + 'modal-box', this.$box).size() > 0)
                return false;

            this.saveSelection();
            this.showOverlay();

            // Disable all btnPane btns
            this.$btnPane.addClass(pfx + 'disable');
            $('.' + pfx + 'not-disable', this.$btnPane)
                .not('.' + pfx + 'buttons-right')
                .removeClass(pfx + 'not-disable')
                .addClass(pfx + 'not-disable-old');


            // Build out of ModalBox, it's the mask for animations
            var $modal = $('<div/>', {
                'class': pfx + 'modal ' + pfx + 'fixed-top'
            }).css({
                top: this.$btnPane.css('height')
            }).appendTo(this.$box);


            $e = this.$editor;

            // Build the form
            $form = $('<form/>', {
                action: 'javascript:void(null);',
                html: content
            }).on('submit', function(e){
                $modal.trigger(pfx + 'confirm');
                e.preventDefault();
            }).on('reset', function(e){
                $modal.trigger(pfx + 'cancel');
                e.preventDefault();
            });


            // Build ModalBox and animate to show them
            var $modalBox = $('<div/>', {
                'class': pfx + 'modal-box',
                html: $form
            })
            .css('top', '-' + $modal.css('height'))
            .appendTo($modal)
            .animate({ top: 0 }, this.o.duration);


            // Append title
            $('<span/>', {
                text: title,
                'class': pfx + 'modal-title'
            }).prependTo($modalBox);


            // Focus in modal box
            $modalBox.find('input:first').focus();


            // Append Cancel and Confirm buttons
            this.buildModalBtn('reset', $modalBox);
            this.buildModalBtn('submit', $modalBox);


            $('body').trigger('scroll');

            return $modal;
        },
        buildModalBtn: function(name, modal){
            return $('<input/>', {
                'class': this.o.prefix + 'modal-button ' + this.o.prefix + 'modal-' + name,
                value: this.lang[name] || name,
                type: name
            }).appendTo(modal.find('form'));
        },
        // close current modal box
        closeModal: function(){
            this.$btnPane.removeClass(this.o.prefix + 'disable');

            $('.' + this.o.prefix + 'not-disable-old', this.$btnPane)
                .removeClass(this.o.prefix + 'not-disable-old')
                .addClass(this.o.prefix + 'not-disable');

            that = this;
            $modalBox = $('.' + this.o.prefix + 'modal-box', this.$box);
            $modalBox.animate({
                top: '-' + $modalBox.css('height')
            }, this.o.duration, function(){
                $(this).parent().remove();
                that.hideOverlay();
            });
        },
        // Preformated build and management modal
        buildInsert: function(title, fields, cmd){
            var html = '';

            for(f in fields){
                if(fields[f].label == undefined)
                    fields[f].label = f.charAt(0).toUpperCase() + f.slice(1);

                if(fields[f].name == undefined)
                    fields[f].name = f;

                f = fields[f];
                html += '<label>'+f.label+' : <input type="text" name="'+f.name+'" value="'+ (f.value || '') +'"></label>';
            }

            var modBox = this.openModal(title, html);
            var that = this;

            modBox.on(this.o.prefix + 'confirm', function(){
                var $form = $(this).find('form');

                var values = {};
                for(f in fields)
                    values[f] = $('input[name="'+f+'"]', $form).val();
                
                if(values['url'] != null && values['url'] != undefined){
                    if(values['url'] != 'http://'){
                        that.restoreSelection();
                        if($.isString(cmd))
                            document.execCommand(cmd, false, values['url']);
                        else
                            cmd(values);

                        that.syncCode();
                        that.closeModal();
                        modBox.off(that.o.prefix + 'confirm');
                    } else {
                        $form.find('.error').remove();
                        $form.append('<span class="error">'+that.lang.urlInvalid+'</span>');
                    }
                }
            });
            modBox.one(this.o.prefix + 'cancel', function(){
                modBox.off(that.o.prefix + 'confirm');
                that.closeModal();
                that.restoreSelection();
            });
        },




        // Selection management
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
        


        // Return true if must enable Trumbowyg on this mobile device
        isEnabled: function(){
            var mobile = "iPhone|iPod|Android|BlackBerry|Windows\sPhone|ZuneWP7";
            var exprTablet = new RegExp("(iPad|webOS)");
            var exprMobile = new RegExp("("+mobile+")");

            return (this.o.tablet === true && exprTablet.test(navigator.userAgent))
                    || (this.o.mobile === true && exprMobile.test(navigator.userAgent));
        }
    };

    /* isObject */
    var toString = Object.prototype.toString, hasOwnProp = Object.prototype.hasOwnProperty;
    $.isObject = function(obj) { if(toString.call(obj) !== "[object Object]") return false; var key; for(key in obj){} return !key || hasOwnProp.call(obj, key); };
    $.isString = function(str){ return typeof(str) === 'string' };
})(jQuery);
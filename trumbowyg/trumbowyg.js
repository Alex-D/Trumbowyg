/* ===========================================================
 * trumbowyg.js v1.0
 * Core code of Trumbowyg plugin
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Alexandre Demode (Alex-D)
 *          Twitter : @AlexandreDemode
 *          Website : alex-d.fr
 */

$.trumbowyg = {
    langs: {
        en: {
            viewHTML:       "View HTML",

            formatting:     "Formatting",
            p:              "Paragraph",
            blockquote:     "Quote",
            code:           "Code",
            header:         "Header",

            bold:           "Bold",
            italic:         "Italic",
            strikethrough:  "Stroke",
            underline:      "Underline",

            strong:         "Strong",
            em:             "Emphasis",
            del:            "Deleted",

            unorderedList:  "Unordered list",
            orderedList:    "Ordered list",

            insertImage:    "Insert Image",
            insertVideo:    "Insert Video",
            link:           "Link",
            createLink:     "Insert link",
            unlink:         "Remove link",

            justifyLeft:    "Align Left",
            justifyCenter:  "Align Center",
            justifyRight:   "Align Right",
            justifyFull:    "Align Justify",

            horizontalRule: "Insert horizontal rule",

            fullscreen:     "fullscreen",

            close:          "Close",

            submit:         "Confirm",
            reset:          "Cancel",

            invalidUrl:     "Invalid URL",
            required:       "Required",
            description:    "Description",
            title:          "Title",
            text:           "Text"
        }
    },

    // User default options
    opts: {},

    btnsGrps: {
        design:     ['bold', 'italic', 'underline', 'strikethrough'],
        semantic:   ['strong', 'em', 'del'],
        justify:    ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
        lists:      ['unorderedList', 'orderedList']
    }
};



(function($){
    $.fn.trumbowyg = function(opts, params){
        if($.isObject(opts) || opts == null){
            return this.each(function(){
                if(!$(this).data('trumbowyg'))
                    $(this).data('trumbowyg', new Trumbowyg(this, opts));
            });
        } else if(this.length == 1){
            try {
                var t = $(this).data('trumbowyg');
                switch(opts){
                    // Modal box
                    case 'openModal':
                        return t.openModal(params.title, params.content);
                    case 'closeModal':
                        return t.closeModal();
                    case 'openModalInsert':
                        return t.openModalInsert(params.title, params.fields, params.callback);

                    // Selection
                    case 'saveSelection':
                        return t.saveSelection();
                    case 'getSelection':
                        return t.selection;
                    case 'getSelectedText':
                        return t.selection+'';
                    case 'restoreSelection':
                        return t.restoreSelection();

                    // Destroy
                    case 'destroy':
                        return t.destroy();

                    // Empty
                    case 'empty':
                        return t.empty();

                    // Public options
                    case 'lang':
                        return t.lang;
                    case 'duration':
                        return t.o.duration;

                    // HTML
                    case 'html':
                        return t.html(params);
                }
            } catch(e){}
        }

        return false;
    };



    var Trumbowyg = function(editorElem, opts){
        // jQuery object of the editor
        this.$e       = $(editorElem);
        this.$creator = $(editorElem);

        // Extend with options
        opts = $.extend(true, {}, opts, $.trumbowyg.opts);

        // Localization management
        if(typeof opts.lang === 'undefined' || typeof $.trumbowyg.langs[opts.lang] === 'undefined')
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
                del: {
                    func: 'strikethrough'
                },

                createLink: {},
                unlink: {},

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
                },

                // Dropdowns
                formatting: {
                    dropdown: ['p', 'blockquote', 'h1', 'h2', 'h3', 'h4']
                },
                link:       {
                    dropdown: ['createLink', 'unlink']
                }
            }
        }, opts);

        if(this.o.semantic && !opts.btns)
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
        else if(opts && opts.btns)
            this.o.btns = opts.btns;

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
            if(this.$e.is('textarea'))
                this.$editor = $('<div/>');
            else {
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
                $.each([this.$editor, this.$e], $.proxy(function(i, $el){
                    $el.css({
                        height: this.height,
                        overflow: 'auto'
                    });
                }, this));
            }

            if(this.o.semantic){
                this.$editor.html(
                    this.$editor.html()
                        .replace("<br>", "</p><p>")
                        .replace("&nsbp;", "")
                );
                this.semanticCode();
            }



            var that = this;
            this.$editor
            .on('dblclick', 'img', function(){
                var $img = $(this);
                that.openModalInsert(that.lang.insertImage, {
                    url: {
                        label: 'URL',
                        value: $img.attr('src'),
                        required: true
                    },
                    alt: {
                        label: 'description',
                        value: $img.attr('alt')
                    }
                }, function(values){
                    $img.attr('src', values['url']);
                    $img.attr('alt', values['alt']);
                });
                return false;
            })
            .on('keyup', function(e){
                that.semanticCode(false, e.which === 13);
            })
            .on('blur', function(){
                that.syncCode();
            });
        },


        // Build the Textarea which contain HTML generated code
        buildTextarea: function(){
            return $('<textarea/>', {
                'name': this.$e.attr('id'),
                'height': this.height
            });
        },


        // Build button pane, use o.btns and o.btnsAdd options
        buildBtnPane: function(){
            var t = this;
            if(t.o.btns === false) return;
            var pfx = t.o.prefix;

            t.$btnPane = $('<ul/>', {
                'class': pfx + 'button-pane'
            });

            $.each(t.o.btns.concat(t.o.btnsAdd), $.proxy(function(i, btn){
                // Managment of group of buttons
                try {
                    var b = btn.split('btnGrp-');
                    if(b[1] != undefined)
                        btn = $.trumbowyg.btnsGrps[b[1]];
                } catch(e){}

                if(!$.isArray(btn)) btn = [btn];
                $.each(btn, $.proxy(function(i, btn){
                    try { // Prevent buildBtn error
                        var $li = $('<li/>');

                        if(btn === '|') // It's a separator
                            $li.addClass(pfx + 'separator');
                        else if(t.isSupportedBtn(btn)){ // It's a supported button
                            if(btn === 'viewHTML')
                                $li.addClass(pfx + 'not-disable');
                            $li.append(t.buildBtn(btn));
                        }

                        t.$btnPane.append($li);
                    } catch(e){}
                }, t));
            }, t));


            // Build right li for fullscreen and close buttons
            var $liRight = $('<li/>', {
                'class': pfx + 'not-disable ' + pfx + 'buttons-right'
            });

            // Add the fullscreen button
            if(t.o.fullscreenable)
                $liRight
                    .append(t.buildRightBtn('fullscreen')
                    .on('click', $.proxy(function(e){
                        var cssClass = pfx + 'fullscreen';
                        t.$box.toggleClass(cssClass);

                        if(t.$box.hasClass(cssClass)){
                            $('body').css('overflow', 'hidden');
                            t.$box.css({
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                margin: 0,
                                padding: 0,
                                zIndex: 99999
                            });
                            $([t.$editor, t.$e]).each(function(){
                                $(this).css({
                                    height: '100%',
                                    overflow: 'auto'
                                });
                            });
                            t.$btnPane.css('width', '100%');
                        } else {
                            $('body').css('overflow', 'auto');
                            t.$box.removeAttr('style');
                            if(!t.o.autogrow){
                                h = t.height;
                                $([t.$editor, t.$e]).each(function(i, $el){
                                    $el.css('height', h);
                                });
                            }
                        }
                        $(window).trigger('scroll');
                    }, t)));

            // Build and add close button
            if(t.o.closable)
                $liRight
                    .append(t.buildRightBtn('close')
                    .on('click', $.proxy(function(e){
                        var cssClass = pfx + 'fullscreen';
                        if(t.$box.hasClass(cssClass))
                            $('body').css('overflow', 'auto');
                        t.destroy();
                    }, t)));


            // Add right li only if isn't empty
            if($liRight.not(':empty'))
                t.$btnPane.append($liRight);

            t.$box.prepend(t.$btnPane);
        },


        // Build a button and his action
        buildBtn: function(name){
            var pfx = this.o.prefix,
                btnDef = this.o.btnsDef[name],
                t = this,
                textDef = this.lang[name] || name.charAt(0).toUpperCase() + name.slice(1);

            var $btn = $('<button/>', {
                'type': 'button',
                'class': pfx + name +'-button' + (btnDef.ico ? ' '+ pfx + btnDef.ico +'-button' : ''),
                'text': btnDef.text || btnDef.title || textDef,
                'title': btnDef.title || btnDef.text || textDef,
                'mousedown': function(e){
                    if(!btnDef.dropdown || t.$box.find('.'+name+'-'+pfx + 'dropdown').is(':hidden'))
                        $('body').trigger('mousedown');

                    if(t.$btnPane.hasClass(pfx + 'disable')
                        && !$(this).parent().hasClass(pfx + 'not-disable'))
                        return false;

                    t.execCommand((btnDef.dropdown ? 'dropdown' : false) || btnDef.func || name,
                                     btnDef.param || name);

                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            });



            if(btnDef.dropdown){
                $btn.addClass(pfx + 'open-dropdown');
                var cssClass = pfx + 'dropdown';

                var dropdown = $('<div/>', {
                    'class': name + '-' + cssClass + ' ' + cssClass + ' ' + pfx + 'fixed-top'
                });
                for(var i = 0, c = btnDef.dropdown.length; i < c; i++){
                    if(t.o.btnsDef[btnDef.dropdown[i]] && t.isSupportedBtn(btnDef.dropdown[i]))
                        dropdown.append(t.buildSubBtn(btnDef.dropdown[i]));
                }
                this.$box.append(dropdown.hide());
            }

            return $btn;
        },
        // Build a button for dropdown menu
        buildSubBtn: function(name){
            var btnDef = this.o.btnsDef[name];
            return $('<button/>', {
                'type': 'button',
                'text': btnDef.text || btnDef.title || this.lang[name] || name,
                'mousedown': $.proxy(function(e){
                    $('body').trigger('mousedown');

                    this.execCommand(btnDef.func || name,
                                     btnDef.param || name);

                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }, this)
            });
        },
        // Build a button for right li
        buildRightBtn: function(name){
            return $('<button/>', {
                'type': 'button',
                'class': this.o.prefix + name+'-button',
                'title': this.lang[name],
                'text': this.lang[name]
            });
        },
        // Check if button is supported
        isSupportedBtn: function(btn){
            return typeof this.o.btnsDef[btn].isSupported !== 'function' || this.o.btnsDef[btn].isSupported()
        },

        // Build overlay for modal box
        buildOverlay: function(){
            return this.$overlay = $('<div/>', {
                'class': this.o.prefix + 'overlay'
            }).css({
                top: this.$btnPane.outerHeight(),
                height: (parseInt(this.$editor.outerHeight()) + 1) + 'px'
            }).appendTo(this.$box);
        },
        showOverlay: function(){
            $(window).trigger('scroll');
            this.$overlay.fadeIn(this.o.duration);
            this.$box.addClass(this.o.prefix + 'box-blur');
        },
        hideOverlay: function(){
            this.$overlay.fadeOut(this.o.duration/4);
            this.$box.removeClass(this.o.prefix + 'box-blur');
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

                var wScroll = $(window).scrollTop(),
                    offset = this.$box.offset().top + 1,
                    toFixed = (wScroll - offset > 0) && ((wScroll - offset - parseInt(this.height)) < 0);

                if(toFixed){
                    if(!this.isFixed){
                        this.isFixed = true;
                        this.$btnPane.css({
                            position: 'fixed',
                            top: 0,
                            left: (this.o.fixedFullWidth) ? '0' : 'auto',
                            width: (this.o.fixedFullWidth) ? '100%' : ((parseInt(this.$box.css('width'))-1) + 'px'),
                            zIndex: 7
                        });
                        this.$editor.css({ marginTop: this.$btnPane.css('height') });
                        this.$e.css({ marginTop: this.$btnPane.css('height') });
                    }

                    $('.' + this.o.prefix + 'fixed-top', this.$box).css({
                        position: this.o.fixedFullWidth ? 'fixed' : 'absolute',
                        top: this.o.fixedFullWidth ? this.$btnPane.outerHeight() : parseInt(this.$btnPane.outerHeight()) + (wScroll - offset) + 'px',
                        zIndex: 15
                    });
                } else if(this.isFixed) {
                    this.isFixed = false;
                    this.$btnPane.css({ position: 'relative' });
                    this.$editor.css({ marginTop: 0 });
                    this.$e.css({ marginTop: 0 });
                    $('.' + this.o.prefix + 'fixed-top', this.$box).css({
                        position: 'absolute',
                        top: this.$btnPane.outerHeight()
                    });
                }
            }, this));
        },



        // Destroy the editor
        destroy: function(){
            var html = this.html();

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



        // Empty the editor
        empty: function(){
            this.$e.val('');
            this.syncCode(true);
        },



        // Function call when click on viewHTML button
        toggle: function(){
            this.semanticCode(false, true);
            this.$editor.toggle();
            this.$e.toggle();
            this.$btnPane.toggleClass(this.o.prefix + 'disable');
            this.$btnPane.find('.'+this.o.prefix + 'viewHTML-button').toggleClass(this.o.prefix + 'active');
        },

        // Open dropdown when click on a button which open that
        dropdown: function(name){
            var pfx = this.o.prefix;
            var $dropdown = this.$box.find('.'+name+'-'+pfx + 'dropdown'),
                $btn = this.$btnPane.find('.'+pfx+name+'-button');

            if($dropdown.is(':hidden')){
                $btn.addClass(this.o.prefix + 'active');

                $dropdown.css({
                    position: 'absolute',
                    top: this.$btnPane.outerHeight(),
                    left: (this.o.fixedFullWidth && this.isFixed) ? $btn.offset().left+'px' : ($btn.offset().left - this.$btnPane.offset().left)+'px'
                }).show();

                $(window).trigger('scroll');

                $('body').on('mousedown', $.proxy(function(e){
                    $('.' + pfx + 'dropdown').hide();
                    $('.' + pfx + 'active').removeClass(pfx + 'active');
                    $('body').off('mousedown');
                }, this));
            } else {
                $('body').trigger('mousedown');
            }
        },




        // HTML Code management
        html: function(html){
            if(html){
                this.$e.val(html);
                this.syncCode(true);
                return tbw;
            } else
                return this.$e.val();
        },
        syncCode: function(force){
            if(!force && this.$editor.is(':visible'))
                this.$e.val(this.$editor.html());
            else
                this.$editor.html(this.$e.val());

            if(this.o.autogrow){
                this.height = this.$editor.css('height');
                this.$e.css({ height: this.height });
            }
        },

        // Analyse and update to semantic code
        // @param force : force to sync code from textarea
        // @param full  : wrap text nodes in <p>
        semanticCode: function(force, full){
            this.syncCode(force);

            if(this.o.semantic){
                this.semanticTag('b', 'strong');
                this.semanticTag('i', 'em');
                this.semanticTag('strike', 'del');

                if(full){
                    // Wrap text nodes in p
                    this.$editor.contents()
                    .filter(function(){
                        // Only non-empty text nodes
                        return this.nodeType === 3 && $.trim(this.nodeValue).length > 0;
                    }).wrap('<p></p>').end()

                    // Remove all br
                    .filter("br").remove();

                    this.saveSelection();
                    this.semanticTag('div', 'p');
                    this.restoreSelection();
                }

                this.$e.val(this.$editor.html());
            }
        },
        semanticTag: function(oldTag, newTag){
            $(oldTag, this.$editor).each(function(){
                $(this).replaceWith(function(){ return '<'+newTag+'>' + $(this).html() + '</'+newTag+'>'; });
            });
        },


        // Function call when user click on « Insert Link »
        createLink: function(){
            var that = this;
            this.saveSelection();
            this.openModalInsert(this.lang.createLink, {
                url: {
                    label: 'URL',
                    value: 'http://',
                    required: true
                },
                title: {
                    label: this.lang.title,
                    value: this.selection
                },
                text: {
                    label: this.lang.text,
                    value: this.selection
                }
            }, function(values){
                that.execCommand('createLink', values['url']);
                var link = $(['a[href="', values['url'], '"]:not([title])'].join(''), that.$box);
                if($.trim(values['text']).length !== 0)
                    link.text(values['text']);

                if($.trim(values['title']).length !== 0)
                    link.attr('title', values['title']);

                return true;
            });
        },
        insertImage: function(){
            var that = this;
            this.saveSelection();
            this.openModalInsert(this.lang.insertImage, {
                url: {
                    label: 'URL',
                    value: 'http://',
                    required: true
                },
                alt: {
                    label: 'description',
                    value: this.selection
                }
            }, function(values){
                that.execCommand('insertImage', values['url']);
                $(['img[src="', values['url'], '"]:not([alt])'].join(''), that.$box).attr('alt', values['alt']);
                return true;
            });
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
                    cmd(param, this);
                } catch(e){
                    this.$editor.focus();
                    if(cmd == 'insertHorizontalRule')
                        param = null;

                    document.execCommand(cmd, false, param);
                }
            }
            this.syncCode();
        },
        formatBlock: function(param){
            if($.browser.msie)
                param = '<' + param + '>';

            document.execCommand('formatBlock', false, param);
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
                top: (parseInt(this.$btnPane.css('height')) + 1) + 'px'
            }).appendTo(this.$box);

            // Click on overflay close modal by cancelling them
            this.$overlay.one('click', function(e){
                e.preventDefault();
                $modal.trigger(pfx + 'cancel');
            });


            $e = this.$editor;

            // Build the form
            $form = $('<form/>', {
                action: 'javascript:void(null);',
                html: content
            })
            .on('submit', function(e){
                e.preventDefault();
                $modal.trigger(pfx + 'confirm');
            })
            .on('reset', function(e){
                e.preventDefault();
                $modal.trigger(pfx + 'cancel');
            });


            // Build ModalBox and animate to show them
            var $modalBox = $('<div/>', {
                'class': pfx + 'modal-box',
                html: $form
            })
            .css({
                top:     '-' + parseInt(this.$btnPane.outerHeight()) + 'px',
                opacity: 0
            })
            .appendTo($modal)
            .animate({
                top:     0,
                opacity: 1
            }, this.o.duration / 2);


            // Append title
            $('<span/>', {
                text: title,
                'class': pfx + 'modal-title'
            }).prependTo($modalBox);


            // Focus in modal box
            $modalBox.find('input:first').focus();


            // Append Confirm and Cancel buttons
            this.buildModalBtn('submit', $modalBox);
            this.buildModalBtn('reset', $modalBox);


            $('body').trigger('scroll');

            return $modal;
        },
        buildModalBtn: function(name, modal){
            return $('<button/>', {
                'class': this.o.prefix + 'modal-button ' + this.o.prefix + 'modal-' + name,
                'type': name,
                'text': this.lang[name] || name
            }).appendTo(modal.find('form'));
        },
        // close current modal box
        closeModal: function(){
            var pfx = this.o.prefix;

            this.$btnPane.removeClass(pfx + 'disable');
            this.$overlay.off();

            $('.' + this.o.prefix + 'not-disable-old', this.$btnPane)
                .removeClass(pfx + 'not-disable-old')
                .addClass(pfx + 'not-disable');


            var that = this,
                $modalBox = $('.' + pfx + 'modal-box', this.$box);

            $modalBox.animate({
                top: '-' + $modalBox.css('height')
            }, this.o.duration/2, function(){
                $(this).parent().remove();
                that.hideOverlay();
            });
        },
        // Preformated build and management modal
        openModalInsert: function(title, fields, cmd){
            var html = '',
                pfx  = this.o.prefix;

            for(f in fields){
                var fd = fields[f];

                label = (fd.label == undefined)
                    ? (this.lang[f] ? this.lang[f] : f.charAt(0).toUpperCase() + f.slice(1))
                    : (this.lang[fd.label] ? this.lang[fd.label] : fd.label)
                ;

                if(fd.name == undefined)
                    fd.name = f;

                if(!fd.pattern && f == 'url'){
                    fd.pattern = /^(http|https):\/\/([\w~#!:.?+=&%@!\-\/]+)$/;
                    fd.patternError = this.lang.invalidUrl;
                }

                html += '<label><input type="'+(fd.type || 'text')+'" name="'+fd.name+'" value="'+(fd.value || '')+'"><span class="'+pfx+'input-infos"><span>'+label+'</span></span></label>';
            }

            var modBox = this.openModal(title, html),
                that = this;

            modBox
            .on(pfx + 'confirm', function(){
                var $form = $(this).find('form'),
                    valid  = true,
                    values = {};

                for(f in fields) {
                    var $field = $('input[name="'+f+'"]', $form);

                    values[f] = $field.val();

                    // Validate value
                    if(fields[f].required && (values[f] == null || values[f] == undefined || $.trim(values[f]) == "")) {
                        valid  = false;
                        that.addErrorOnModalField($field, that.lang.required);
                    } else if(fields[f].pattern && !fields[f].pattern.test(values[f])) {
                        valid  = false;
                        that.addErrorOnModalField($field, fields[f].patternError);
                    }
                }

                if(valid) {
                    that.restoreSelection();

                    if(cmd(values, fields)) {
                        that.syncCode();
                        that.closeModal();
                        modBox.off(pfx + 'confirm');
                    }
                }
            })
            .one(pfx + 'cancel', function(){
                modBox.off(pfx + 'confirm');
                that.closeModal();
                that.restoreSelection();
            });

            return modBox;
        },
        addErrorOnModalField: function($field, err){
            var $label = $field.parent(),
                pfx    = this.o.prefix;
            $label.addClass(pfx + 'input-error');
            $field.on('change keyup', function(){ $label.removeClass(pfx + 'input-error'); });
            $label.find('input+span').append('<span class="'+ pfx +'msg-error">'+ err +'</span>');
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
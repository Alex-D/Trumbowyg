/* ===========================================================
 * trumbowyg.js v1.0
 * Core code of Trumbowyg plugin
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Alexandre Demode (Alex-D)
 *          Twitter : @AlexandreDemode
 *          Website : alex-d.fr
 */

jQuery.trumbowyg = {
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
        if($.isObject(opts) || opts === null){
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
        var t = this;
        // jQuery object of the editor
        t.$e = $(editorElem);
        t.$creator = $(editorElem);

        // Extend with options
        opts = $.extend(true, {}, opts, $.trumbowyg.opts);

        // Localization management
        if(typeof opts.lang === 'undefined' || typeof $.trumbowyg.langs[opts.lang] === 'undefined')
            t.lang = $.trumbowyg.langs.en;
        else
            t.lang = $.extend(true, {}, $.trumbowyg.langs.en, $.trumbowyg.langs[opts.lang]);

        // Defaults Options
        t.o = $.extend(true, {
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
                    title: t.lang.header + ' 1'
                },
                h2: {
                    func: 'formatBlock',
                    title: t.lang.header + ' 2'
                },
                h3: {
                    func: 'formatBlock',
                    title: t.lang.header + ' 3'
                },
                h4: {
                    func: 'formatBlock',
                    title: t.lang.header + ' 4'
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

        if(t.o.semantic && !opts.btns)
            t.o.btns = [
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
            t.o.btns = opts.btns;

        t.init();
    };

    Trumbowyg.prototype = {
        init: function(){
            var t = this;
            t.height = t.$e.css('height');

            if(t.isEnabled()){
                t.buildEditor(true);
                return;
            }

            t.buildEditor();
            t.buildBtnPane();

            t.fixedBtnPaneEvents();

            t.buildOverlay();
        },

        buildEditor: function(disable){
            var t = this;
            var pfx = t.o.prefix;


            if(disable === true){
                if(!t.$e.is('textarea')){
                    var textarea = t.buildTextarea().val(t.$e.val());
                    t.$e.hide().after(textarea);
                }
                return;
            }


            t.$box = $('<div/>', {
                'class': pfx + 'box ' + pfx + t.o.lang + ' trumbowyg'
            });

            t.isTextarea = true;
            if(t.$e.is('textarea'))
                t.$editor = $('<div/>');
            else {
                t.$editor = t.$e;
                t.$e = t.buildTextarea().val(t.$e.val());
                t.isTextarea = false;
            }

            t.$e.hide()
                   .addClass(pfx + 'textarea');

            var html = '';
            if(t.isTextarea){
                html = t.$e.val();
                t.$box.insertAfter(t.$e)
                         .append(t.$editor)
                         .append(t.$e);
            } else {
                html = t.$editor.html();
                t.$box.insertAfter(t.$editor)
                         .append(t.$e)
                         .append(t.$editor);
                t.syncCode();
            }

            t.$editor.addClass(pfx + 'editor')
                        .attr('contenteditable', true)
                        .attr('dir', t.o.dir)
                        .html(html);

            if(t.o.resetCss)
                t.$editor.addClass(pfx + 'reset-css');

            if(!t.o.autogrow){
                $.each([t.$editor, t.$e], function(i, $el){
                    $el.css({
                        height: t.height,
                        overflow: 'auto'
                    });
                });
            }

            if(t.o.semantic){
                t.$editor.html(
                    t.$editor.html()
                        .replace('<br>', '</p><p>')
                        .replace('&nsbp;', '')
                );
                t.semanticCode();
            }



            t.$editor
            .on('dblclick', 'img', function(){
                var $img = $(this);
                t.openModalInsert(t.lang.insertImage, {
                    url: {
                        label: 'URL',
                        value: $img.attr('src'),
                        required: true
                    },
                    alt: {
                        label: 'description',
                        value: $img.attr('alt')
                    }
                }, function(v){
                    $img.attr('src', v.url);
                    $img.attr('alt', v.alt);
                });
                return false;
            })
            .on('keyup', function(e){
                t.semanticCode(false, e.which === 13);
            })
            .on('blur', function(){
                t.syncCode();
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
                    if(b[1] !== undefined)
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
                                $([t.$editor, t.$e]).each(function(i, $el){
                                    $el.css('height', t.height);
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
            var t = this;
            var pfx = t.o.prefix,
                btnDef = t.o.btnsDef[name],
                textDef = t.lang[name] || name.charAt(0).toUpperCase() + name.slice(1);

            var $btn = $('<button/>', {
                'type': 'button',
                'class': pfx + name +'-button' + (btnDef.ico ? ' '+ pfx + btnDef.ico +'-button' : ''),
                'text': btnDef.text || btnDef.title || textDef,
                'title': btnDef.title || btnDef.text || textDef,
                'mousedown': function(e){
                    if(!btnDef.dropdown || t.$box.find('.'+name+'-'+pfx + 'dropdown').is(':hidden'))
                        $('body').trigger('mousedown');

                    if(t.$btnPane.hasClass(pfx + 'disable') && !$(this).parent().hasClass(pfx + 'not-disable'))
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
                t.$box.append(dropdown.hide());
            }

            return $btn;
        },
        // Build a button for dropdown menu
        buildSubBtn: function(name){
            var t = this;
            var btnDef = t.o.btnsDef[name];
            return $('<button/>', {
                'type': 'button',
                'text': btnDef.text || btnDef.title || t.lang[name] || name,
                'mousedown': function(e){
                    $('body').trigger('mousedown');

                    t.execCommand(btnDef.func || name,
                                  btnDef.param || name);

                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
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
            return typeof this.o.btnsDef[btn].isSupported !== 'function' || this.o.btnsDef[btn].isSupported();
        },

        // Build overlay for modal box
        buildOverlay: function(){
            var t = this;
            t.$overlay = $('<div/>', {
                'class': t.o.prefix + 'overlay'
            }).css({
                top: t.$btnPane.outerHeight(),
                height: (parseInt(t.$editor.outerHeight()) + 1) + 'px'
            }).appendTo(t.$box);
            return t.$overlay;
        },
        showOverlay: function(){
            var t = this;
            $(window).trigger('scroll');
            t.$overlay.fadeIn(t.o.duration);
            t.$box.addClass(t.o.prefix + 'box-blur');
        },
        hideOverlay: function(){
            var t = this;
            t.$overlay.fadeOut(t.o.duration/4);
            t.$box.removeClass(t.o.prefix + 'box-blur');
        },

        // Management of fixed button pane
        fixedBtnPaneEvents: function(){
            var t = this;
            if(!t.o.fixedBtnPane)
                return;

            t.isFixed = false;

            $(window).on('scroll', function(e){
                if(!t.$box)
                    return;

                t.syncCode();

                var wScroll = $(window).scrollTop(),
                    offset = t.$box.offset().top + 1,
                    toFixed = (wScroll - offset > 0) && ((wScroll - offset - parseInt(t.height)) < 0);

                if(toFixed){
                    if(!t.isFixed){
                        t.isFixed = true;
                        t.$btnPane.css({
                            position: 'fixed',
                            top: 0,
                            left: (t.o.fixedFullWidth) ? '0' : 'auto',
                            width: (t.o.fixedFullWidth) ? '100%' : ((parseInt(t.$box.css('width'))-1) + 'px'),
                            zIndex: 7
                        });
                        t.$editor.css({ marginTop: t.$btnPane.css('height') });
                        t.$e.css({ marginTop: t.$btnPane.css('height') });
                    }

                    $('.' + t.o.prefix + 'fixed-top', t.$box).css({
                        position: t.o.fixedFullWidth ? 'fixed' : 'absolute',
                        top: t.o.fixedFullWidth ? t.$btnPane.outerHeight() : parseInt(t.$btnPane.outerHeight()) + (wScroll - offset) + 'px',
                        zIndex: 15
                    });
                } else if(t.isFixed) {
                    t.isFixed = false;
                    t.$btnPane.css({ position: 'relative' });
                    t.$editor.css({ marginTop: 0 });
                    t.$e.css({ marginTop: 0 });
                    $('.' + t.o.prefix + 'fixed-top', t.$box).css({
                        position: 'absolute',
                        top: t.$btnPane.outerHeight()
                    });
                }
            });
        },



        // Destroy the editor
        destroy: function(){
            var t = this;
            var html = t.html();

            if(t.isTextarea)
                t.$box.after(t.$e.css({height: t.height})
                                       .val(html)
                                       .removeClass(t.o.prefix + 'textarea')
                                       .show());
            else
                t.$box.after(t.$editor.css({height: t.height})
                                            .removeClass(t.o.prefix + 'editor')
                                            .attr('contenteditable', false)
                                            .html(html)
                                            .show());

            t.$box.remove();
            t.$creator.removeData('trumbowyg');
        },



        // Empty the editor
        empty: function(){
            this.$e.val('');
            this.syncCode(true);
        },



        // Function call when click on viewHTML button
        toggle: function(){
            var t = this;
            t.semanticCode(false, true);
            t.$editor.toggle();
            t.$e.toggle();
            t.$btnPane.toggleClass(t.o.prefix + 'disable');
            t.$btnPane.find('.'+t.o.prefix + 'viewHTML-button').toggleClass(t.o.prefix + 'active');
        },

        // Open dropdown when click on a button which open that
        dropdown: function(name){
            var t = this;
            var pfx = t.o.prefix;
            var $dropdown = t.$box.find('.'+name+'-'+pfx + 'dropdown'),
                $btn = t.$btnPane.find('.'+pfx+name+'-button');

            if($dropdown.is(':hidden')){
                $btn.addClass(t.o.prefix + 'active');

                $dropdown.css({
                    position: 'absolute',
                    top: t.$btnPane.outerHeight(),
                    left: (t.o.fixedFullWidth && t.isFixed) ? $btn.offset().left+'px' : ($btn.offset().left - this.$btnPane.offset().left)+'px'
                }).show();

                $(window).trigger('scroll');

                $('body').on('mousedown', function(e){
                    $('.' + pfx + 'dropdown').hide();
                    $('.' + pfx + 'active').removeClass(pfx + 'active');
                    $('body').off('mousedown');
                });
            } else {
                $('body').trigger('mousedown');
            }
        },




        // HTML Code management
        html: function(html){
            var t = this;
            if(html){
                t.$e.val(html);
                t.syncCode(true);
                return tbw;
            } else
                return t.$e.val();
        },
        syncCode: function(force){
            var t = this;
            if(!force && t.$editor.is(':visible'))
                t.$e.val(t.$editor.html());
            else
                t.$editor.html(t.$e.val());

            if(t.o.autogrow){
                t.height = t.$editor.css('height');
                t.$e.css({ height: t.height });
            }
        },

        // Analyse and update to semantic code
        // @param force : force to sync code from textarea
        // @param full  : wrap text nodes in <p>
        semanticCode: function(force, full){
            var t = this;
            t.syncCode(force);

            if(t.o.semantic){
                t.semanticTag('b', 'strong');
                t.semanticTag('i', 'em');
                t.semanticTag('strike', 'del');

                if(full){
                    // Wrap text nodes in p
                    t.$editor.contents()
                    .filter(function(){
                        // Only non-empty text nodes
                        return this.nodeType === 3 && $.trim(this.nodeValue).length > 0;
                    }).wrap('<p></p>').end()

                    // Remove all br
                    .filter('br').remove();

                    t.saveSelection();
                    t.semanticTag('div', 'p');
                    t.restoreSelection();
                }

                t.$e.val(t.$editor.html());
            }
        },
        semanticTag: function(oldTag, newTag){
            $(oldTag, this.$editor).each(function(){
                $(this).replaceWith(function(){ return '<'+newTag+'>' + $(this).html() + '</'+newTag+'>'; });
            });
        },


        // Function call when user click on « Insert Link »
        createLink: function(){
            var t = this;
            t.saveSelection();
            t.openModalInsert(t.lang.createLink, {
                url: {
                    label: 'URL',
                    value: 'http://',
                    required: true
                },
                title: {
                    label: t.lang.title,
                    value: t.selection
                },
                text: {
                    label: t.lang.text,
                    value: t.selection
                }
            }, function(values){
                t.execCommand('createLink', values.url);
                var link = $(['a[href="', values.url, '"]:not([title])'].join(''), t.$box);
                if($.trim(values.text).length !== 0)
                    link.text(values.text);

                if($.trim(values.title).length !== 0)
                    link.attr('title', values.title);

                return true;
            });
        },
        insertImage: function(){
            var t = this;
            t.saveSelection();
            t.openModalInsert(t.lang.insertImage, {
                url: {
                    label: 'URL',
                    value: 'http://',
                    required: true
                },
                alt: {
                    label: 'description',
                    value: t.selection
                }
            }, function(values){
                t.execCommand('insertImage', values.url);
                $(['img[src="', values.url, '"]:not([alt])'].join(''), t.$box).attr('alt', values.alt);
                return true;
            });
        },


        /*
         * Call method of trumbowyg if exist
         * else try to call anonymous function
         * and finaly native execCommand
         */
        execCommand: function(cmd, param){
            var t = this;
            if(cmd != 'dropdown')
                t.$editor.focus();

            try {
                t[cmd](param);
            } catch(e){
                try {
                    cmd(param, t);
                } catch(e2){
                    t.$editor.focus();
                    if(cmd == 'insertHorizontalRule')
                        param = null;

                    document.execCommand(cmd, false, param);
                }
            }
            t.syncCode();
        },
        formatBlock: function(param){
            if($.browser.msie)
                param = '<' + param + '>';

            document.execCommand('formatBlock', false, param);
        },


        // Open a modal box
        openModal: function(title, content){
            var t = this;
            var pfx = t.o.prefix;

            // No open a modal box when exist other modal box
            if($('.' + pfx + 'modal-box', t.$box).size() > 0)
                return false;

            t.saveSelection();
            t.showOverlay();

            // Disable all btnPane btns
            t.$btnPane.addClass(pfx + 'disable');
            $('.' + pfx + 'not-disable', t.$btnPane)
                .not('.' + pfx + 'buttons-right')
                .removeClass(pfx + 'not-disable')
                .addClass(pfx + 'not-disable-old');


            // Build out of ModalBox, it's the mask for animations
            var $modal = $('<div/>', {
                'class': pfx + 'modal ' + pfx + 'fixed-top'
            }).css({
                top: (parseInt(t.$btnPane.css('height')) + 1) + 'px'
            }).appendTo(t.$box);

            // Click on overflay close modal by cancelling them
            t.$overlay.one('click', function(e){
                e.preventDefault();
                $modal.trigger(pfx + 'cancel');
            });


            $e = t.$editor;

            // Build the form
            $form = $('<form/>', {
                action: '',
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
                'html': $form
            })
            .css({
                'top': '-' + parseInt(t.$btnPane.outerHeight()) + 'px',
                'opacity': 0
            })
            .appendTo($modal)
            .animate({
                'top': 0,
                'opacity': 1
            }, t.o.duration / 2);


            // Append title
            $('<span/>', {
                'text': title,
                'class': pfx + 'modal-title'
            }).prependTo($modalBox);


            // Focus in modal box
            $modalBox.find('input:first').focus();


            // Append Confirm and Cancel buttons
            t.buildModalBtn('submit', $modalBox);
            t.buildModalBtn('reset', $modalBox);


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
            var t = this;
            var pfx = t.o.prefix;

            t.$btnPane.removeClass(pfx + 'disable');
            t.$overlay.off();

            $('.' + t.o.prefix + 'not-disable-old', t.$btnPane)
                .removeClass(pfx + 'not-disable-old')
                .addClass(pfx + 'not-disable');


            var $modalBox = $('.' + pfx + 'modal-box', t.$box);

            $modalBox.animate({
                top: '-' + $modalBox.css('height')
            }, t.o.duration/2, function(){
                $(t).parent().remove();
                t.hideOverlay();
            });
        },
        // Preformated build and management modal
        openModalInsert: function(title, fields, cmd){
            var t = this;
            var html = '',
                pfx  = t.o.prefix;

            for(var f in fields){
                var fd = fields[f];

                if(fd.label === undefined)
                    label = (t.lang[f] ? t.lang[f] : f.charAt(0).toUpperCase() + f.slice(1));
                else
                    label = (t.lang[fd.label] ? t.lang[fd.label] : fd.label);

                if(fd.name === undefined)
                    fd.name = f;

                if(!fd.pattern && f === 'url'){
                    fd.pattern = /^(http|https):\/\/([\w~#!:.?+=&%@!\-\/]+)$/;
                    fd.patternError = t.lang.invalidUrl;
                }

                html += '<label><input type="'+(fd.type || 'text')+'" name="'+fd.name+'" value="'+(fd.value || '')+'"><span class="'+pfx+'input-infos"><span>'+label+'</span></span></label>';
            }

            var modBox = t.openModal(title, html);

            modBox
            .on(pfx + 'confirm', function(){
                var $form = $(this).find('form'),
                    valid = true,
                    values = {};

                for(var f in fields) {
                    var $field = $('input[name="'+f+'"]', $form);

                    values[f] = $field.val();

                    // Validate value
                    if(fields[f].required && (values[f] === null || values[f] === undefined || $.trim(values[f]) === '')) {
                        valid = false;
                        t.addErrorOnModalField($field, t.lang.required);
                    } else if(fields[f].pattern && !fields[f].pattern.test(values[f])) {
                        valid = false;
                        t.addErrorOnModalField($field, fields[f].patternError);
                    }
                }

                if(valid) {
                    t.restoreSelection();

                    if(cmd(values, fields)) {
                        t.syncCode();
                        t.closeModal();
                        modBox.off(pfx + 'confirm');
                    }
                }
            })
            .one(pfx + 'cancel', function(){
                modBox.off(pfx + 'confirm');
                t.closeModal();
                t.restoreSelection();
            });

            return modBox;
        },
        addErrorOnModalField: function($field, err){
            var $label = $field.parent(),
                pfx = this.o.prefix;
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
            var mobile = "iPhone|iPod|Android|BlackBerry|Windows Phone|ZuneWP7";
            var exprTablet = new RegExp("(iPad|webOS)");
            var exprMobile = new RegExp("("+mobile+")");

            return (this.o.tablet === true && exprTablet.test(navigator.userAgent)) || (this.o.mobile === true && exprMobile.test(navigator.userAgent));
        }
    };

    /* isObject */
    var toString = Object.prototype.toString, hasOwnProp = Object.prototype.hasOwnProperty;
    $.isObject = function(obj) { if(toString.call(obj) !== "[object Object]") return false; var key; for(key in obj){} return !key || hasOwnProp.call(obj, key); };
    $.isString = function(str){ return typeof(str) === 'string'; };
})(jQuery);
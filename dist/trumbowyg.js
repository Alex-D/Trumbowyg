/**
 * Trumbowyg v2.0.0-beta.7 - A lightweight WYSIWYG editor
 * Trumbowyg core file
 * ------------------------
 * @link http://alex-d.github.io/Trumbowyg
 * @license MIT
 * @author Alexandre Demode (Alex-D)
 *         Twitter : @AlexandreDemode
 *         Website : alex-d.fr
 */

jQuery.trumbowyg = {
    langs: {
        en: {
            viewHTML: 'View HTML',

            formatting: 'Formatting',
            p: 'Paragraph',
            blockquote: 'Quote',
            code: 'Code',
            header: 'Header',

            bold: 'Bold',
            italic: 'Italic',
            strikethrough: 'Stroke',
            underline: 'Underline',

            strong: 'Strong',
            em: 'Emphasis',
            del: 'Deleted',

            unorderedList: 'Unordered list',
            orderedList: 'Ordered list',

            insertImage: 'Insert Image',
            insertVideo: 'Insert Video',
            link: 'Link',
            createLink: 'Insert link',
            unlink: 'Remove link',

            justifyLeft: 'Align Left',
            justifyCenter: 'Align Center',
            justifyRight: 'Align Right',
            justifyFull: 'Align Justify',

            horizontalRule: 'Insert horizontal rule',
            removeformat: 'Remove format',

            fullscreen: 'Fullscreen',

            close: 'Close',

            submit: 'Confirm',
            reset: 'Cancel',

            required: 'Required',
            description: 'Description',
            title: 'Title',
            text: 'Text',
            target: 'Target'
        }
    },

    // User default options
    opts: {},

    btnsGrps: {
        design: ['bold', 'italic', 'underline', 'strikethrough'],
        semantic: ['strong', 'em', 'del'],
        justify: ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
        lists: ['unorderedList', 'orderedList']
    }
};


(function (navigator, window, document, $) {
    'use strict';

    // @param : o are options
    // @param : p are params
    $.fn.trumbowyg = function (options, params) {
        var trumbowygDataName = 'trumbowyg';
        if (options === Object(options) || !options) {
            return this.each(function () {
                if (!$(this).data(trumbowygDataName)) {
                    $(this).data(trumbowygDataName, new Trumbowyg(this, options));
                }
            });
        }
        if (this.length === 1) {
            try {
                var t = $(this).data(trumbowygDataName);
                switch (options) {
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
                        return t.getSelectedText();
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

                    // HTML
                    case 'html':
                        return t.html(params);
                }
            } catch (c) {
            }
        }

        return false;
    };

    // @param : editorElem is the DOM element
    // @param : o are options
    var Trumbowyg = function (editorElem, o) {
        var t = this;
        // Get the document of the element. It use to makes the plugin
        // compatible on iframes.
        t.doc = editorElem.ownerDocument || document;
        // jQuery object of the editor
        t.$ta = $(editorElem); // $ta : Textarea
        t.$c = $(editorElem); // $c : creator

        // Extend with options
        o = $.extend(true, {}, o, $.trumbowyg.opts);

        // Localization management
        if (o.lang != null || $.trumbowyg.langs[o.lang] != null) {
            t.lang = $.extend(true, {}, $.trumbowyg.langs.en, $.trumbowyg.langs[o.lang]);
        } else {
            t.lang = $.trumbowyg.langs.en;
        }

        // Header translation
        var h = t.lang.header;

        // Defaults Options
        t.o = $.extend(true, {}, {
            lang: 'en',

            closable: false,
            fullscreenable: true,
            fixedBtnPane: false,
            fixedFullWidth: false,
            autogrow: false,

            prefix: 'trumbowyg-',

            // WYSIWYG only
            semantic: true,
            resetCss: false,
            removeformatPasted: false,
            tagsToRemove: [],

            btns: [
                'viewHTML',
                '|', 'formatting',
                '|', 'btnGrp-design',
                '|', 'link',
                '|', 'insertImage',
                '|', 'btnGrp-justify',
                '|', 'btnGrp-lists',
                '|', 'horizontalRule',
                '|', 'removeformat'
            ],
            btnsAdd: [],

            /**
             * When the button is associated to a empty object
             * fn and title attributs are defined from the button key value
             *
             * For example
             *      foo: {}
             * is equivalent to :
             *      foo: {
             *          fn: 'foo',
             *          title: this.lang.foo
             *      }
             */
            btnsDef: {
                viewHTML: {
                    fn: 'toggle'
                },

                p: {
                    fn: 'formatBlock'
                },
                blockquote: {
                    fn: 'formatBlock'
                },
                h1: {
                    fn: 'formatBlock',
                    title: h + ' 1'
                },
                h2: {
                    fn: 'formatBlock',
                    title: h + ' 2'
                },
                h3: {
                    fn: 'formatBlock',
                    title: h + ' 3'
                },
                h4: {
                    fn: 'formatBlock',
                    title: h + ' 4'
                },

                bold: {
                    key: 'B'
                },
                italic: {
                    key: 'I'
                },
                underline: {},
                strikethrough: {},

                strong: {
                    fn: 'bold',
                    key: 'B'
                },
                em: {
                    fn: 'italic',
                    key: 'I'
                },
                del: {
                    fn: 'strikethrough'
                },

                createLink: {
                    key: 'K'
                },
                unlink: {},

                insertImage: {},

                justifyLeft: {},
                justifyCenter: {},
                justifyRight: {},
                justifyFull: {},

                unorderedList: {
                    fn: 'insertUnorderedList'
                },
                orderedList: {
                    fn: 'insertOrderedList'
                },

                horizontalRule: {
                    fn: 'insertHorizontalRule'
                },

                removeformat: {},

                // Dropdowns
                formatting: {
                    dropdown: ['p', 'blockquote', 'h1', 'h2', 'h3', 'h4']
                },
                link: {
                    dropdown: ['createLink', 'unlink']
                }
            },

            inlineElementsSelector: 'a,abbr,acronym,b,caption,cite,code,col,dfn,dir,dt,dd,em,font,hr,i,kbd,li,q,span,strikeout,strong,sub,sup,u',

            pasteHandler: function () {
            }
        }, o);

        if (o.btns) {
            t.o.btns = o.btns;
        } else if (t.o.semantic) {
            t.o.btns[4] = 'btnGrp-semantic';
        }

        // Keyboard shortcuts are load in this array
        t.keys = [];

        t.init();
    };

    Trumbowyg.prototype = {
        init: function () {
            var t = this;
            t.height = t.$ta.height();

            t.buildEditor();
            t.buildBtnPane();

            t.fixedBtnPaneEvents();

            t.buildOverlay();
        },

        buildEditor: function () {
            var t = this,
                prefix = t.o.prefix,
                html = '';

            t.$box = $('<div/>', {
                class: prefix + 'box ' + prefix + 'editor-visible ' + prefix + t.o.lang + ' trumbowyg'
            });

            // $ta = Textarea
            // $ed = Editor
            t.isTextarea = t.$ta.is('textarea');
            if (t.isTextarea) {
                html = t.$ta.val();
                t.$ed = $('<div/>');
                t.$box
                    .insertAfter(t.$ta)
                    .append(t.$ed, t.$ta);
            } else {
                t.$ed = t.$ta;
                html = t.$ed.html();

                t.$ta = $('<textarea/>', {
                    name: t.$ta.attr('id'),
                    height: t.height
                }).val(html);

                t.$box
                    .insertAfter(t.$ed)
                    .append(t.$ta, t.$ed);
                t.syncCode();
            }

            t.$ta
                .addClass(prefix + 'textarea')
                .attr('tabindex', -1)
            ;

            t.$ed
                .addClass(prefix + 'editor')
                .attr({
                    contenteditable: true,
                    dir: t.lang._dir || 'ltr'
                })
                .html(html)
            ;

            if (t.o.tabindex) {
                t.$ed.attr('tabindex', t.o.tabindex);
            }

            if (t.$c.is('[placeholder]')) {
                t.$ed.attr('placeholder', t.$c.attr('placeholder'));
            }

            if (t.o.resetCss) {
                t.$ed.addClass(prefix + 'reset-css');
            }

            if (!t.o.autogrow) {
                t.$ta.add(t.$ed).css({
                    height: t.height
                });
            }

            t.semanticCode();


            t._ctrl = false;
            t.$ed
                .on('dblclick', 'img', function () {
                    var $img = $(this);
                    t.openModalInsert(t.lang.insertImage, {
                        url: {
                            label: 'URL',
                            value: $img.attr('src'),
                            required: true
                        },
                        alt: {
                            label: t.lang.description,
                            value: $img.attr('alt')
                        }
                    }, function (v) {
                        return $img.attr({
                            src: v.url,
                            alt: v.alt
                        });
                    });
                    return false;
                })
                .on('keydown', function (e) {
                    t._composition = (e.which === 229);

                    if (e.ctrlKey) {
                        t._ctrl = true;
                        var k = t.keys[String.fromCharCode(e.which).toUpperCase()];

                        try {
                            t.execCmd(k.fn, k.param);
                            return false;
                        } catch (c) {
                        }
                    }
                })
                .on('keyup', function (e) {
                    if (e.which >= 37 && e.which <= 40) {
                        return;
                    }

                    if (e.ctrlKey && (e.which === 89 || e.which === 90)) {
                        t.$c.trigger('tbwchange');
                    } else if (!t._ctrl && e.which !== 17 && !t._composition) {
                        t.semanticCode(false, e.which === 13);
                        t.$c.trigger('tbwchange');
                    }

                    setTimeout(function () {
                        t._ctrl = false;
                    }, 200);
                })
                .on('focus blur', function (e) {
                    t.$c.trigger('tbw' + e.type);
                })
                .on('cut', function () {
                    t.$c.trigger('tbwchange');
                })
                .on('paste', function (e) {
                    if (t.o.removeformatPasted) {
                        e.preventDefault();

                        try {
                            // IE
                            var text = window.clipboardData.getData('Text');

                            try {
                                // <= IE10
                                t.doc.selection.createRange().pasteHTML(text);
                            } catch (c) {
                                // IE 11
                                t.doc.getSelection().getRangeAt(0).insertNode(t.doc.createTextNode(text));
                            }
                        } catch (d) {
                            // Not IE
                            t.execCmd('insertText', (e.originalEvent || e).clipboardData.getData('text/plain'));
                        }
                    }

                    t.o.pasteHandler(e, t);

                    setTimeout(function () {
                        if (t.o.semantic) {
                            t.semanticCode(false, true);
                        } else {
                            t.syncCode();
                        }
                        t.$c.trigger('tbwpaste', e);
                    }, 0);
                });
            t.$ta.on('keyup paste', function () {
                t.$c.trigger('tbwchange');
            });

            $(t.doc).on('keydown', function (e) {
                if (e.which === 27) {
                    t.closeModal();
                    return false;
                }
            });
        },


        // Build button pane, use o.btns and o.btnsAdd options
        buildBtnPane: function () {
            var t = this,
                prefix = t.o.prefix;

            if (t.o.btns === false) {
                return;
            }

            var $btnPane = t.$btnPane = $('<ul/>', {
                class: prefix + 'button-pane'
            });

            $.each(t.o.btns.concat(t.o.btnsAdd), function (i, btn) {
                // Managment of group of buttons
                try {
                    var b = btn.split('btnGrp-');
                    if (b[1] != null) {
                        btn = $.trumbowyg.btnsGrps[b[1]];
                    }
                } catch (c) {
                }

                if (!$.isArray(btn)) {
                    btn = [btn];
                }

                $.each(btn, function (i, b) {
                    try { // Prevent buildBtn error
                        var $li = $('<li/>');

                        if (b === '|') { // It's a separator
                            $li.addClass(prefix + 'separator');
                        } else if (t.isSupportedBtn(b)) { // It's a supported button
                            $li.append(t.buildBtn(b));
                        }

                        $btnPane.append($li);
                    } catch (c) {
                    }
                });
            });

            // Build right li for fullscreen and close buttons
            var $liRight = $('<li/>', {
                class: prefix + 'not-disable ' + prefix + 'buttons-right'
            });

            // Add the fullscreen button
            var fullscreenCssClass = prefix + 'fullscreen';
            if (t.o.fullscreenable) {
                $liRight.append(
                    t.buildRightBtn('fullscreen')
                        .on('click', function () {
                            t.$box.toggleClass(fullscreenCssClass);
                            $('body').toggleClass(prefix + 'body-fullscreen', t.$box.hasClass(fullscreenCssClass));
                            $(window).trigger('scroll');
                        })
                );
            }

            // Build and add close button
            if (t.o.closable) {
                $liRight
                    .append(
                        t.buildRightBtn('close')
                            .on('click', function () {
                                t.$box.removeClass(fullscreenCssClass);
                                t.destroy();
                                t.$c.trigger('tbwclose');
                            })
                    );
            }


            // Add right li only if isn't empty
            if ($liRight.not(':empty')) {
                $btnPane.append($liRight);
            }

            t.$box.prepend($btnPane);
        },


        // Build a button and his action
        buildBtn: function (btnName) { // btnName is name of the button
            var t = this,
                prefix = t.o.prefix,
                btn = t.o.btnsDef[btnName],
                d = btn.dropdown,
                textDef = t.lang[btnName] || btnName,

                $btn = $('<button/>', {
                    type: 'button',
                    class: prefix + btnName + '-button' + (btn.ico ? ' ' + prefix + btn.ico + '-button' : '') + (btn.class || ''),
                    text: btn.text || btn.title || textDef,
                    title: (btn.title || btn.text || textDef) + ((btn.key) ? ' (Ctrl + ' + btn.key + ')' : ''),
                    tabindex: -1,
                    mousedown: function () {
                        if (!d || $('.' + btnName + '-' + prefix + 'dropdown', t.$box).is(':hidden')) {
                            $('body', t.doc).trigger('mousedown');
                        }

                        if (t.$btnPane.hasClass(prefix + 'disable') && !$(this).hasClass(prefix + 'active') && !$(this).parent().hasClass(prefix + 'not-disable')) {
                            return false;
                        }

                        t.execCmd((d ? 'dropdown' : false) || btn.fn || btnName, btn.param || btnName);

                        return false;
                    }
                });

            if (d) {
                $btn.addClass(prefix + 'open-dropdown');
                var c = prefix + 'dropdown',
                    dd = $('<div/>', { // the dropdown
                        class: btnName + '-' + c + ' ' + c + ' ' + prefix + 'fixed-top'
                    });
                $.each(d, function (i, def) {
                    if (t.o.btnsDef[def] && t.isSupportedBtn(def)) {
                        dd.append(t.buildSubBtn(def));
                    }
                });
                t.$box.append(dd.hide());
            } else if (btn.key) {
                t.keys[btn.key] = {
                    fn: btn.fn || btnName,
                    param: btn.param || btnName
                };
            }

            return $btn;
        },
        // Build a button for dropdown menu
        // @param n : name of the subbutton
        buildSubBtn: function (n) {
            var t = this,
                prefix = t.o.prefix,
                b = t.o.btnsDef[n];

            if (b.key) {
                t.keys[b.key] = {
                    fn: b.fn || n,
                    param: b.param || n
                };
            }

            return $('<button/>', {
                type: 'button',
                class: prefix + n + '-dropdown-button' + (b.ico ? ' ' + prefix + b.ico + '-button' : ''),
                text: b.text || b.title || t.lang[n] || n,
                title: ((b.key) ? ' (Ctrl + ' + b.key + ')' : null),
                style: b.style || null,
                mousedown: function () {
                    $('body', t.doc).trigger('mousedown');

                    t.execCmd(b.fn || n, b.param || n);

                    return false;
                }
            });
        },
        // Build a button for right li
        // @param n : name of the right button
        buildRightBtn: function (n) {
            return $('<button/>', {
                type: 'button',
                class: this.o.prefix + n + '-button',
                title: this.lang[n],
                tabindex: -1
            });
        },
        // Check if button is supported
        isSupportedBtn: function (b) {
            try {
                return this.o.btnsDef[b].isSupported();
            } catch (c) {
            }
            return true;
        },

        // Build overlay for modal box
        buildOverlay: function () {
            var t = this;
            t.$overlay = $('<div/>', {
                class: t.o.prefix + 'overlay'
            }).css({
                top: t.$btnPane.outerHeight(),
                height: (t.$ed.outerHeight() + 1) + 'px'
            }).appendTo(t.$box);
            return t.$overlay;
        },
        showOverlay: function () {
            var t = this;
            $(window).trigger('scroll');
            t.$overlay.fadeIn(200);
            t.$box.addClass(t.o.prefix + 'box-blur');
        },
        hideOverlay: function () {
            var t = this;
            t.$overlay.fadeOut(50);
            t.$box.removeClass(t.o.prefix + 'box-blur');
        },

        // Management of fixed button pane
        fixedBtnPaneEvents: function () {
            var t = this,
                fixedFullWidth = t.o.fixedFullWidth,
                box = t.$box;

            if (!t.o.fixedBtnPane) {
                return;
            }

            t.isFixed = false;

            $(window)
                .on('scroll resize', function () {
                    if (!box) {
                        return;
                    }

                    t.syncCode();

                    var scrollTop = $(window).scrollTop(),
                        offset = box.offset().top + 1,
                        bp = t.$btnPane,
                        oh = bp.outerHeight();

                    if ((scrollTop - offset > 0) && ((scrollTop - offset - t.height) < 0)) {
                        if (!t.isFixed) {
                            t.isFixed = true;
                            bp.css({
                                position: 'fixed',
                                top: 0,
                                left: fixedFullWidth ? '0' : 'auto',
                                zIndex: 7
                            });
                            $([t.$ta, t.$ed]).css({marginTop: bp.height()});
                        }
                        bp.css({
                            width: fixedFullWidth ? '100%' : ((box.width() - 1) + 'px')
                        });

                        $('.' + t.o.prefix + 'fixed-top', box).css({
                            position: fixedFullWidth ? 'fixed' : 'absolute',
                            top: fixedFullWidth ? oh : oh + (scrollTop - offset) + 'px',
                            zIndex: 15
                        });
                    } else if (t.isFixed) {
                        t.isFixed = false;
                        bp.removeAttr('style');
                        $([t.$ta, t.$ed]).css({marginTop: 0});
                        $('.' + t.o.prefix + 'fixed-top', box).css({
                            position: 'absolute',
                            top: oh
                        });
                    }
                });
        },


        // Destroy the editor
        destroy: function () {
            var t = this,
                prefix = t.o.prefix,
                height = t.height;

            if (t.isTextarea) {
                t.$box.after(
                    t.$ta
                        .css({height: height})
                        .val(t.html())
                        .removeClass(prefix + 'textarea')
                        .show()
                );
            } else {
                t.$box.after(
                    t.$ed
                        .css({height: height})
                        .removeClass(prefix + 'editor')
                        .removeAttr('contenteditable')
                        .html(t.html())
                        .show()
                );
            }

            t.$box.remove();
            t.$c.removeData('trumbowyg');
        },


        // Empty the editor
        empty: function () {
            this.$ta.val('');
            this.syncCode(true);
        },


        // Function call when click on viewHTML button
        toggle: function () {
            var t = this,
                prefix = t.o.prefix;
            t.semanticCode(false, true);
            setTimeout(function () {
                t.$box.toggleClass(prefix + 'editor-hidden ' + prefix + 'editor-visible');
                t.$btnPane.toggleClass(prefix + 'disable');
                $('.' + prefix + 'viewHTML-button', t.$btnPane).toggleClass(prefix + 'active');
                if (t.$box.hasClass(prefix + 'editor-visible')) {
                    t.$ta.attr('tabindex', -1);
                } else {
                    t.$ta.removeAttr('tabindex');
                }
            }, 0);
        },

        // Open dropdown when click on a button which open that
        dropdown: function (name) {
            var t = this,
                d = t.doc,
                prefix = t.o.prefix,
                $dd = $('.' + name + '-' + prefix + 'dropdown', t.$box),
                $btn = $('.' + prefix + name + '-button', t.$btnPane);

            if ($dd.is(':hidden')) {
                var o = $btn.offset().left;
                $btn.addClass(prefix + 'active');

                $dd.css({
                    position: 'absolute',
                    top: t.$btnPane.outerHeight(),
                    left: (t.o.fixedFullWidth && t.isFixed) ? o + 'px' : (o - t.$btnPane.offset().left) + 'px'
                }).show();

                $(window).trigger('scroll');

                $('body', d).on('mousedown', function () {
                    $('.' + prefix + 'dropdown', d).hide();
                    $('.' + prefix + 'active', d).removeClass(prefix + 'active');
                    $('body', d).off('mousedown');
                });
            } else {
                $('body', d).trigger('mousedown');
            }
        },


        // HTML Code management
        html: function (html) {
            var t = this;
            if (html) {
                t.$ta.val(html);
                t.syncCode(true);
                return t;
            }
            return t.$ta.val();
        },
        syncCode: function (force) {
            var t = this;
            if (!force && t.$ed.is(':visible')) {
                t.$ta.val(t.$ed.html());
            } else {
                t.$ed.html(t.$ta.val());
            }

            if (t.o.autogrow) {
                t.height = t.$ed.height();
                if (t.height !== t.$ta.css('height')) {
                    t.$ta.css({height: t.height});
                    t.$c.trigger('tbwresize');
                }
            }
        },

        // Analyse and update to semantic code
        // @param force : force to sync code from textarea
        // @param full  : wrap text nodes in <p>
        semanticCode: function (force, full) {
            var t = this;
            t.saveSelection();
            t.syncCode(force);

            if (t.o.tagsToRemove.length > 0) {
                $(t.o.tagsToRemove.join(', '), t.$ed).remove();
            }

            if (t.o.semantic) {
                t.semanticTag('b', 'strong');
                t.semanticTag('i', 'em');
                t.semanticTag('strike', 'del');

                if (full) {
                    var inlineElementsSelector = t.o.inlineElementsSelector,
                        blockElementsSelector = ':not(' + t.o.inlineElementsSelector + ')';

                    // Wrap text nodes in span for easier processing
                    t.$ed.contents().filter(function () {
                        return this.nodeType === 3 && $.trim(this.nodeValue).length > 0;
                    }).wrap('<span data-tbw/>');

                    // Wrap groups of inline elements in paragraphs (recursive)
                    var wrapInlinesInParagraphsFrom = function ($from) {
                        if ($from.length !== 0) {
                            var $finalParagraph = $from.nextUntil(blockElementsSelector).andSelf()
                                .wrapAll('<p/>').parent();

                            $finalParagraph.next('br').remove();

                            var $nextElement = $finalParagraph.nextAll(inlineElementsSelector).first();
                            if ($nextElement.length) {
                                wrapInlinesInParagraphsFrom($nextElement);
                            }
                        }
                    };
                    wrapInlinesInParagraphsFrom(t.$ed.children(inlineElementsSelector).first());

                    t.semanticTag('div', 'p', true);

                    // Unwrap paragraphs content, containing nothing usefull
                    t.$ed.find('p').filter(function () {
                        if (t.selection && this === t.selection.startContainer) {
                            // Don't remove currently being edited element
                            return false;
                        }
                        return $(this).text().trim().length === 0 && $(this).children().not('br,span').length === 0;
                    }).contents().unwrap();

                    // Get rid of temporial span's
                    $('[data-tbw]', t.$ed).contents().unwrap();

                    // Replace empty <p> with <br> (IE loves adding empty <p>)
                    t.$ed.find('p:empty').replaceWith('<br/>');
                }

                t.restoreSelection();

                t.$ta.val(t.$ed.html());
            }
        },

        semanticTag: function (oldTag, newTag, copyAttributes) {
            $(oldTag, this.$ed).each(function () {
                var $oldTag = $(this);
                $oldTag.wrap('<' + newTag + '/>');
                if (copyAttributes) {
                    $.each($oldTag.prop('attributes'), function () {
                        $oldTag.parent().attr(this.name, this.value);
                    });
                }
                $oldTag.contents().unwrap();
            });
        },

        // Function call when user click on "Insert Link"
        createLink: function () {
            var t = this,
                documentSelection = t.doc.getSelection(),
                node = documentSelection.focusNode,
                url,
                title,
                target;

            while (['A', 'DIV'].indexOf(node.nodeName) < 0) {
                node = node.parentNode;
            }

            if (node && node.nodeName === 'A') {
                var $a = $(node);
                url = $a.attr('href');
                title = $a.attr('title');
                target = $a.attr('target');
                var range = t.doc.createRange();
                range.selectNode(node);
                documentSelection.addRange(range);
            }

            t.saveSelection();

            t.openModalInsert(t.lang.createLink, {
                url: {
                    label: 'URL',
                    required: true,
                    value: url
                },
                title: {
                    label: t.lang.title,
                    value: title
                },
                text: {
                    label: t.lang.text,
                    value: t.getSelectedText()
                },
                target: {
                    label: t.lang.target,
                    value: target
                }
            }, function (v) { // v is value
                var link = $(['<a href="', v.url, '">', v.text, '</a>'].join(''));
                if (v.title.length > 0) {
                    link.attr('title', v.title);
                }
                if (v.target.length > 0) {
                    link.attr('target', v.target);
                }
                t.selection.deleteContents();
                t.selection.insertNode(link[0]);
                return true;
            });
        },
        unlink: function () {
            var t = this,
                documentSelection = t.doc.getSelection(),
                node = documentSelection.focusNode;

            if (documentSelection.isCollapsed) {
                while (['A', 'DIV'].indexOf(node.nodeName) < 0) {
                    node = node.parentNode;
                }

                if (node && node.nodeName === 'A') {
                    var range = t.doc.createRange();
                    range.selectNode(node);
                    documentSelection.addRange(range);
                }
            }
            t.execCmd('unlink', undefined, true);
        },
        insertImage: function () {
            var t = this;
            t.saveSelection();
            t.openModalInsert(t.lang.insertImage, {
                url: {
                    label: 'URL',
                    required: true
                },
                alt: {
                    label: t.lang.description,
                    value: t.getSelectedText()
                }
            }, function (v) { // v are values
                t.execCmd('insertImage', v.url);
                $('img[src="' + v.url + '"]:not([alt])', t.$box).attr('alt', v.alt);
                return true;
            });
        },


        /*
         * Call method of trumbowyg if exist
         * else try to call anonymous function
         * and finaly native execCommand
         */
        execCmd: function (cmd, param, force) {
            var t = this;
            force = !!force || '';

            if (cmd !== 'dropdown') {
                t.$ed.focus();
            }

            try {
                t[cmd + force](param);
            } catch (c) {
                try {
                    cmd(param, t);
                } catch (e2) {
                    if (cmd === 'insertHorizontalRule') {
                        param = null;
                    } else if (cmd === 'formatBlock' && (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') !== -1)) {
                        param = '<' + param + '>';
                    }

                    t.doc.execCommand(cmd, false, param);

                    t.syncCode();
                    t.semanticCode(false, true);
                }

                if (cmd !== 'dropdown') {
                    t.$c.trigger('tbwchange');
                }
            }
        },


        // Open a modal box
        openModal: function (title, content) {
            var t = this,
                prefix = t.o.prefix;

            // No open a modal box when exist other modal box
            if ($('.' + prefix + 'modal-box', t.$box).length > 0) {
                return false;
            }

            t.saveSelection();
            t.showOverlay();

            // Disable all btnPane btns
            t.$btnPane.addClass(prefix + 'disable');

            // Build out of ModalBox, it's the mask for animations
            var $modal = $('<div/>', {
                class: prefix + 'modal ' + prefix + 'fixed-top'
            }).css({
                top: (t.$btnPane.height() + 1) + 'px'
            }).appendTo(t.$box);

            // Click on overlay close modal by cancelling them
            t.$overlay.one('click', function () {
                $modal.trigger('tbwcancel');
                return false;
            });

            // Build the form
            var $form = $('<form/>', {
                action: '',
                html: content
            })
                .on('submit', function () {
                    $modal.trigger('tbwconfirm');
                    return false;
                })
                .on('reset', function () {
                    $modal.trigger('tbwcancel');
                    return false;
                });


            // Build ModalBox and animate to show them
            var $box = $('<div/>', {
                class: prefix + 'modal-box',
                html: $form
            })
                .css({
                    top: '-' + t.$btnPane.outerHeight() + 'px',
                    opacity: 0
                })
                .appendTo($modal)
                .animate({
                    top: 0,
                    opacity: 1
                }, 100);


            // Append title
            $('<span/>', {
                text: title,
                class: prefix + 'modal-title'
            }).prependTo($box);

            $modal.height($box.outerHeight() + 10);


            // Focus in modal box
            $('input:first', $box).focus();


            // Append Confirm and Cancel buttons
            t.buildModalBtn('submit', $box);
            t.buildModalBtn('reset', $box);


            $(window).trigger('scroll');

            return $modal;
        },
        // @param n is name of modal
        buildModalBtn: function (n, $modal) {
            var t = this,
                prefix = t.o.prefix;

            return $('<button/>', {
                class: prefix + 'modal-button ' + prefix + 'modal-' + n,
                type: n,
                text: t.lang[n] || n
            }).appendTo($('form', $modal));
        },
        // close current modal box
        closeModal: function () {
            var t = this,
                prefix = t.o.prefix;

            t.$btnPane.removeClass(prefix + 'disable');
            t.$overlay.off();

            // Find the modal box
            var $mb = $('.' + prefix + 'modal-box', t.$box);

            $mb.animate({
                top: '-' + $mb.height()
            }, 100, function () {
                $mb.parent().remove();
                t.hideOverlay();
            });

            t.restoreSelection();
        },
        // Preformated build and management modal
        openModalInsert: function (title, fields, cmd) {
            var t = this,
                prefix = t.o.prefix,
                lg = t.lang,
                html = '',
                CONFIRM_EVENT = 'tbwconfirm';

            $.each(fields, function (fieldName, field) {
                var l = field.label,
                    n = field.name || fieldName;

                html += '<label><input type="' + (field.type || 'text') + '" name="' + n + '" value="' + (field.value || '').replace(/"/g, '&quot;') + '"><span class="' + prefix + 'input-infos"><span>' +
                    ((!l) ? (lg[fieldName] ? lg[fieldName] : fieldName) : (lg[l] ? lg[l] : l)) +
                    '</span></span></label>';
            });

            return t.openModal(title, html)
                .on(CONFIRM_EVENT, function () {
                    var $form = $('form', $(this)),
                        valid = true,
                        values = {};

                    $.each(fields, function (fieldName, field) {
                        var $field = $('input[name="' + fieldName + '"]', $form);

                        values[fieldName] = $.trim($field.val());

                        // Validate value
                        if (field.required && values[fieldName] === '') {
                            valid = false;
                            t.addErrorOnModalField($field, t.lang.required);
                        } else if (field.pattern && !field.pattern.test(values[fieldName])) {
                            valid = false;
                            t.addErrorOnModalField($field, field.patternError);
                        }
                    });

                    if (valid) {
                        t.restoreSelection();

                        if (cmd(values, fields)) {
                            t.syncCode();
                            t.$c.trigger('tbwchange');
                            t.closeModal();
                            $(this).off(CONFIRM_EVENT);
                        }
                    }
                })
                .one('tbwcancel', function () {
                    $(this).off(CONFIRM_EVENT);
                    t.closeModal();
                });
        },
        addErrorOnModalField: function ($field, err) {
            var prefix = this.o.prefix,
                $label = $field.parent();

            $field
                .on('change keyup', function () {
                    $label.removeClass(prefix + 'input-error');
                });

            $label
                .addClass(prefix + 'input-error')
                .find('input+span')
                .append(
                    $('<span/>', {
                        class: prefix + 'msg-error',
                        text: err
                    })
                );
        },


        // Selection management
        saveSelection: function () {
            var t = this,
                documentSelection = t.doc.getSelection();

            t.selection = null;

            if (documentSelection.rangeCount) {
                var savedSelection = t.selection = documentSelection.getRangeAt(0),
                    range = t.doc.createRange(),
                    rangeStart;
                range.selectNodeContents(t.$ed[0]);
                range.setEnd(savedSelection.startContainer, savedSelection.startOffset);
                rangeStart = (range + '').length;
                t.metaSelection = {
                    start: rangeStart,
                    end: rangeStart + (savedSelection + '').length
                };
            }

        },
        restoreSelection: function () {
            var t = this,
                metaSelection = t.metaSelection,
                savedSelection = t.selection,
                documentSelection = t.doc.getSelection(),
                range;

            if (!savedSelection) {
                return;
            }

            if (metaSelection && metaSelection.start !== metaSelection.end) { // Algorithm from http://jsfiddle.net/WeWy7/3/
                var charIndex = 0,
                    nodeStack = [t.$ed[0]],
                    node,
                    foundStart = false,
                    stop = false;

                range = t.doc.createRange();

                while (!stop && (node = nodeStack.pop())) {
                    if (node.nodeType === 3) {
                        var nextCharIndex = charIndex + node.length;
                        if (!foundStart && metaSelection.start >= charIndex && metaSelection.start <= nextCharIndex) {
                            range.setStart(node, metaSelection.start - charIndex);
                            foundStart = true;
                        }
                        if (foundStart && metaSelection.end >= charIndex && metaSelection.end <= nextCharIndex) {
                            range.setEnd(node, metaSelection.end - charIndex);
                            stop = true;
                        }
                        charIndex = nextCharIndex;
                    } else {
                        var cn = node.childNodes,
                            i = cn.length;

                        while (i > 0) {
                            i -= 1;
                            nodeStack.push(cn[i]);
                        }
                    }
                }
            }

            documentSelection.removeAllRanges();
            documentSelection.addRange(range || savedSelection);
        },
        getSelectedText: function () {
            return this.selection + '';
        }
    };
})(navigator, window, document, jQuery);

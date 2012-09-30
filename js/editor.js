$.editor = {
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

            insertHorizontalRule: "Insert horizontal rule"
        },

        fr: {
            viewHTML: "Voir le HTML",

            formatting: "Mise en page",
            p: "Paragraphe",
            blockquote: "Citation",
            code: "Code",
            header: "Titre",

            bold: "Gras",
            italic: "Italique",
            strikethrough: "Rayé",
            underline: "Souligné",

            unorderedList: "Liste à puces",
            orderedList: "Liste ordonnée",

            insertImage: "Inserer une Image...",
            insertVideo: "Inserer une Video...",
            link: "Lien",
            createLink: "Insérer un lien...",
            unlink: "Supprimer le lien",

            justifyLeft: "Aligner à gauche",
            justifyCenter: "Centrer",
            justifyRight: "Aligner à droite",
            justifyFull: "Justifier",

            insertHorizontalRule: "Insérer un séparateur horizontal"
        }
    }
};

jQuery.fn.editor = function(opts){
    return this.each(function(){
        var $that = $(this);

        if(!$that.data('editor')){
            $that.data('editor', new Editor(this, opts));
        }
    });
};
jQuery.fn.destroyEditor = function(){
    this.data('editor').destroy();
    this.removeData('redactor');
};
jQuery.fn.getCode = function(){
    return this.data('editor').getCode();
};


var Editor = function(editorElem, opts){
    // jQuery object of the editor
    this.$e = $(editorElem);

    // Language management
    if(typeof opts !== 'undefined' && typeof opts.lang !== 'undefined' && typeof $.editor.langs[opts.lang] === 'undefined')
        this.lang = $.editor.langs['en'];
    else
        this.lang = $.extend(true, $.editor.langs['en'], $.editor.langs[opts.lang]);

    // Defaults Options
    this.opts = $.extend(true, {
        lang: 'en',
        dir: 'ltr',
        mobile: false,

        // CSS class prefixed by opts.prefix
        cssClass: {
            editorBox: 'box',
            editorEditor: 'editor',
            editorTextarea: 'textarea',
            buttonPane: 'button-pane',
            separator: 'separator',
            dropdown: 'dropdown'
        },
        prefix: 'editor-',

        convertLink: true,

        allowedTags: ["b", "strong", "span", "a", "p", "i", "br", "hr", "img",
                        "div", "h1", "h2", "h3", "h4", "h5", "h6"],
        buttons: ['viewHTML', 
                    '|', 'formatting',
                    '|', 'bold', 'italic', 'underline', 'strikethrough', 
                    '|', 'unorderedList', 'orderedList',
                    '|', 'link', 
                    '|', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
                    '|', 'insertHorizontalRule'],
        buttonsAdd: [],
        fixedButtonPane: false,

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
                        title: this.lang.header + ' 1',
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

            bold: {
                text: 'B'
            },
            italic: {
                text: 'I'
            },
            underline: {
                text: 'U'
            },
            strikethrough: {
                text: 'S'
            },

            unorderedList: {
                func: 'insertUnorderedList'
            },
            orderedList: {
                func: 'insertOrderedList'
            },


            link: {
                dropdown: {
                    createLink: {},
                    unlink: {}
                }
            },

            justifyLeft: {},
            justifyCenter: {},
            justifyRight: {},
            justifyFull: {},

            insertHorizontalRule: {}
        }
    }, opts);

    this.init();
}

Editor.prototype = {
    init: function(){
        this.height = this.$e.css('height');

        if(!this.opts.mobile && this.isMobile()){
            this.buildEditor(true);
            return;
        }

        this.buildEditor(this.isMobile());
        this.buildButtonPane();
    },

    buildEditor: function(mobile){
        if(mobile === true){
            if(!this.$e.is('textarea')){
                var textarea = this.buildTextarea().val(this.$e.val());
                this.$e.hide().after(textarea);
            }
            return;
        }


        this.$box = $('<div/>', {
            class: this.opts.prefix + this.opts.cssClass.editorBox
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
               .addClass(this.opts.prefix + this.opts.cssClass.editorTextarea);

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

        this.$editor.addClass(this.opts.prefix + this.opts.cssClass.editorEditor)
                    .attr('contenteditable', true)
                    .attr('dir', this.opts.dir)
                    .html(html);
    },

    buildTextarea: function(){
        return $('<textarea name="'+this.$e.attr('id')+'"></textarea>', {
            height: this.height
        });
    },

    buildButtonPane: function(){
        if(this.opts.buttons === false) return;

        this.$buttonPane = $('<ul/>', {
            class: this.opts.prefix + this.opts.cssClass.buttonPane
        });

        $.each(this.opts.buttons.concat(this.opts.buttonsAdd), $.proxy(function(i, btn){
            try {
                var li = $('<li/>');

                if(btn == '|')
                    li.addClass(this.opts.prefix + this.opts.cssClass.separator);
                else
                    li.append(this.buildButton(btn));

                this.$buttonPane.append(li);
            } catch(e){}
        }, this));


        this.$box.prepend(this.$buttonPane);
    },

    buildButton: function(name){
        var btnDef = this.opts.buttonsDef[name];
        var btn = $('<a/>', {
            href: 'javascript:void(0);',
            class: this.opts.prefix + name +'-button',
            text: btnDef.text || btnDef.title || this.lang[name] || name,
            title: btnDef.title || btnDef.text || this.lang[name] || name,
            click: $.proxy(function(e){
                this.execCommand((btnDef.dropdown ? 'dropdown' : '') || btnDef.func || name,
                                 btnDef.param || name);
                e.stopPropagation();
                e.preventDefault();
            }, this)
        });



        if(btnDef.dropdown){
            var cssClass = this.opts.prefix + this.opts.cssClass.dropdown;

            var dropdown = $('<div/>', {
                class: name + '-' + cssClass + ' ' + cssClass
            });
            for(var subName in btnDef.dropdown){
                if($.isObject(btnDef.dropdown[subName]))
                    dropdown.append(this.buildSubButton(btnDef.dropdown, subName));
            }
            this.$box.append(dropdown.hide());
        }

        return btn;
    },
    buildSubButton: function(dropdown, name){
        var btnDef = dropdown[name];
        return $('<a/>', {
            href: 'javascript:void(0);',
            text: btnDef.text || btnDef.title || this.lang[name] || name,
            title: btnDef.title || btnDef.text || this.lang[name] || name,
            click: $.proxy(function(e){
                this.execCommand(dropdown.defaultFunc || btnDef.func || name,
                                 btnDef.param || name);
            }, this)
        });
    },

    toggle: function(){
        this.syncCode();
        this.$editor.toggle();
        this.$e.toggle();
    },

    dropdown: function(name){
        var dropdown = this.$box.find('.'+name+'-'+this.opts.prefix + this.opts.cssClass.dropdown);
        var btn = this.$buttonPane.find('.'+this.opts.prefix+name+'-button');

        dropdown.css({
            top: (this.$buttonPane.css('height')),
            left: (btn.offset().left - this.$buttonPane.offset().left)+'px'
        }).toggle();
        $('body').on('click', function(){
            dropdown.hide();
            $('body').off('click');
        });
    },



    destroy: function(){
        var html = this.getCode();

        if(this.isTextarea)
            this.$box.after(this.$e.css({height: this.height}).val(html).show());
        else 
            this.$box.after(this.$editor.css({height: this.height})
                                        .removeClass(this.opts.prefix + this.opts.cssClass.editorEditor)
                                        .attr('contenteditable', false)
                                        .html(html)
                                        .show());
        this.$box.remove();
    },

    getCode: function(){
        return this.$e.val();
    },
    setCode: function(html){
        this.$e.val(html);
    },
    syncCode: function(){
        this.height = this.$editor.css('height');
        if(this.$editor.is(':visible')){
            this.$e.val(this.$editor.html()).css({height: this.height});
        } else {
            this.$editor.html(this.$e.val());
        }
    },

    createLink: function(){
        this.execCommand('createlink', prompt("URL : ", "http:\/\/"));
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
                document.execCommand(cmd, false, param);
                this.syncCode();
                this.$editor.focus();
            }
        }

        return false;
    },


    isMobile: function(tablet){
        var mobile = "iPhone|iPod|Android|BlackBerry|Windows Phone|ZuneWP7";
        var exprTablet = new RegExp("(iPad|webOS|"+mobile+")");
        var exprMobile = new RegExp("("+mobile+")");

        return (tablet === true && exprTablet.test(navigator.userAgent)) || exprMobile.test(navigator.userAgent);
    }
};

(function(jQuery){
    var toString = Object.prototype.toString, hasOwnProp = Object.prototype.hasOwnProperty;
    jQuery.isObject = function( obj ) { if ( toString.call(obj) !== "[object Object]" ) return false; var key; for ( key in obj ) {} return !key || hasOwnProp.call( obj, key ); }
})(jQuery);
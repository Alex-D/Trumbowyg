/* ===========================================================
 * trumbowyg.preformatted.js v1.1
 * Preformatted plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Casella Edoardo (Civile) v1.0
 * Author : SD/S4T v1.1
 */


(function ($) {
    'use strict';

    $.extend(true, $.trumbowyg, {
        langs: {
            // jshint camelcase:false
            en: {
                preformatted: 'Code sample <pre>'
            },
            az: {
                preformatted: 'Kod nümunəsi <pre>'
            },
            by: {
                preformatted: 'Прыклад кода <pre>'
            },
            da: {
                preformatted: 'Præformateret <pre>'
            },
            de: {
                preformatted: 'Code-Beispiel <pre>'
            },
            et: {
                preformatted: 'Eelvormindatud tekst <pre>'
            },
            fr: {
                preformatted: 'Exemple de code <pre>'
            },
            ha: {
                preformatted: 'Samfurin kod <pre>'
            },
            hu: {
                preformatted: 'Kód minta <pre>'
            },
            it: {
                preformatted: 'Codice <pre>'
            },
            ja: {
                preformatted: 'コードサンプル <pre>'
            },
            ko: {
                preformatted: '코드 예제 <pre>'
            },
            pt_br: {
                preformatted: 'Exemple de código <pre>'
            },
            ru: {
                preformatted: 'Пример кода <pre>'
            },
            sl: {
                preformatted: 'Vstavi neformatiran tekst <pre>'
            },
            tr: {
                preformatted: 'Kod örneği <pre>'
            },
            zh_cn: {
                preformatted: '代码示例 <pre>'
            },
            zh_tw: {
                preformatted: '代碼範例 <pre>'
            },
        },
        // jshint camelcase:true

        plugins: {
            preformatted: {
                init: function (trumbowyg) {
                    var btnDef = {
                        fn: function () {
                            trumbowyg.saveRange();
                            let tempDiv = document.createElement('div');
                            tempDiv.appendChild(trumbowyg.range.cloneContents());
                            let html = tempDiv.innerHTML;
                            
                            if (html.replace(/\s/g, '') !== '') {
                                try {
                                    var curtag = getSelectionParentElement().tagName.toLowerCase();
                                    if (curtag === 'code' || curtag === 'pre') {
                                        return unwrapCode();
                                    } else {
                                        var formattedText = convertToPreformatted(html);
                                        trumbowyg.execCmd('insertHTML', '<pre>' + formattedText + '</pre>');
                                    }
                                } catch (e) {
                                    console.error(e);
                                }
                            } else {
                                trumbowyg.execCmd('insertHTML', '<pre><br></pre>');
                            }
                        },
                        tag: 'pre'
                    };
                    trumbowyg.addBtnDef('preformatted', btnDef);
                }
            }
        }
    });

    /*
     * GetSelectionParentElement
     */
    function getSelectionParentElement() {
        var parentEl = null,
            selection;

        if (window.getSelection) {
            selection = window.getSelection();
            if (selection.rangeCount) {
                parentEl = selection.getRangeAt(0).commonAncestorContainer;
                if (parentEl.nodeType !== 1) {
                    parentEl = parentEl.parentNode;
                }
            }
        } else if ((selection = document.selection) && selection.type !== 'Control') {
            parentEl = selection.createRange().parentElement();
        }

        return parentEl;
    }

    function convertToPreformatted(html) {
        return html .replace(/<p>/gi, '')
            .replace(/<\/p>/gi, '\n')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<h[1-6]>|<\/h[1-6]>/gi, '\n')
            .replace(/<li>/gi, '- ')
            .replace(/<\/li>/gi, '\n');
    }

    function unwrapCode() {
        var container = null;

        if (document.selection) {
            container = document.selection.createRange().parentElement();
        } else {
            var select = window.getSelection();
            if (select.rangeCount > 0) {
                container = select.getRangeAt(0).startContainer.parentNode;
            }
        }

        const pre = $(container);
        const text = pre.text(); // pure text content w/ line breaks & whitespaces

        // step 1: make html safe
        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // step 2: keep whitespaces & line breaks
        html = html
            .replace(/  /g, '&nbsp;&nbsp;')             // keep double spaces
            .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;') // keep tabs
            .replace(/\n/g, '<br>');                    // convert line breaks to <br> 

        // step 3: convert <pre> to html block
        pre.replaceWith(html);
    }
})(jQuery);

/* ===========================================================
 * trumbowyg.editlink.js v1.0
 * Link editation plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Rastislav Švarba (ra100)
 *          Twitter : @ra100
 *          Website : ra100.net
 */

(function ($) {
    'use strict';

    $.extend(true, $.trumbowyg, {
        // jshint camelcase:true

        opts: {
            btnsDef: {
                createLink: {
                    fn: function (params, tbw) {
                        var t = tbw,
                            url = '',
                            title = '',
                            target = '_blank',
                            node = '',
                            edit = false,
                            meta = null,
                            sele = null;

                        var sel = t.doc.getSelection();
                        var node = sel.extentNode;
                        while (node.nodeName != 'A' && node.nodeName != 'DIV') {
                            node = node.parentNode;
                        }

                        if (node != null && node.nodeName == 'A') {
                            var $a = $(node);
                            url = $a.attr('href');
                            title = ($a.attr('title') !== undefined) ? $a.attr('title') : $a.text();
                            target = ($a.attr('target') !== undefined) ? $a.attr('target') : target;
                            edit = true;
                            var range = t.doc.createRange();
                            range.selectNode(node);
                            sel.addRange(range);
                        }
                        t.saveSelection();
                        sele = t.selection;
                        meta = t.metaSelection;

                        t.openModalInsert(t.lang.editLink, {
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
                            // TODO fix the need to restore selection
                            t.selection = sele;
                            t.metaSelection = meta;

                            var link = $('<a href="' + v.url + '">' + v.text + '</a>');
                            if (v.title.length > 0) {
                                link.attr('title', v.title);
                            }
                            if (v.target.length > 0) {
                                link.attr('target', v.target);
                            }
                            t.selection.deleteContents();
                            t.selection.insertNode(link[0]);
                            t.restoreSelection();
                            return true;
                        });
                    }
                },
                unlink: {
                    fn: function (params, tbw) {
                        var t = tbw;

                        var sel = t.doc.getSelection();
                        if (sel.type == "Caret") {
                            var node = sel.extentNode;
                            while (node.nodeName != 'A' && node.nodeName != 'DIV') {
                                node = node.parentNode;
                            }

                            if (node != null && node.nodeName == 'A') {
                                var range = t.doc.createRange();
                                range.selectNode(node);
                                sel.addRange(range);
                            }
                        }
                        t.execCmd('unlink');
                    }
                },
                link: {
                    dropdown: ['createLink', 'unlink']
                }
            }
        }
    });
})(jQuery);
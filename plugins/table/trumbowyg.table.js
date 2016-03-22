/* ===========================================================
 * trumbowyg.table.js v1.0
 * Upload plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Lawrence Meckan
 *          Twitter : @absalomedia
 *          Website : absalom.biz
 */
(function($) {
    'use strict';

    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                createTable: 'Create Table',
                rows: 'Rows',
                columns: 'Columns',
                styler: 'Table Class',
                error: 'Error'
            },
            sk: {
                createTable: 'Vytvoriť tabuľky',
                rows: 'Riadky',
                columns: 'Stĺpce',
                styler: 'Tabuľku triedy',
                error: 'Chyba'
            },
            fr: {
                createTable: 'Créez Table',
                rows: 'Lignes',
                columns: 'Colonnes',
                styler: 'Classe de table',
                error: 'Erreur'
            },
            cs: {
                createTable: 'Vytvořit příkaz Table',
                rows: 'Řádky',
                columns: 'Sloupce',
                styler: 'Tabulku třída',
                error: 'Chyba'
            }
        },

        opts: {
            btnsDef: {
                createTable: {
                    func: function(params, tbw) {
                        var t = tbw;
                        t.saveSelection();
                        t.openModalInsert(
                            // Title
                            tbw.lang.createTable,

                            // Fields
                            {
                                rows: {
                                    type: 'number',
                                    required: true
                                },
                                columns: {
                                    type: 'number',
                                    required: true
                                },
                                styler: {
                                    label: t.lang.styler,
                                    type: 'text'
                                }
                            },
                            function(v) { // v is value
                                var table = $('<table></table>');
                                if (v.styler.length !== 0) {
                                    table.addClass(styler);
                                }

                                var tr = [];
                                for (var i = 0; i < v.rows; i++) {
                                    var row = $('<tr></tr>').appendTo(table);
                                    for (var j = 0; j < v.columns; j++) {
                                        $('<td></td>').appendTo(row);
                                    }

                                }
                                t.selection.deleteContents();
                                t.selection.insertNode(table.get(0));
                                t.restoreSelection();
                                return true;
                            });
                    }
                },
                ico: 'createTable'
            }
        }
    });
})(jQuery);
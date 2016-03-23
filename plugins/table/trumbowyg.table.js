/* ===========================================================
 * trumbowyg.table.js v1.1
 * Upload plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Lawrence Meckan
 *          Twitter : @absalomedia
 *          Website : absalom.biz
 */
(function($) {
    'use strict';

    var defaultOptions = {
        rows: 0,
        columns: 0,
        styler: ''
    };

    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                table: 'Create Table',
                rows: 'Rows',
                columns: 'Columns',
                styler: 'Table Class',
                error: 'Error'
            },
            sk: {
                table: 'Vytvoriť tabuľky',
                rows: 'Riadky',
                columns: 'Stĺpce',
                styler: 'Tabuľku triedy',
                error: 'Chyba'
            },
            fr: {
                table: 'Créez Table',
                rows: 'Lignes',
                columns: 'Colonnes',
                styler: 'Classe de table',
                error: 'Erreur'
            },
            cs: {
                table: 'Vytvořit příkaz Table',
                rows: 'Řádky',
                columns: 'Sloupce',
                styler: 'Tabulku třída',
                error: 'Chyba'
            }
        },

        plugins: {
            table: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.table = $.extend(true, {}, defaultOptions, trumbowyg.o.plugins.table || {});

                    var btnDef = {
                        fn: function () {
                        trumbowyg.saveRange();
                        trumbowyg.openModalInsert(

                            // Title
                           trumbowyg.lang.table,

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
                                    label: trumbowyg.lang.styler,
                                    type: 'text'
                                }
                            },
                            function(v) { // v is value
                                var tabler = $('<table></table>');
                                if (v.styler.length !== 0) {
                                    tabler.addClass(v.styler);
                                }

                                for (var i = 0; i < v.rows; i += 1) {
                                    var row = $('<tr></tr>').appendTo(tabler);
                                    for (var j = 0; j < v.columns; j += 1) {
                                        $('<td></td>').appendTo(row);
                                    }

                                }
                                trumbowyg.range.deleteContents();
                                trumbowyg.range.insertNode(tabler[0]);
                                return true;
                            });
                        }
                    };
                    trumbowyg.addBtnDef('table', btnDef);
                }
            }
        }
    });
})(jQuery);
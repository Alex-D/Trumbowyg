/* ===========================================================
 * trumbowyg.table.js v1.2
 * Table plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Lawrence Meckan
 *          Twitter : @absalomedia
 *          Website : absalom.biz
 */

(function ($) {
    'use strict';

    var defaultOptions = {
        rows: 0,
        columns: 0,
        styler: ''
    };

    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                table: 'Insert table',
                tableAddRow: 'Add rows',
                tableAddColumn: 'Add columns',
                rows: 'Rows',
                columns: 'Columns',
                tableHeaderRow: 'Header{Top,Side,None}',
                styler: 'Style{Default,Blue Sky,Green Forest}',
                error: 'Error'
            },
            sk: {
                table: 'Vytvoriť tabuľky',
                tableAddRow: 'Pridať riadok',
                tableAddColumn: 'Pridať stĺpec',
                rows: 'Riadky',
                columns: 'Stĺpce',
                tableHeaderRow: 'Header{Top,Side,None}',
                styler: 'Tabuľku triedy',
                error: 'Chyba'
            },
            fr: {
                table: 'Insérer un tableau',
                tableAddRow: 'Ajouter des lignes',
                tableAddColumn: 'Ajouter des colonnes',
                rows: 'Lignes',
                columns: 'Colonnes',
                tableHeaderRow: 'Header{Top,Side,None}',
                styler: 'Classes CSS sur la table',
                error: 'Erreur'
            },
            cs: {
                table: 'Vytvořit příkaz Table',
                tableAddRow: 'Přidat řádek',
                tableAddColumn: 'Přidat sloupec',
                rows: 'Řádky',
                columns: 'Sloupce',
                tableHeaderRow: 'Header{Top,Side,None}',
                styler: 'Tabulku třída',
                error: 'Chyba'
            },
            ru: {
                table: 'Вставить таблицу',
                tableAddRow: 'Добавить строки',
                tableAddColumn: 'Добавить столбцы',
                rows: 'Строки',
                columns: 'Столбцы',
                styler: 'Имя CSS класса для таблицы',
                error: 'Ошибка'
            },
            ja: {
                table: '表の挿入',
                tableAddRow: '行の追加',
                tableAddColumn: '列の追加',
                rows: '行',
                columns: '列',
                styler: '表のクラス',
                error: 'エラー'
            }
        },

        plugins: {
            table: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.table = $.extend(true, {}, defaultOptions, trumbowyg.o.plugins.table || {});

                    var tableBuild = {
                        fn: function () {
                            trumbowyg.saveRange();
                            trumbowyg.openModalInsert(
                                // Title
                                trumbowyg.lang.table,

                                // Fields
                                {
                                    rows: {
                                        type: 'number',
                                        data: '5',
                                        required: true
                                    },
                                    columns: {
                                        type: 'number',
                                        data: '2',
                                        required: true
                                    },
                                    tableHeaderRow: {
                                        type: 'radio',
                                        data: '{1,2,3}',
                                        required: true
                                    },
                                    styler: {
                                        type: 'select',
                                        data: '{trumbowyg-table,trumbowyg-table-blue,trumbowyg-table-green}',
                                        required: true
                                    }
                                },
                                function (v) { // v is value
                                    var tabler = $('<table></table>');
                                    if (v.styler.length !== 0) {
                                        tabler.addClass(v.styler);
                                    }
                                	
                                    for (var i = 0; i < v.rows; i += 1) {
                                        var row = $('<tr></tr>').appendTo(tabler);
                                        for (var j = 0; j < v.columns; j += 1) {
                                        	var cellHtml;
                                        	if ( (v.tableHeaderRow==1 && i==0) || (v.tableHeaderRow==2 && j==0) ) {
                                        		cellHtml = '<th></th>';
                                        	} else {
                                        		cellHtml = '<td></td>';
                                        	}
                                            $(cellHtml).appendTo(row);
                                        }
                                    }
                                    
                                    trumbowyg.range.deleteContents();
                                    trumbowyg.range.insertNode(tabler[0]);
                                    return true;
                                }
                            );
                        }
                    };

                    var addRow = {
                        fn: function () {
                            trumbowyg.saveRange();
                            var rower = $('<tr></tr>');
                            trumbowyg.range.deleteContents();
                            trumbowyg.range.insertNode(rower[0]);
                            return true;

                        }
                    };

                    var addColumn = {
                        fn: function () {
                            trumbowyg.saveRange();
                            var columner = $('<td></td>');
                            trumbowyg.range.deleteContents();
                            trumbowyg.range.insertNode(columner[0]);
                            return true;

                        }
                    };

                    trumbowyg.addBtnDef('table', tableBuild);
                    trumbowyg.addBtnDef('tableAddRow', addRow);
                    trumbowyg.addBtnDef('tableAddColumn', addColumn);
                }
            }
        }
    });
})(jQuery);
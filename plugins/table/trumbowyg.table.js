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
                tableRemoveRow: 'Remove row',
                tableRemoveColumn: 'Remove column',
                rows: 'Rows',
                columns: 'Columns',
                styler: 'Table class',
                error: 'Error'
            },
            sk: {
                table: 'Vytvoriť tabuľky',
                tableAddRow: 'Pridať riadok',
                tableAddColumn: 'Pridať stĺpec',
                rows: 'Riadky',
                columns: 'Stĺpce',
                styler: 'Tabuľku triedy',
                error: 'Chyba'
            },
            fr: {
                table: 'Insérer un tableau',
                tableAddRow: 'Ajouter des lignes',
                tableAddColumn: 'Ajouter des colonnes',
                rows: 'Lignes',
                columns: 'Colonnes',
                styler: 'Classes CSS sur la table',
                error: 'Erreur'
            },
            cs: {
                table: 'Vytvořit příkaz Table',
                tableAddRow: 'Přidat řádek',
                tableAddColumn: 'Přidat sloupec',
                rows: 'Řádky',
                columns: 'Sloupce',
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
            },
            nl: {
                table: 'Tabel invoegen',
                tableAddRow: 'Rij toevoegen',
                tableAddColumn: 'Kolom toevoegen',
                tableRemoveRow: 'Rij verwijderen',
                tableRemoveColumn: 'Kolom verwijderen',
                rows: 'Rijen',
                columns: 'Kolommen',
                styler: 'Tabel CSS class',
                error: 'Error'
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
                                function (v) { // v is value
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

                    var addRow = {
                        fn: function () {
                            trumbowyg.saveRange();
                            // Check if a table(or child) is selected
                            var selectedNode = $(trumbowyg.doc.getSelection().focusNode);
                            if($(selectedNode).closest('table').length > 0) {
                                // Clone the last row of the table and insert it
                                var tableBody = $(selectedNode).closest('table').find("tbody");
                                var lastRow = tableBody.find("tr:last");
                                var newRow = lastRow.clone();
                                lastRow.after(newRow);
                            }
                            else {
                                // TODO: other way of throwing "error"
                                alert('No table selected');
                            }
                            return true;
                        }
                    };
					
                    var addColumn = {
                        fn: function () {
                            trumbowyg.saveRange();
                            // Check if a table(or child) is selected
                            var selectedNode = $(trumbowyg.doc.getSelection().focusNode);
                            if($(selectedNode).closest('table').length > 0) {
                                // Go through each tr in the tbody and an a td
                                var tableBody = $(selectedNode).closest('table').find("tbody");
                                $(tableBody).find('tr').each(function() {
                                    $(this).find('td:last').after('<td></td>');
                                });
                            }
                            else {
                                // TODO: other way of throwing "error"
                                alert('No table selected');
                            }
                            return true;

                        }
                    };
					
                    var removeRow = {
                        fn: function () {
                            trumbowyg.saveRange();
                            // Check if a tr(or child) is selected
                            var selectedNode = $(trumbowyg.doc.getSelection().focusNode);
                            if($(selectedNode).closest('tr').length > 0) {
                                // Get the selected tr and delete it from the tbody
                                var row = $(selectedNode).closest('tr').remove();
                            }
                            else {
                                // TODO: other way of throwing "error"
                                alert('No table selected');
                            }
                            return true;
                        }
                    };
					
                    var removeColumn = {
                        fn: function () {
                            trumbowyg.saveRange();
                            // Check if a table(or child) is selected
                            var selectedNode = $(trumbowyg.doc.getSelection().focusNode);
                            console.log($(selectedNode));
                            return true;
                            if($(selectedNode).closest('table').length > 0) {
                                // Get the row index from the selected cell
                                var cellIndex = $(selectedNode).closest('td').index();
                                var tableBody = $(selectedNode).closest('table').find("tbody");
                                // For every tr in the tbody, remove the td on the index
                                $(tableBody).find('tr').each(function() {
                                    $(this).find('td:eq('+cellIndex+')').remove();
                                });
                            }
                            else {
                                // TODO: other way of throwing "error"
                                alert('No table selected');
                            }
                            return true;
                        }
                    };

                    trumbowyg.addBtnDef('table', tableBuild);
                    trumbowyg.addBtnDef('tableAddRow', addRow);
                    trumbowyg.addBtnDef('tableAddColumn', addColumn);
					trumbowyg.addBtnDef('tableRemoveRow', removeRow);
                    trumbowyg.addBtnDef('tableRemoveColumn', removeColumn);
                }
            }
        }
    });
})(jQuery);
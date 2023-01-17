/* ===========================================================
 * trumbowyg.table.custom.js v2.0
 * Table plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Sven Dunemann [dunemann@forelabs.eu]
 * Mod : Uros Gaber [uros@powercom.si] - Added Slovenian (sl) translations
 */

(function ($) {
    'use strict';

    var defaultOptions = {
        rows: 8,
        columns: 8,
        styler: 'table'
    };

    $.extend(true, $.trumbowyg, {
        langs: {
            // jshint camelcase:false
            en: {
                table: 'Insert table',
                tableAddHeaderRow: 'Add head row',
                tableAddRow: 'Add row',
                tableAddRowAbove: 'Add row above',
                tableAddColumnLeft: 'Add column to the left',
                tableAddColumn: 'Add column to the right',
                tableDeleteRow: 'Delete row',
                tableDeleteColumn: 'Delete column',
                tableDestroy: 'Delete table',
            },
            az: {
                table: 'Cədvəl yerləşdir',
                tableAddRow: 'Sətir əlavə et',
                tableAddRowAbove: 'Yuxarı sətir əlavə et',
                tableAddColumnLeft: 'Sola sütun əlavə et',
                tableAddColumn: 'Sağa sütun əlavə et',
                tableDeleteRow: 'Sətri sil',
                tableDeleteColumn: 'Sütunu sil',
                tableDestroy: 'Cədvəli sil',
            },
            sl: {
                table: 'Dodaj tabelo',
                tableAddRow: 'Dodaj vrstico',
                tableAddRowAbove: 'Vrini vrstico',
                tableAddColumnLeft: 'Vrini stolpec',
                tableAddColumn: 'Dodaj stolpec',
                tableDeleteRow: 'Izbriši vrstico',
                tableDeleteColumn: 'Izbriši stolpec',
                tableDestroy: 'Izbriši tabelo',
            },
            cs: {
                table: 'Vytvořit příkaz Table',
                tableAddRow: 'Přidat řádek',
                tableAddRowAbove: 'Přidat řádek',
                tableAddColumnLeft: 'Přidat sloupec',
                tableAddColumn: 'Přidat sloupec',
            },
            da: {
                table: 'Indsæt tabel',
                tableAddRow: 'Tilføj række',
                tableAddRowAbove: 'Tilføj række',
                tableAddColumnLeft: 'Tilføj kolonne',
                tableAddColumn: 'Tilføj kolonne',
                tableDeleteRow: 'Slet række',
                tableDeleteColumn: 'Slet kolonne',
                tableDestroy: 'Slet tabel',
            },
            de: {
                table: 'Tabelle einfügen',
                tableAddRow: 'Zeile hinzufügen',
                tableAddRowAbove: 'Zeile hinzufügen',
                tableAddColumnLeft: 'Spalte hinzufügen',
                tableAddColumn: 'Spalte hinzufügen',
                tableDeleteRow: 'Zeile löschen',
                tableDeleteColumn: 'Spalte löschen',
                tableDestroy: 'Tabelle löschen',
            },
            et: {
                table: 'Sisesta tabel',
                tableAddRow: 'Lisa rida',
                tableAddRowAbove: 'Lisa rida üles',
                tableAddColumnLeft: 'Lisa tulp vasakule',
                tableAddColumn: 'Lisa tulp paremale',
                tableDeleteRow: 'Kustuta rida',
                tableDeleteColumn: 'Kustuta tulp',
                tableDestroy: 'Kustuta tabel',
            },
            fr: {
                table: 'Insérer un tableau',
                tableAddHeaderRow: 'Ajouter une line d\'en-tête',
                tableAddRow: 'Ajouter des lignes',
                tableAddRowAbove: 'Ajouter des lignes',
                tableAddColumnLeft: 'Ajouter des colonnes',
                tableAddColumn: 'Ajouter des colonnes',
                tableDeleteRow: 'Effacer la ligne',
                tableDeleteColumn: 'Effacer la colonne',
                tableDestroy: 'Effacer le tableau',
            },
            hu: {
                table: 'Táblázat beszúrás',
                tableAddRow: 'Sor hozzáadás',
                tableAddRowAbove: 'Sor beszúrás fönt',
                tableAddColumnLeft: 'Sor beszúrás balra',
                tableAddColumn: 'Sor beszúrás jobbra',
                tableDeleteRow: 'Sor törlés',
                tableDeleteColumn: 'Oszlop törlés',
                tableDestroy: 'Táblázat törlés',
            },
            id: {
                table: 'Sisipkan tabel',
                tableAddRow: 'Sisipkan baris',
                tableAddRowAbove: 'Sisipkan baris',
                tableAddColumnLeft: 'Sisipkan kolom',
                tableAddColumn: 'Sisipkan kolom',
                tableDeleteRow: 'Hapus baris',
                tableDeleteColumn: 'Hapus kolom',
                tableDestroy: 'Hapus tabel',
            },
            ja: {
                table: '表の挿入',
                tableAddRow: '行の追加',
                tableAddRowAbove: '行の追加',
                tableAddColumnLeft: '列の追加',
                tableAddColumn: '列の追加',
            },
            ko: {
                table: '표 넣기',
                tableAddRow: '줄 추가',
                tableAddRowAbove: '줄 추가',
                tableAddColumnLeft: '칸 추가',
                tableAddColumn: '칸 추가',
                tableDeleteRow: '줄 삭제',
                tableDeleteColumn: '칸 삭제',
                tableDestroy: '표 지우기',
            },
            pt_br: {
                table: 'Inserir tabela',
                tableAddRow: 'Adicionar linha',
                tableAddRowAbove: 'Adicionar linha',
                tableAddColumnLeft: 'Adicionar coluna',
                tableAddColumn: 'Adicionar coluna',
                tableDeleteRow: 'Deletar linha',
                tableDeleteColumn: 'Deletar coluna',
                tableDestroy: 'Deletar tabela',
            },
            ru: {
                table: 'Вставить таблицу',
                tableAddRow: 'Добавить строку',
                tableAddRowAbove: 'Добавить строку',
                tableAddColumnLeft: 'Добавить столбец',
                tableAddColumn: 'Добавить столбец',
                tableDeleteRow: 'Удалить строку',
                tableDeleteColumn: 'Удалить столбец',
                tableDestroy: 'Удалить таблицу',
            },
            sk: {
                table: 'Vytvoriť tabuľky',
                tableAddRow: 'Pridať riadok',
                tableAddRowAbove: 'Pridať riadok',
                tableAddColumnLeft: 'Pridať stĺpec',
                tableAddColumn: 'Pridať stĺpec',
            },
            tr: {
                table: 'Tablo ekle',
                tableAddRow: 'Satır ekle',
                tableAddRowAbove: 'Yukarıya satır ekle',
                tableAddColumnLeft: 'Sola sütun ekle',
                tableAddColumn: 'Sağa sütun ekle',
                tableDeleteRow: 'Satırı sil',
                tableDeleteColumn: 'Sütunu sil',
                tableDestroy: 'Tabloyu sil',
            },
            zh_tw: {
                table: '插入表格',
                tableAddRow: '加入行',
                tableAddRowAbove: '加入行',
                tableAddColumnLeft: '加入列',
                tableAddColumn: '加入列',
                tableDeleteRow: '刪除行',
                tableDeleteColumn: '刪除列',
                tableDestroy: '刪除表格',
            },
            es: {
                table: 'Insertar tabla',
                tableAddRow: 'Agregar fila',
                tableAddRowAbove: 'Agregar fila arriba',
                tableAddColumnLeft: 'Agregar columna a la izquierda',
                tableAddColumn: 'Agregar columna a la derecha',
                tableDeleteRow: 'Borrar fila',
                tableDeleteColumn: 'Borrar columna',
                tableDestroy: 'Borrar tabla',
            }// jshint camelcase:true
        },

        plugins: {
            table: {
                init: function (t) {
                    t.o.plugins.table = $.extend(true, {}, defaultOptions, t.o.plugins.table || {});


                    ////////////////////////////////////////////////////
                    // Dropdown

                    var buildButtonDef = {
                        fn: function () {
                            t.saveRange();

                            var btnName = 'table';

                            var dropdownPrefix = t.o.prefix + 'dropdown',
                                dropdownOptions = { // the dropdown
                                    class: dropdownPrefix + '-' + btnName + ' ' + dropdownPrefix + ' ' + t.o.prefix + 'fixed-top'
                                };
                            dropdownOptions['data-' + dropdownPrefix] = btnName;
                            var $dropdown = $('<div/>', dropdownOptions);

                            if (t.$box.find('.' + dropdownPrefix + '-' + btnName).length === 0) {
                                t.$box.append($dropdown.hide());
                            } else {
                                $dropdown = t.$box.find('.' + dropdownPrefix + '-' + btnName);
                            }

                            // clear dropdown
                            $dropdown.html('');

                            // when active table show AddRow / AddColumn
                            if (t.$box.find('.' + t.o.prefix + 'table-button').hasClass(t.o.prefix + 'active-button')) {
                                // Conditional thead button
                                var $table = $(t.doc.getSelection().focusNode).closest('table');
                                var hasThead = $('thead', $table).length !== 0;
                                if (!hasThead) {
                                    $dropdown.append(t.buildSubBtn('tableAddHeaderRow'));
                                }

                                // All other buttons
                                $dropdown.append(t.buildSubBtn('tableAddRowAbove'));
                                $dropdown.append(t.buildSubBtn('tableAddRow'));
                                $dropdown.append(t.buildSubBtn('tableAddColumnLeft'));
                                $dropdown.append(t.buildSubBtn('tableAddColumn'));
                                $dropdown.append(t.buildSubBtn('tableDeleteRow'));
                                $dropdown.append(t.buildSubBtn('tableDeleteColumn'));
                                $dropdown.append(t.buildSubBtn('tableDestroy'));
                            } else {
                                var tableSelect = $('<table/>');
                                $('<tbody/>').appendTo(tableSelect);
                                for (var i = 0; i < t.o.plugins.table.rows; i += 1) {
                                    var row = $('<tr/>').appendTo(tableSelect);
                                    for (var j = 0; j < t.o.plugins.table.columns; j += 1) {
                                        $('<td/>').appendTo(row);
                                    }
                                }
                                tableSelect.find('td').on('mouseover', toggleActiveDropdownCells);
                                tableSelect.find('td').on('mousedown', tableBuild);

                                $dropdown.append(tableSelect);
                                $dropdown.append($('<div class="trumbowyg-table-size">1x1</div>'));
                            }

                            t.dropdown(btnName);
                        }
                    };

                    var toggleActiveDropdownCells = function (columnEvent) {
                        var column = $(columnEvent.target),
                            table = column.closest('table'),
                            colIndex = this.cellIndex,
                            rowIndex = this.parentNode.rowIndex;

                        // reset all columns
                        table.find('td').removeClass('active');

                        for (var i = 0; i <= rowIndex; i += 1) {
                            for (var j = 0; j <= colIndex; j += 1) {
                                table.find('tr:nth-of-type(' + (i + 1) + ')').find('td:nth-of-type(' + (j + 1) + ')').addClass('active');
                            }
                        }

                        // set label
                        table.next('.trumbowyg-table-size').html((colIndex + 1) + 'x' + (rowIndex + 1));
                    };

                    var tableBuild = function () {
                        t.saveRange();

                        var newTable = $('<table/>');

                        // Build thead
                        var $thead = $('<thead/>');
                        var $theadTr = $('<tr/>');
                        $theadTr.appendTo($thead);
                        for (var th = 0; th <= this.cellIndex; th += 1) {
                            $('<th/>', {scope: 'col'}).appendTo($theadTr);
                        }
                        $thead.appendTo(newTable);

                        // Build tbody
                        var $tbody = $('<tbody/>');

                        var colIndex = this.cellIndex,
                            rowIndex = this.parentNode.rowIndex;

                        for (var i = 0; i <= rowIndex; i += 1) {
                            var row = $('<tr/>').appendTo($tbody);
                            for (var j = 0; j <= colIndex; j += 1) {
                                $('<td/>').appendTo(row);
                            }
                        }

                        $tbody.appendTo(newTable);

                        // Find first parent element
                        var rangeNode = t.range.endContainer;
                        while (rangeNode.nodeType !== Node.ELEMENT_NODE) {
                            rangeNode = rangeNode.parentNode;
                        }

                        // Put range after the parent of the selected element
                        if (rangeNode !== t.$ed[0]) {
                            t.range.setEndAfter(rangeNode);
                        }

                        // Insert table after the range
                        t.range.collapse();
                        t.range.insertNode(newTable[0]);

                        // Remove empty paragraph
                        if (rangeNode.nodeName === 'P' && rangeNode.textContent.trim().length === 0) {
                            rangeNode.remove();
                        }

                        t.$c.trigger('tbwchange');
                    };


                    ////////////////////////////////////////////////////
                    // Buttons

                    var tableButtonAction = function (callback) {
                        return function () {
                            t.saveRange();

                            var node = t.doc.getSelection().focusNode;
                            var $focusedRow = $(node).closest('tr');
                            var $table = $(node).closest('table');

                            if ($table.length === 0) {
                                return;
                            }

                            callback($table, $focusedRow, node);

                            t.syncCode();
                        };
                    };


                    ////// Rows

                    var addRowButtonAction = function (isBefore = false) {
                        return tableButtonAction(function ($table, $focusedRow) {
                            var $newRow = $('<tr/>');

                            if ($focusedRow.closest('thead').length !== 0) {
                                $focusedRow = $('tbody tr', $table).first();
                            }

                            // add columns according to current columns count
                            $('td', $focusedRow).each(function () {
                                $(this).clone().appendTo($newRow).text('');
                            });

                            // add row to table
                            if (isBefore) {
                                $focusedRow.before($newRow);
                            } else {
                                $focusedRow.after($newRow);
                            }
                        });
                    };

                    var addRowAbove = {
                        title: t.lang.tableAddRowAbove,
                        text: t.lang.tableAddRowAbove,
                        ico: 'row-above',

                        fn: addRowButtonAction(true),
                    };

                    var addRowBelow = {
                        title: t.lang.tableAddRow,
                        text: t.lang.tableAddRow,
                        ico: 'row-below',

                        fn: addRowButtonAction(false),
                    };

                    var addHeaderRow = {
                        title: t.lang.tableAddHeaderRow,
                        text: t.lang.tableAddHeaderRow,
                        ico: 'header-row',

                        fn: tableButtonAction(function ($table) {
                            var $tableFirstRow = $('tr', $table).first();
                            var $thead = $('<thead/>');
                            var $theadRow = $('<tr/>').appendTo($thead);

                            // add columns according to current columns count
                            $('td', $tableFirstRow).each(function () {
                                var $newTh = $('<th/>').appendTo($theadRow);

                                $.each(this.attributes, function (attribute) {
                                    $newTh.attr(attribute.name, attribute.value);
                                });
                            });

                            // add thead to table
                            $table.prepend($thead);
                        }),
                    };


                    ////// Columns

                    var addColumnButtonAction = function (isBefore = false) {
                        return tableButtonAction(function ($table, $focusedRow, node) {
                            var focusedColIdx = $(node).closest('td').index();

                            $('tr', $table).each(function () {
                                var $previousCell = $(this).children()[focusedColIdx];
                                var $newCell = $previousCell.clone().text('');

                                if (isBefore) {
                                    $previousCell.before($newCell);
                                } else {
                                    $previousCell.after($newCell);
                                }
                            });
                        });
                    };

                    var addColumnLeft = {
                        title: t.lang.tableAddColumnLeft,
                        text: t.lang.tableAddColumnLeft,
                        ico: 'col-left',

                        fn: addColumnButtonAction(true)
                    };

                    var addColumnRight = {
                        title: t.lang.tableAddColumn,
                        text: t.lang.tableAddColumn,
                        ico: 'col-right',

                        fn: addColumnButtonAction(false)
                    };


                    ////// Delete

                    var destroy = {
                        title: t.lang.tableDestroy,
                        text: t.lang.tableDestroy,
                        ico: 'table-delete',

                        fn: tableButtonAction(function ($table) {
                            $table.remove();
                        })
                    };

                    var deleteRow = {
                        title: t.lang.tableDeleteRow,
                        text: t.lang.tableDeleteRow,
                        ico: 'row-delete',

                        fn: tableButtonAction(function ($table, $focusedRow) {
                            // Only one row is remaining in the table, remove the table
                            if ($('tbody tr', $table).length === 1) {
                                $table.remove();
                                return;
                            }

                            // Pick element to remove
                            var $elementToRemove = $focusedRow;
                            var $focusedRowParent = $focusedRow.parent();
                            if ($focusedRowParent.is('thead')) {
                                $elementToRemove = $focusedRowParent;
                            }
                            $elementToRemove.remove();
                        }),
                    };

                    var deleteColumn = {
                        title: t.lang.tableDeleteColumn,
                        text: t.lang.tableDeleteColumn,
                        ico: 'col-delete',

                        fn: tableButtonAction(function ($table, $focusedRow, node) {
                            var cellIndex = $(node).closest('td').index();

                            $table.find('tr').each(function () {
                                $(this).find('td:eq(' + cellIndex + ')').remove();
                            });
                        })
                    };

                    t.addBtnDef('table', buildButtonDef);
                    t.addBtnDef('tableAddHeaderRow', addHeaderRow);
                    t.addBtnDef('tableAddRowAbove', addRowAbove);
                    t.addBtnDef('tableAddRow', addRowBelow);
                    t.addBtnDef('tableAddColumnLeft', addColumnLeft);
                    t.addBtnDef('tableAddColumn', addColumnRight);
                    t.addBtnDef('tableDeleteRow', deleteRow);
                    t.addBtnDef('tableDeleteColumn', deleteColumn);
                    t.addBtnDef('tableDestroy', destroy);
                }
            }
        }
    });
})(jQuery);

/*/* ===========================================================
 * trumbowyg.history.js v1.0
 * history plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : The Rock [wwerocker01@gmail.com]
 */

(function ($) {
    'use strict';
    $.extend(true, $.trumbowyg, {
        plugins: {
            history: {
                destroy: function (t) {
                    t.$c.off('tbwinit.history tbwchange.history');
                },
                init: function (t) {
                    t.o.plugins.history = $.extend(true, {
                        _stack: [],
                        _index: -1,
                        _focusEl: undefined
                    }, t.o.plugins.history || {});

                    var btnBuildDefRedo = {
                        title: t.lang.redo,
                        ico: 'redo',
                        key: 'Y',
                        fn: function () {
                            if (t.o.plugins.history._index < t.o.plugins.history._stack.length - 1) {
                                t.o.plugins.history._index += 1;
                                var index = t.o.plugins.history._index;
                                var newState = t.o.plugins.history._stack[index];

                                t.execCmd('html', newState);
                                // Save the state back to history
                                t.o.plugins.history._stack[index] = t.$ed.html();

                                carretToEnd();
                                toggleButtonStates();
                            }
                        }
                    };

                    var btnBuildDefUndo = {
                        title: t.lang.undo,
                        ico: 'undo',
                        key: 'Z',
                        fn: function () {
                            if (t.o.plugins.history._index > 0) {
                                t.o.plugins.history._index -= 1;
                                var index = t.o.plugins.history._index,
                                    newState = t.o.plugins.history._stack[index];

                                t.execCmd('html', newState);
                                // Save the state back to history
                                t.o.plugins.history._stack[index] = t.$ed.html();

                                carretToEnd();
                                toggleButtonStates();
                            }
                        }
                    };

                    var pushToHistory = function () {
                        var index = t.o.plugins.history._index,
                            stack = t.o.plugins.history._stack,
                            latestState = stack.slice(-1)[0] || '<p></p>',
                            prevState = stack[index],
                            newState = t.$ed.html(),
                            focusEl = t.doc.getSelection().focusNode,
                            focusElText = '',
                            latestStateText = $(latestState).text(),
                            newStateText = $(newState).text(),
                            prevFocusEl = t.o.plugins.history._focusEl;

                        if (focusEl) {
                            t.o.plugins.history._focusEl = focusEl;
                            focusElText = focusEl.outerHTML || focusEl.textContent;
                        }

                        if (newStateText !== $(prevState).text()) {
                            // Check if the state has changed by comparing the text content
                            if (focusElText.slice(-1).match(/\s/) ||
                                latestStateText !== newStateText ||
                                t.o.plugins.history._index <= 0 || focusEl !== prevFocusEl) {
                                t.o.plugins.history._index += 1;
                                // Remove newer entries in history when something new was added
                                t.o.plugins.history._stack = stack.slice(0, t.o.plugins.history._index);
                                // Add new state to modified history
                                t.o.plugins.history._stack.push(newState);
                            } else {
                                // Modify last stack entry
                                t.o.plugins.history._stack[index] = newState;
                            }

                            toggleButtonStates();
                        }
                    };

                    var toggleButtonStates = function () {
                        var index = t.o.plugins.history._index,
                            stackSize = t.o.plugins.history._stack.length,
                            undoState = (index > 0),
                            redoState = (stackSize !== 0 && index !== stackSize - 1);

                        toggleButtonState('historyUndo', undoState);
                        toggleButtonState('historyRedo', redoState);
                    };

                    var toggleButtonState = function (btn, enable) {
                        var button = t.$box.find('.trumbowyg-' + btn + '-button');

                        if (enable) {
                            button.removeClass('trumbowyg-disable');
                        } else if (!button.hasClass('trumbowyg-disable')) {
                            button.addClass('trumbowyg-disable');
                        }
                    };

                    var carretToEnd = function () {
                        var node = t.doc.getSelection().focusNode,
                            range = t.doc.createRange();

                        if (node.childNodes.length > 0) {
                            range.setStartAfter(node.childNodes[node.childNodes.length - 1]);
                            range.setEndAfter(node.childNodes[node.childNodes.length - 1]);
                            t.doc.getSelection().removeAllRanges();
                            t.doc.getSelection().addRange(range);
                        }
                    };

                    t.$c.on('tbwinit.history tbwchange.history', pushToHistory);

                    t.addBtnDef('historyRedo', btnBuildDefRedo);
                    t.addBtnDef('historyUndo', btnBuildDefUndo);
                }
            }
        }
    });
})(jQuery);


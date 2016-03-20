/* ===========================================================
 * trumbowyg.colors.js v1.1
 * Colors picker plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Alexandre Demode (Alex-D)
 *          Twitter : @AlexandreDemode
 *          Website : alex-d.fr
 */

(function ($) {
    'use strict';

    $.extend(true, $.trumbowyg, {
        langs: {
            // jshint camelcase:false
            cs: {
                foreColor: 'Barva textu',
                backColor: 'Barva pozadí'
            },
            en: {
                foreColor: 'Text color',
                backColor: 'Background color'
            },
            fr: {
                foreColor: 'Couleur du texte',
                backColor: 'Couleur de fond'
            },
            sk: {
                foreColor: 'Farba textu',
                backColor: 'Farba pozadia'
            },
            zh_cn: {
                foreColor: '文字颜色',
                backColor: '背景颜色'
            }
        },

        opts: {
            colors: ['ffffff', '000000', 'eeece1', '1f497d', '4f81bd', 'c0504d', '9bbb59', '8064a2', '4bacc6', 'f79646', 'ffff00', 'f2f2f2', '7f7f7f', 'ddd9c3', 'c6d9f0', 'dbe5f1', 'f2dcdb', 'ebf1dd', 'e5e0ec', 'dbeef3', 'fdeada', 'fff2ca', 'd8d8d8', '595959', 'c4bd97', '8db3e2', 'b8cce4', 'e5b9b7', 'd7e3bc', 'ccc1d9', 'b7dde8', 'fbd5b5', 'ffe694', 'bfbfbf', '3f3f3f', '938953', '548dd4', '95b3d7', 'd99694', 'c3d69b', 'b2a2c7', 'b7dde8', 'fac08f', 'f2c314', 'a5a5a5', '262626', '494429', '17365d', '366092', '953734', '76923c', '5f497a', '92cddc', 'e36c09', 'c09100', '7f7f7f', '0c0c0c', '1d1b10', '0f243e', '244061', '632423', '4f6128', '3f3151', '31859b', '974806', '7f6000']
        }
    });
    // jshint camelcase:true


    function hex(x) {
        return ('0' + parseInt(x).toString(16)).slice(-2);
    }

    function colorToHex(rgb) {
        if (rgb.search('rgb') === -1) {
            return rgb.replace('#', '');
        } else if (rgb === 'rgba(0, 0, 0, 0)') {
            return 'transparent';
        } else {
            rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
            return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        }
    }

    function colorTagHandler(element) {
        var tags = [];

        // background color
        if (element.style.backgroundColor !== '') {
            var backColor = colorToHex(element.style.backgroundColor);
            if ($.trumbowyg.opts.colors.indexOf(backColor) >= 0) {
                tags.push('backColor' + backColor);
            } else {
                tags.push('backColorFree');
            }
        }

        // text color
        var foreColor;
        if (element.style.color !== '') {
            foreColor = colorToHex(element.style.color);
        } else if (element.hasAttribute('color')) {
            foreColor = colorToHex(element.getAttribute('color'));
        }
        if (foreColor) {
            if ($.trumbowyg.opts.colors.indexOf(foreColor) >= 0) {
                tags.push('foreColor' + foreColor);
            } else {
                tags.push('foreColorFree');
            }
        }

        return tags;
    }

    // Add all colors in two dropdowns
    $.extend(true, $.trumbowyg, {
        opts: {
            btnsDef: {
                foreColor: {
                    dropdown: buildDropdown('foreColor')
                },
                backColor: {
                    dropdown: buildDropdown('backColor')
                }
            },
            pluginTagHandlers: {
                colorTagHandler: colorTagHandler
            }
        }
    });

    function buildDropdown(fn) {
        var dropdown = [];

        $.each($.trumbowyg.opts.colors, function (i, color) {
            var btn = fn + color;
            $.trumbowyg.opts.btnsDef[btn] = {
                fn: fn,
                forceCss: true,
                param: '#' + color,
                style: 'background-color: #' + color + ';'
            };
            dropdown.push(btn);
        });

        var removeColorButtonName = fn + 'Remove';
        $.trumbowyg.opts.btnsDef[removeColorButtonName] = {
            fn: 'removeFormat',
            param: fn,
            style: 'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAG0lEQVQIW2NkQAAfEJMRmwBYhoGBYQtMBYoAADziAp0jtJTgAAAAAElFTkSuQmCC);'
        };
        dropdown.push(removeColorButtonName);

        // add free color btn
        var freeColorButtonName = fn + 'Free';
        $.trumbowyg.opts.btnsDef[freeColorButtonName] = {
            fn: function (params, tbw) {
                tbw.openModalInsert(tbw.lang[fn],
                    {
                        color: {
                            label: fn,
                            value: '#FFFFFF'
                        }
                    },
                    // callback
                    function (values) {
                        tbw.execCmd(fn, values.color);
                        return true;
                    }
                );
            },
            text: '#',
            // style adjust for displaying the text
            style: 'text-indent: 0;line-height: 20px;padding: 0 5px;'
        };
        dropdown.push(freeColorButtonName);

        return dropdown;
    }
})(jQuery);

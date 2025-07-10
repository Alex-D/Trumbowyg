(function ($) {
    'use strict';

    $.extend(true, $.trumbowyg, {
        langs: {
            // jshint camelcase:false
            en: {
                lineheight: 'Line height',
                lineheights: {
                    '0.9': 'Small',
                    'normal': 'Regular',
                    '1.5': 'Large',
                    '2.0': 'Extra large',
                    'custom': 'Custom'
                },
                lineheightCustomSize: {
                    title: 'Custom line height',
                    label: 'Line height',
                    value: '1.5'
                }
            },
            az: {
                lineheight: 'Sətir yüksəkliyi',
                lineheights: {
                    '0.9': 'Kiçik',
                    'normal': 'Normal',
                    '1.5': 'Böyük',
                    '2.0': 'Daha böyük',
                    'custom': 'Xüsusi'
                },
                lineheightCustomSize: {
                    title: 'Xüsusi sətir yüksəkliyi',
                    label: 'Sətir yüksəkliyi',
                    value: '1.5'
                }
            },
            by: {
                lineheight: 'Міжрадковы інтэрвал',
                lineheights: {
                    '0.9': 'Маленькі',
                    'normal': 'Звычайны',
                    '1.5': 'Вялікі',
                    '2.0': 'Вельмі вялікі',
                    'custom': 'Карыстальніцкі'
                },
                lineheightCustomSize: {
                    title: 'Карыстальніцкі міжрадковы інтэрвал',
                    label: 'Міжрадковы інтэрвал',
                    value: '1.5'
                }
            },
            cs: {
                lineheight: 'Výška řádku',
                lineheights: {
                    '0.9': 'Malá',
                    'normal': 'Normální',
                    '1.5': 'Velká',
                    '2.0': 'Extra velká',
                    'custom': 'Vlastní'
                },
                lineheightCustomSize: {
                    title: 'Vlastní výška řádku',
                    label: 'Výška řádku',
                    value: '1.5'
                }
            },
            da: {
                lineheight: 'Linjehøjde',
                lineheights: {
                    '0.9': 'Lille',
                    'normal': 'Normal',
                    '1.5': 'Stor',
                    '2.0': 'Ekstra stor',
                    'custom': 'Brugerdefineret'
                },
                lineheightCustomSize: {
                    title: 'Brugerdefineret linjehøjde',
                    label: 'Linjehøjde',
                    value: '1.5'
                }
            },
            de: {
                lineheight: 'Zeilenhöhe',
                lineheights: {
                    '0.9': 'Klein',
                    'normal': 'Normal',
                    '1.5': 'Groß',
                    '2.0': 'Sehr groß',
                    'custom': 'Benutzerdefiniert'
                },
                lineheightCustomSize: {
                    title: 'Benutzerdefinierte Zeilenhöhe',
                    label: 'Zeilenhöhe',
                    value: '1.5'
                }
            },
            et: {
                lineheight: 'Reavahe',
                lineheights: {
                    '0.9': 'Väike',
                    'normal': 'Tavaline',
                    '1.5': 'Suur',
                    '2.0': 'Väga suur',
                    'custom': 'Kohandatud'
                },
                lineheightCustomSize: {
                    title: 'Kohandatud reavahe',
                    label: 'Reavahe',
                    value: '1.5'
                }
            },
            fr: {
                lineheight: 'Hauteur de ligne',
                lineheights: {
                    '0.9': 'Petite',
                    'normal': 'Normale',
                    '1.5': 'Grande',
                    '2.0': 'Très grande',
                    'custom': 'Personnalisée'
                },
                lineheightCustomSize: {
                    title: 'Hauteur de ligne personnalisée',
                    label: 'Hauteur de ligne',
                    value: '1.5'
                }
            },
            hu: {
                lineheight: 'Line height',
                lineheights: {
                    '0.9': 'Small',
                    'normal': 'Regular',
                    '1.5': 'Large',
                    '2.0': 'Extra large',
                    'custom': 'Custom'
                },
                lineheightCustomSize: {
                    title: 'Egyéni sorköz',
                    label: 'Sorköz',
                    value: '1.5'
                }
            },
            it: {
                lineheight: 'Altezza linea',
                lineheights: {
                    '0.9': 'Bassa',
                    'normal': 'Normale',
                    '1.5': 'Alta',
                    '2.0': 'Molto alta',
                    'custom': 'Personalizzata'
                },
                lineheightCustomSize: {
                    title: 'Altezza linea personalizzata',
                    label: 'Altezza linea',
                    value: '1.5'
                }
            },
            ko: {
                lineheight: '줄 간격',
                lineheights: {
                    '0.9': '좁게',
                    'normal': '보통',
                    '1.5': '넓게',
                    '2.0': '아주 넓게',
                    'custom': '사용자 정의'
                },
                lineheightCustomSize: {
                    title: '사용자 정의 줄 간격',
                    label: '줄 간격',
                    value: '1.5'
                }
            },
            nl: {
                lineheight: 'Regelhoogte',
                lineheights: {
                    '0.9': 'Klein',
                    'normal': 'Normaal',
                    '1.5': 'Groot',
                    '2.0': 'Extra groot',
                    'custom': 'Aangepast'
                },
                lineheightCustomSize: {
                    title: 'Aangepaste regelhoogte',
                    label: 'Regelhoogte',
                    value: '1.5'
                }
            },
            pt_br: {
                lineheight: 'Altura de linha',
                lineheights: {
                    '0.9': 'Pequena',
                    'normal': 'Regular',
                    '1.5': 'Grande',
                    '2.0': 'Extra grande',
                    'custom': 'Personalizada'
                },
                lineheightCustomSize: {
                    title: 'Altura de linha personalizada',
                    label: 'Altura de linha',
                    value: '1.5'
                }
            },
            ru: {
                lineheight: 'Межстрочный интервал',
                lineheights: {
                    '0.9': 'Маленький',
                    'normal': 'Обычный',
                    '1.5': 'Большой',
                    '2.0': 'Очень большой',
                    'custom': 'Пользовательский'
                },
                lineheightCustomSize: {
                    title: 'Пользовательский межстрочный интервал',
                    label: 'Межстрочный интервал',
                    value: '1.5'
                }
            },
            sk: {
                lineheight: 'Výška riadku',
                lineheights: {
                    '0.9': 'Malá',
                    'normal': 'Normálna',
                    '1.5': 'Veľká',
                    '2.0': 'Extra veľká',
                    'custom': 'Vlastná'
                },
                lineheightCustomSize: {
                    title: 'Vlastná výška riadku',
                    label: 'Výška riadku',
                    value: '1.5'
                }
            },
            sl: {
                lineheight: 'Višina vrstice',
                lineheights: {
                    '0.9': 'Majhna',
                    'normal': 'Navadna',
                    '1.5': 'Velika',
                    '2.0': 'Ekstra velika',
                    'custom': 'Uporabniška'
                },
                lineheightCustomSize: {
                    title: 'Uporabniško določena višina vrstice',
                    label: 'Višina vrstice',
                    value: '1.5'
                }
            },
            tr: {
                lineheight: 'Satır yüksekliği',
                lineheights: {
                    '0.9': 'Küçük',
                    'normal': 'Normal',
                    '1.5': 'Büyük',
                    '2.0': 'Çok Büyük',
                    'custom': 'Özel'
                },
                lineheightCustomSize: {
                    title: 'Özel satır yüksekliği',
                    label: 'Satır yüksekliği',
                    value: '1.5'
                }
            },
            zh_tw: {
                lineheight: '文字間距',
                lineheights: {
                    '0.9': '小',
                    'normal': '正常',
                    '1.5': '大',
                    '2.0': '特大',
                    'custom': '自訂'
                },
                lineheightCustomSize: {
                    title: '自訂文字間距',
                    label: '文字間距',
                    value: '1.5'
                }
            },
        }
    });
    // jshint camelcase:true

    var defaultOptions = {
        sizeList: [
            '0.9',
            'normal',
            '1.5',
            '2.0'
        ],
        allowCustomSize: true
    };

    function setLineHeight (trumbowyg, size) {
        trumbowyg.saveRange();
        var text = trumbowyg.getRangeText();
        if (text.replace(/\s/g, '') !== '') {
            try {
                var parent = getSelectionParentElement();
                $(parent).css('lineHeight', size);
            } catch (e) {
            }
        }
    }

    // Add dropdown with font sizes
    $.extend(true, $.trumbowyg, {
        plugins: {
            lineheight: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.lineheight = $.extend({},
                        defaultOptions,
                        trumbowyg.o.plugins.lineheight || {}
                    );

                    trumbowyg.addBtnDef('lineheight', {
                        dropdown: buildDropdown(trumbowyg)
                    });
                }
            }
        }
    });

    // Build the dropdown
    function buildDropdown (trumbowyg) {
        var dropdown = [];

        $.each(trumbowyg.o.plugins.lineheight.sizeList, function (index, size) {
            trumbowyg.addBtnDef('lineheight_' + size, {
                text: trumbowyg.lang.lineheights[size] || size,
                hasIcon: false,
                fn: function () {
                    setLineHeight(trumbowyg, size);
                }
            });
            dropdown.push('lineheight_' + size);
        });

        if (trumbowyg.o.plugins.lineheight.allowCustomSize) {
            var customSizeButtonName = 'lineheight_custom';
            var customSizeBtnDef = {
                fn: function () {
                    trumbowyg.openModalInsert(trumbowyg.lang.lineheightCustomSize.title,
                        {
                            size: {
                                label: trumbowyg.lang.lineheightCustomSize.label,
                                value: trumbowyg.lang.lineheightCustomSize.value
                            }
                        },
                        function (form) {
                            setLineHeight(trumbowyg, form.size);
                            return true;
                        }
                    );
                },
                text: '<span style="font-size: medium;">' + trumbowyg.lang.lineheights.custom + '</span>',
                hasIcon: false
            };
            trumbowyg.addBtnDef(customSizeButtonName, customSizeBtnDef);
            dropdown.push(customSizeButtonName);
        }

        return dropdown;
    }

    // Get the selection's parent
    function getSelectionParentElement () {
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
})(jQuery);



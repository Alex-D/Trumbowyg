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
                },
                paragraphSpacings: {
                    '0': 'No spacing',
                    '0.5em': 'Small spacing',
                    '1em': 'Regular spacing',
                    '1.5em': 'Large spacing',
                    '2em': 'Extra large spacing',
                    'custom': 'Custom'
                },
                paragraphSpacingCustomSize: {
                    title: 'Custom paragraph spacing',
                    label: 'Paragraph spacing',
                    value: '1.5em'
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
                },
                paragraphSpacings: {
                    '0': 'Aralıqsız',
                    '0.5em': 'Kiçik aralıq',
                    '1em': 'Normal aralıq',
                    '1.5em': 'Böyük aralıq',
                    '2em': 'Çox böyük aralıq',
                    'custom': 'Xüsusi'
                },
                paragraphSpacingCustomSize: {
                    title: 'Xüsusi abzas aralığı',
                    label: 'Abzas aralığı',
                    value: '1.5em'
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
                },
                paragraphSpacings: {
                    '0': 'Без інтэрвалу',
                    '0.5em': 'Малы інтэрвал',
                    '1em': 'Звычайны інтэрвал',
                    '1.5em': 'Вялікі інтэрвал',
                    '2em': 'Вельмі вялікі інтэрвал',
                    'custom': 'Карыстальніцкі'
                },
                paragraphSpacingCustomSize: {
                    title: 'Карыстальніцкі інтэрвал абзаца',
                    label: 'Інтэрвал абзаца',
                    value: '1.5em'
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
                },
                paragraphSpacings: {
                    '0': 'Žádný odstup',
                    '0.5em': 'Malý odstup',
                    '1em': 'Normální odstup',
                    '1.5em': 'Velký odstup',
                    '2em': 'Extra velký odstup',
                    'custom': 'Vlastní'
                },
                paragraphSpacingCustomSize: {
                    title: 'Vlastní odstup odstavce',
                    label: 'Odstup odstavce',
                    value: '1.5em'
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
                },
                paragraphSpacings: {
                    '0': 'Ingen afstand',
                    '0.5em': 'Lille afstand',
                    '1em': 'Normal afstand',
                    '1.5em': 'Stor afstand',
                    '2em': 'Ekstra stor afstand',
                    'custom': 'Brugerdefineret'
                },
                paragraphSpacingCustomSize: {
                    title: 'Brugerdefineret afstand mellem afsnit',
                    label: 'Afstand mellem afsnit',
                    value: '1.5em'
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
                },
                paragraphSpacings: {
                    '0': 'Kein Abstand',
                    '0.5em': 'Kleiner Abstand',
                    '1em': 'Normaler Abstand',
                    '1.5em': 'Großer Abstand',
                    '2em': 'Sehr großer Abstand',
                    'custom': 'Benutzerdefiniert'
                },
                paragraphSpacingCustomSize: {
                    title: 'Benutzerdefinierter Abstand zwischen Absätzen',
                    label: 'Abstand zwischen Absätzen',
                    value: '1.5em'
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
                },
                paragraphSpacings: {
                    '0': 'Ilma vaheta',
                    '0.5em': 'Väike vahe',
                    '1em': 'Tavaline vahe',
                    '1.5em': 'Suur vahe',
                    '2em': 'Väga suur vahe',
                    'custom': 'Kohandatud'
                },
                paragraphSpacingCustomSize: {
                    title: 'Kohandatud lõigu vahe',
                    label: 'Lõigu vahe',
                    value: '1.5em'
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
                },
                paragraphSpacings: {
                    '0': 'Pas d\'espacement',
                    '0.5em': 'Espacement réduit',
                    '1em': 'Espacement normal',
                    '1.5em': 'Espacement large',
                    '2em': 'Espacement très large',
                    'custom': 'Personnalisé'
                },
                paragraphSpacingCustomSize: {
                    title: 'Espacement de paragraphe personnalisé',
                    label: 'Espacement de paragraphe',
                    value: '1.5em'
                }
            },
            hu: {
                lineheight: 'Sorköz',
                lineheights: {
                    '0.9': 'Kicsi',
                    'normal': 'Normál',
                    '1.5': 'Nagy',
                    '2.0': 'Extra nagy',
                    'custom': 'Egyéni'
                },
                lineheightCustomSize: {
                    title: 'Egyéni sorköz',
                    label: 'Sorköz',
                    value: '1.5'
                },
                paragraphSpacings: {
                    '0': 'Nincs térköz',
                    '0.5em': 'Kis térköz',
                    '1em': 'Normál térköz',
                    '1.5em': 'Nagy térköz',
                    '2em': 'Extra nagy térköz',
                    'custom': 'Egyéni'
                },
                paragraphSpacingCustomSize: {
                    title: 'Egyéni bekezdés távolság',
                    label: 'Bekezdés távolság',
                    value: '1.5em'
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
                },
                paragraphSpacings: {
                    '0': 'Senza spaziatura',
                    '0.5em': 'Spaziatura ridotta',
                    '1em': 'Spaziatura normale',
                    '1.5em': 'Spaziatura ampia',
                    '2em': 'Spaziatura molto ampia',
                    'custom': 'Personalizzata'
                },
                paragraphSpacingCustomSize: {
                    title: 'Spaziatura paragrafo personalizzata',
                    label: 'Spaziatura paragrafo',
                    value: '1.5em'
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
                },
                paragraphSpacings: {
                    '0': '간격 없음',
                    '0.5em': '좁은 간격',
                    '1em': '보통 간격',
                    '1.5em': '넓은 간격',
                    '2em': '아주 넓은 간격',
                    'custom': '사용자 정의'
                },
                paragraphSpacingCustomSize: {
                    title: '사용자 정의 단락 간격',
                    label: '단락 간격',
                    value: '1.5em'
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
                },
                paragraphSpacings: {
                    '0': 'Geen afstand',
                    '0.5em': 'Kleine afstand',
                    '1em': 'Normale afstand',
                    '1.5em': 'Grote afstand',
                    '2em': 'Extra grote afstand',
                    'custom': 'Aangepast'
                },
                paragraphSpacingCustomSize: {
                    title: 'Aangepaste alinea-afstand',
                    label: 'Alinea-afstand',
                    value: '1.5em'
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
                },
                paragraphSpacings: {
                    '0': 'Sem espaçamento',
                    '0.5em': 'Espaçamento pequeno',
                    '1em': 'Espaçamento regular',
                    '1.5em': 'Espaçamento grande',
                    '2em': 'Espaçamento extra grande',
                    'custom': 'Personalizado'
                },
                paragraphSpacingCustomSize: {
                    title: 'Espaçamento de parágrafo personalizado',
                    label: 'Espaçamento de parágrafo',
                    value: '1.5em'
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
                },
                paragraphSpacings: {
                    '0': 'Без интервала',
                    '0.5em': 'Малый интервал',
                    '1em': 'Обычный интервал',
                    '1.5em': 'Большой интервал',
                    '2em': 'Очень большой интервал',
                    'custom': 'Пользовательский'
                },
                paragraphSpacingCustomSize: {
                    title: 'Пользовательский интервал абзаца',
                    label: 'Интервал абзаца',
                    value: '1.5em'
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
                },
                paragraphSpacings: {
                    '0': 'Bez odstupu',
                    '0.5em': 'Malý odstup',
                    '1em': 'Normálny odstup',
                    '1.5em': 'Veľký odstup',
                    '2em': 'Extra veľký odstup',
                    'custom': 'Vlastný'
                },
                paragraphSpacingCustomSize: {
                    title: 'Vlastná spaciálna výška',
                    label: 'Spaciálna výška',
                    value: '1.5em'
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
                },
                paragraphSpacings: {
                    '0': 'Brez odmika',
                    '0.5em': 'Majhen odmik',
                    '1em': 'Navaden odmik',
                    '1.5em': 'Velik odmik',
                    '2em': 'Ekstra velik odmik',
                    'custom': 'Uporabniški'
                },
                paragraphSpacingCustomSize: {
                    title: 'Uporabniško določena višina odstavka',
                    label: 'Višina odstavka',
                    value: '1.5em'
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
                },
                paragraphSpacings: {
                    '0': 'Boşluk yok',
                    '0.5em': 'Küçük boşluk',
                    '1em': 'Normal boşluk',
                    '1.5em': 'Büyük boşluk',
                    '2em': 'Çok büyük boşluk',
                    'custom': 'Özel'
                },
                paragraphSpacingCustomSize: {
                    title: 'Özel paragraflar arası boşluk',
                    label: 'Paragraflar arası boşluk',
                    value: '1.5em'
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
                },
                paragraphSpacings: {
                    '0': '無間距',
                    '0.5em': '小間距',
                    '1em': '正常間距',
                    '1.5em': '大間距',
                    '2em': '特大間距',
                    'custom': '自訂'
                },
                paragraphSpacingCustomSize: {
                    title: '自訂段落間距',
                    label: '段落間距',
                    value: '1.5em'
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
        allowCustomSize: true,
        paragraphSpacingList: [
            '0',
            '0.5em',
            '1em',
            '1.5em',
            '2em'
        ],
        allowCustomParagraphSpacing: true,
        enableBrCommand: true
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

    function setParagraphSpacing (trumbowyg, spacing) {
        trumbowyg.saveRange();
        try {
            var selection = window.getSelection();
            if (selection.rangeCount) {
                var range = selection.getRangeAt(0);
                var startContainer = range.startContainer;
                var endContainer = range.endContainer;

                if (startContainer != endContainer) {
                    var $editor = $(trumbowyg.$ed);
                    var $paragraphs = $editor.find('p');

                    $paragraphs.each(function () {
                        var p = this;

                        if (selection.containsNode(p, true)) {
                            $(p).css('marginBottom', spacing);
                        }
                    });
                } else {
                    var node = startContainer.nodeType == 3 ? startContainer.parentNode : startContainer;
                    var $paragraph = $(node).closest('p');

                    if ($paragraph.length == 0) {
                        var $editor = $(trumbowyg.$ed);
                        var $paragraphs = $editor.find('p');

                        $paragraphs.each(function () {
                            var p = this;
                            if (range.intersectsNode(p)) {
                                $paragraph = $(p);
                                return false;
                            }
                        });
                    }

                    if ($paragraph.length > 0) {
                        $paragraph.css('marginBottom', spacing);
                    }
                }

                trumbowyg.syncCode();
            }
        } catch (e) {
            console.error('Error setting paragraph spacing:', e);
        }
    }

    function insertBr (trumbowyg) {
        trumbowyg.saveRange();
        try {
            var selection = window.getSelection();
            if (selection.rangeCount) {
                var range = selection.getRangeAt(0);
                var br = document.createElement('br');

                range.deleteContents();
                range.insertNode(br);
                range.setStartAfter(br);
                range.setEndAfter(br);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        } catch (e) {
            document.execCommand('insertHTML', false, '<br>');
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

                    if (trumbowyg.o.plugins.lineheight.enableBrCommand) {
                        trumbowyg.addBtnDef('insertBr', {
                            ico: 'insertBr',
                            text: trumbowyg.lang.insertBr || 'Insert line break',
                            fn: function () {
                                insertBr(trumbowyg);
                            }
                        });

                        trumbowyg.$c.on('tbwinit', function () {
                            if (trumbowyg.$ed) {
                                trumbowyg.$ed.on('keydown', function (e) {
                                    if (e.shiftKey && e.keyCode == 13) {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        insertBr(trumbowyg);
                                        return false;
                                    }
                                });
                            }
                        });
                    }

                    trumbowyg.addBtnDef('paragraphSpacing', {
                        dropdown: buildParagraphSpacingDropdown(trumbowyg)
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

    function buildParagraphSpacingDropdown (trumbowyg) {
        var dropdown = [];

        $.each(trumbowyg.o.plugins.lineheight.paragraphSpacingList, function (index, spacing) {
            trumbowyg.addBtnDef('paragraphSpacing_' + spacing.replace('.', '_'), {
                text: trumbowyg.lang.paragraphSpacings[spacing] || spacing,
                hasIcon: false,
                fn: function () {
                    setParagraphSpacing(trumbowyg, spacing);
                }
            });
            dropdown.push('paragraphSpacing_' + spacing.replace('.', '_'));
        });

        if (trumbowyg.o.plugins.lineheight.allowCustomParagraphSpacing) {
            var customSpacingButtonName = 'paragraphSpacing_custom';
            var customSpacingBtnDef = {
                fn: function () {
                    var targetParagraphs = [];

                    try {
                        var selection = window.getSelection();
                        if (selection.rangeCount) {
                            var range = selection.getRangeAt(0);
                            var startContainer = range.startContainer;
                            var endContainer = range.endContainer;

                            if (startContainer != endContainer) {
                                var $editor = $(trumbowyg.$ed);
                                var $paragraphs = $editor.find('p');

                                $paragraphs.each(function () {
                                    if (selection.containsNode(this, true)) {
                                        targetParagraphs.push(this);
                                    }
                                });
                            } else {
                                var node = startContainer.nodeType == 3 ? startContainer.parentNode : startContainer;
                                var $paragraph = $(node).closest('p');

                                if ($paragraph.length == 0) {
                                    var $editor = $(trumbowyg.$ed);
                                    var $paragraphs = $editor.find('p');

                                    $paragraphs.each(function () {
                                        if (range.intersectsNode(this)) {
                                            $paragraph = $(this);
                                            return false;
                                        }
                                    });
                                }

                                if ($paragraph.length > 0) {
                                    targetParagraphs.push($paragraph[0]);
                                }
                            }
                        }
                    } catch (e) {
                        console.error('Error finding target paragraphs:', e);
                    }

                    trumbowyg.openModalInsert(trumbowyg.lang.paragraphSpacingCustomSize.title,
                        {
                            spacing: {
                                label: trumbowyg.lang.paragraphSpacingCustomSize.label,
                                value: trumbowyg.lang.paragraphSpacingCustomSize.value
                            }
                        },
                        function (form) {
                            $.each(targetParagraphs, function (index, paragraph) {
                                $(paragraph).css('marginBottom', form.spacing);
                            });

                            trumbowyg.syncCode();
                            return true;
                        }
                    );
                },
                text: '<span style="font-size: medium;">' + trumbowyg.lang.paragraphSpacings.custom + '</span>',
                hasIcon: false
            };
            trumbowyg.addBtnDef(customSpacingButtonName, customSpacingBtnDef);
            dropdown.push(customSpacingButtonName);
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



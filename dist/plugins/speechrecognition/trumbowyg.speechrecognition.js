/* ===========================================================
 * trumbowyg.speechrecognition.js v1.0
 * Speech recognition plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Authors :
 *  - Tobias Rohde
 *  - Alexandre Demode (Alex-D)
 * Website : tobiasrohde.de
 */
(function ($) {
    'use strict';

    const defaultOptions = {
        lang: 'en-US'
    };

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

    function buildButtonDef(trumbowyg) {
        let btnElement = null;
        let isRecognizing = false;
        let $resultTextParagraph = null;

        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1; // We only read the first

        recognition.onstart = function () {
            isRecognizing = true;
            btnElement.style.color = '#e71d36';
        };

        recognition.onerror = function () {
            isRecognizing = false;
            btnElement.style.removeProperty('color');
        };

        recognition.onend = function () {
            isRecognizing = false;
            btnElement.style.removeProperty('color');
        };

        recognition.onresult = function (event) {
            const resultText = [...event.results].map((result) => {
                return result[0].transcript + (result.isFinal ? '<br>' : '');
            }).join('');
            $resultTextParagraph.html(resultText);
            trumbowyg.range.setEndAfter($resultTextParagraph[0]);
            trumbowyg.range.collapse();
            trumbowyg.syncCode();
        };

        return {
            isSupported,
            fn: function () {
                if (isRecognizing) {
                    recognition.stop();
                    return;
                }

                // Get the actual button to allow to switch his color
                btnElement = trumbowyg.$btnPane.find('.' + trumbowyg.o.prefix + 'speechrecognition-button svg')[0];

                // Create a container if needed in which we will put the recognized text
                trumbowyg.$ed.focus();
                setTimeout(() => {
                    trumbowyg.saveRange();
                    if (
                        trumbowyg.range.startContainer === trumbowyg.range.endContainer &&
                        trumbowyg.range.startContainer.nodeName === 'P' &&
                        trumbowyg.range.startContainer.innerText.trim() === ''
                    ) {
                        $resultTextParagraph = $(trumbowyg.range.startContainer);
                    } else {
                        $resultTextParagraph = $('<p/>');
                        trumbowyg.range.deleteContents();
                        trumbowyg.range.insertNode($resultTextParagraph[0]);
                    }

                    // Set up the recognition
                    recognition.lang = trumbowyg.o.plugins.speechRecognition.lang;
                    recognition.start();
                });
            }
        };
    }

    function isSupported() {
        return SpeechRecognition !== undefined;
    }


    $.extend(true, $.trumbowyg, {
        langs: {
            az: {
                speechRecognition: 'Nitqin tanınması'
            },
            bg: {
                speechRecognition: 'Разпознаване на реч'
            },
            by: {
                speechRecognition: 'Распазнаванне маўлення'
            },
            ca: {
                speechRecognition: 'Reconeixement de veu'
            },
            cs: {
                speechRecognition: 'Rozpoznávání řeči'
            },
            da: {
                speechRecognition: 'Talegenkendelse'
            },
            de: {
                speechRecognition: 'Spracherkennung'
            },
            el: {
                speechRecognition: 'Αναγνώριση ομιλίας'
            },
            en: {
                speechRecognition: 'Speech recognition'
            },
            es: {
                speechRecognition: 'Reconocimiento de voz'
            },
            et: {
                speechRecognition: 'Kõnetuvastus'
            },
            fi: {
                speechRecognition: 'Puheentunnistus'
            },
            fr: {
                speechRecognition: 'Reconnaissance vocale'
            },
            hr: {
                speechRecognition: 'Prepoznavanje govora'
            },
            hu: {
                speechRecognition: 'Beszédfelismerés'
            },
            it: {
                speechRecognition: 'Riconoscimento vocale'
            },
            lt: {
                speechRecognition: 'Kalbos atpažinimas'
            },
            nb: {
                speechRecognition: 'Talegjenkjenning'
            },
            nl: {
                speechRecognition: 'Spraakherkenning'
            },
            pl: {
                speechRecognition: 'Rozpoznawanie mowy'
            },
            pt: {
                speechRecognition: 'Reconhecimento de voz'
            },
            ro: {
                speechRecognition: 'Recunoașterea vorbirii'
            },
            rs: {
                speechRecognition: 'Препознавање говора'
            },
            ru: {
                speechRecognition: 'Распознавание речи'
            },
            sk: {
                speechRecognition: 'Rozpoznávanie reči'
            },
            sq: {
                speechRecognition: 'Njohja e të folurit'
            },
            sv: {
                speechRecognition: 'Taligenkänning'
            },
            ua: {
                speechRecognition: 'Розпізнавання мови'
            }
        },

        plugins: {
            speechRecognition: {
                shouldInit: isSupported,
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.speechRecognition = $.extend(true, {},
                        defaultOptions,
                        trumbowyg.o.plugins.speechRecognition || {}
                    );

                    trumbowyg.addBtnDef('speechrecognition', buildButtonDef(trumbowyg));
                }
            }
        }
    });
})(jQuery);

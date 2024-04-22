/* ===========================================================
 * trumbowyg.speechrecognition.js v1.0
 * Speech recognition plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Tobias Rohde
 * Website : tobiasrohde.de
 */
(function ($) {
    'use strict';

    const defaultOptions = {
        lang: 'en-GB'
    };

    const iconWrap = $(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    let btnElement = null;
    let editor = null;
    let finalText = '';
    let recognizing = false;

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    //const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
        recognizing = true;
        btnElement.style.fill='red';
    };

    recognition.onerror = function() {
        recognizing = false;
        btnElement.style.fill='#222';
    };

    recognition.onend = function() {
        recognizing = false;
        btnElement.style.fill='#222';
    };

    recognition.onresult = function(event) {
        let interimText = '';
        if (typeof(event.results) === 'undefined') {
            recognition.onend = null;
            recognition.stop();
            return;
        }
        for (let i = event.resultIndex; i < event.results.length; i+=1) {
            if (event.results[i].isFinal) {
                finalText += event.results[i][0].transcript + '<br>';
                editor.html(finalText);
            } else {
                interimText += event.results[i][0].transcript;
                editor.html(finalText + interimText);
            }
        }
    };

    function buildButtonDef (trumbowyg) {
        return {
            fn: function () {
                if (recognizing) {
                    recognition.stop();
                    return;
                }

                // I don't know it there's a more elegant way to access the speech recognition button.
                btnElement = document.body.querySelector(`#${trumbowyg.$c[0].id}`).parentElement.querySelector('.trumbowyg-speechrecognition-button').firstChild;
                editor = trumbowyg;
                finalText = '';
                recognition.lang = trumbowyg.o.plugins.speechrecognition.lang;
                recognition.start();
                btnElement.style.fill='red';
            }
        };
    }

    function buildButtonIcon() {
        if ($('#trumbowyg-speechrecognition').length > 0) {
            return;
        }

        iconWrap.addClass('trumbowyg-icons');

        // Mic icon from Remix Icon - https://remixicon.com/
        iconWrap.html(`
            <symbol id="trumbowyg-speechrecognition" viewBox="0 0 24 24">
                <path class="btn-speechrecognition" d="M11.9998 3C10.3429 3 8.99976 4.34315 8.99976 6V10C8.99976 11.6569 10.3429 13 11.9998 13C13.6566 13 14.9998 11.6569 14.9998 10V6C14.9998 4.34315 13.6566 3 11.9998 3ZM11.9998 1C14.7612 1 16.9998 3.23858 16.9998 6V10C16.9998 12.7614 14.7612 15 11.9998 15C9.23833 15 6.99976 12.7614 6.99976 10V6C6.99976 3.23858 9.23833 1 11.9998 1ZM3.05469 11H5.07065C5.55588 14.3923 8.47329 17 11.9998 17C15.5262 17 18.4436 14.3923 18.9289 11H20.9448C20.4837 15.1716 17.1714 18.4839 12.9998 18.9451V23H10.9998V18.9451C6.82814 18.4839 3.51584 15.1716 3.05469 11Z"></path>
            </symbol>
        `).appendTo(document.body);
    }


    $.extend(true, $.trumbowyg, {
        langs: {
            az: {
                speechrecognition: 'Nitqin tanınması'
            },
            bg: {
                speechrecognition: 'Разпознаване на реч'
            },
            by: {
                speechrecognition: 'Распазнаванне маўлення'
            },
            ca: {
                speechrecognition: 'Reconeixement de veu'
            },
            cs: {
                speechrecognition: 'Rozpoznávání řeči'
            },
            da: {
                speechrecognition: 'Talegenkendelse'
            },
            de: {
                speechrecognition: 'Spracherkennung'
            },
            el: {
                speechrecognition: 'Αναγνώριση ομιλίας'
            },
            en: {
                speechrecognition: 'Speech recognition'
            },
            es: {
                speechrecognition: 'Reconocimiento de voz'
            },
            et: {
                speechrecognition: 'Kõnetuvastus'
            },
            fi: {
                speechrecognition: 'Puheentunnistus'
            },
            fr: {
                speechrecognition: 'Reconnaissance vocale'
            },
            hr: {
                speechrecognition: 'Prepoznavanje govora'
            },
            hu: {
                speechrecognition: 'Beszédfelismerés'
            },
            it: {
                speechrecognition: 'Riconoscimento vocale'
            },
            lt: {
                speechrecognition: 'Kalbos atpažinimas'
            },
            nb: {
                speechrecognition: 'Talegjenkjenning'
            },
            nl: {
                speechrecognition: 'Spraakherkenning'
            },
            pl: {
                speechrecognition: 'Rozpoznawanie mowy'
            },
            pt: {
                speechrecognition: 'Reconhecimento de voz'
            },
            ro: {
                speechrecognition: 'Recunoașterea vorbirii'
            },
            rs: {
                speechrecognition: 'Препознавање говора'
            },
            ru: {
                speechrecognition: 'Распознавание речи'
            },
            sk: {
                speechrecognition: 'Rozpoznávanie reči'
            },
            sq: {
                speechrecognition: 'Njohja e të folurit'
            },
            sv: {
                speechrecognition: 'Taligenkänning'
            },
            ua: {
                speechrecognition: 'Розпізнавання мови'
            }
        },

        plugins: {
            speechrecognition: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.speechrecognition = $.extend(true, {},
                        defaultOptions,
                        trumbowyg.o.plugins.speechrecognition || {}
                    );

                    // Unfortunately Firefox has not implemented the WebSpeechAPI yet.
                    if(!navigator.userAgent.toLowerCase().includes('firefox')) {
                        buildButtonIcon();
                        trumbowyg.addBtnDef('speechrecognition', buildButtonDef(trumbowyg));
                    }
                }
            }
        }
    });
})(jQuery);

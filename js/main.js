'use strict';

hljs.initHighlightingOnLoad();

(function ($) {
    if ($.trumbowyg) {
        var configurations = {
            core: {},
            plugins: {
                btnsDef: {
                    // Customizables dropdowns
                    image: {
                        dropdown: ['insertImage', 'upload', 'base64', 'noEmbed'],
                        ico: 'insertImage'
                    }
                },
                btns: [
                    ['viewHTML'],
                    ['undo', 'redo'],
                    ['formatting'],
                    'btnGrp-design',
                    ['link'],
                    ['image'],
                    'btnGrp-justify',
                    'btnGrp-lists',
                    ['foreColor', 'backColor'],
                    ['preformatted'],
                    ['horizontalRule'],
                    ['fullscreen']
                ],
                plugins: {
                    // Add imagur parameters to upload plugin
                    upload: {
                        serverPath: 'https://api.imgur.com/3/image',
                        fileFieldName: 'image',
                        headers: {
                            'Authorization': 'Client-ID 9e57cb1c4791cea'
                        },
                        urlPropertyName: 'data.link'
                    }
                }
            }
        };

        // Demo switch
        var $demoTextarea = $('#trumbowyg-demo');
        $demoTextarea.trumbowyg();
        $('.demo-switcher .button').on('click', function () {
            var $current = $('.demo-switcher .current');
            $(this).parent().removeClass('current-' + $current.data('config'));
            $current.removeClass('current');
            $(this).addClass('current');
            $(this).parent().addClass('current-' + $(this).data('config'));
            $demoTextarea.trumbowyg('destroy');
            $demoTextarea.trumbowyg(configurations[$(this).data('config')]);
        });

        // Lang accordion
        $('#lang-list-view-full').on('click', function () {
            $('#lang-list-light').slideUp(100);
            $('#lang-list-full').slideDown(350);
        });
    }

    // Languages continent switch
    var $continentNames = $('.continent-name');
    $continentNames.click(function () {
        if (!$(this).parent().hasClass('open')) {
            var $oldOpen = $('#languages').find('.open');
            $oldOpen.removeClass('open');
            $(this).parent().addClass('open');
        }
    }).next().hide();
    $continentNames.last().parent().addClass('open');
    $continentNames.last().next().show();

    // Add anchors
    $('.feature h3[id]').each(function () {
        $(this).after($('<a/>', {
            text: '§',
            'class': 'title-link',
            href: '#' + $(this).attr('id'),
            title: 'Permalink to ' + $(this).text()
        }));
    });

    // Toggle class on body to show/hide removed features
    $('#show-removed').click(function () {
        $('body').toggleClass('show-removed');
    });
})(jQuery);

/* Google Analytics */
var _gaq = [['_setAccount', 'UA-35470243-1'], ['_trackPageview']];
(function (d, t) {
    var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
    g.src = ('https:' === location.protocol ? '//ssl' : '//www') + '.google-analytics.com/ga.js';
    s.parentNode.insertBefore(g, s);
}(document, 'script'));
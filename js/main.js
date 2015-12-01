hljs.initHighlightingOnLoad();

(function ($, undefined) {
    if ($.trumbowyg) {
        // Add imagur parameters to upload plugin
        $.extend(true, $.trumbowyg.upload, {
            serverPath: 'https://api.imgur.com/3/image',
            fileFieldName: 'image',
            headers: {'Authorization': 'Client-ID 9e57cb1c4791cea'},
            urlPropertyName: 'data.link'
        });

        var fullOptions = {
            btnsDef: {
                // Customizables dropdowns
                image: {
                    dropdown: ['insertImage', 'upload', 'base64'],
                    ico: 'insertImage'
                },
                linkImproved: {
                    dropdown: ['createLink', 'editLink', 'unlink'],
                    ico: 'link'
                }
            },
            btns: ['viewHTML',
                '|', 'formatting',
                '|', 'btnGrp-design',
                '|', 'linkImproved',
                '|', 'image',
                '|', 'btnGrp-justify',
                '|', 'btnGrp-lists',
                '|', 'foreColor', 'backColor',
                '|', 'preformatted',
                '|', 'horizontalRule']
        };

        // Demo switch
        var $demoTextarea = $('#trumbowyg-demo');
        $demoTextarea.trumbowyg();
        $('.big-button-switch').on('click', function () {
            $('.big-button-switch.current').removeClass('current');
            $(this).addClass('current');
            $demoTextarea.trumbowyg('destroy');
            $demoTextarea.trumbowyg($(this).attr('id').indexOf('plugins') > 0 ? fullOptions : {});
        });

        // Lang accordion
        $('#lang-list-view-full').on('click', function () {
            $('#lang-list-light').slideUp(100);
            $('#lang-list-full').slideDown(350);
        });
    }

    // Pre-header cross-project
    $('.cross-projects-open-button').on('click', function () {
        $('.cross-projects-list').slideToggle(200);
    });

    // Add anchors
    $('.feature h3[id]').each(function () {
        $(this).after($('<a/>', {
            text: '§',
            'class': 'title-link',
            href: '#' + $(this).attr('id'),
            title: 'Permalink to ' + $(this).text()
        }));
    });
})(jQuery);
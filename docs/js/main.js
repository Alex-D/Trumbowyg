'use strict';

if (window.location.href.indexOf('index.html') > 0) {
    window.location = window.location.href.replace('index.html', '');
}

hljs.initHighlightingOnLoad();

(function ($) {
    if ($.trumbowyg) {
        var configurations = {
            core: {},
            plugins: {
                btnsDef: {
                    // Customizable dropdowns
                    align: {
                        dropdown: ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                        ico: 'justifyLeft'
                    }
                },
                btns: [
                    ['viewHTML'],
                    ['undo', 'redo'],
                    ['formatting'],
                    ['strong', 'em', 'del', 'underline'],
                    ['foreColor', 'backColor'],
                    ['link'],
                    ['insertImage', 'upload', 'base64', 'noembed', 'giphy'],
                    ['align'],
                    ['preformatted'],
                    ['horizontalRule'],
                    ['fullscreen']
                ],
                plugins: {
                    giphy: {
                        apiKey: 'dNhCbN6hrhpBMxXhIswM34wIR2UBpCns'
                    },
                    // Add imgur parameters to upload plugin
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
        $demoTextarea.trumbowyg(configurations.core);
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
    $continentNames.each(function () {
        $(this).parent().attr('data-height', $(this).parent().height());
    });
    $continentNames.click(function () {
        var $oldOpen = $('#languages').find('.col-list ul li[style]');
        $oldOpen.removeAttr('style');
        $(this).parent().css({
            height: $(this).parent().attr('data-height') + 'px'
        });
    });
    $continentNames.last().parent().css({
        height: $continentNames.last().parent().attr('data-height') + 'px'
    });

    // Add anchors
    $('.feature h3[id]').each(function () {
        $(this).after($('<a/>', {
            html: '<svg><use xlink:href="#trumbowyg-link"></use></svg>',
            'class': 'title-link',
            href: '#' + $(this).attr('id'),
            title: 'Permalink to ' + $(this).text()
        }));
    });

    // Force scroll to anchor
    setTimeout(function () {
        if (window.location.hash.length > 1 &&
            $(window.location.hash).length > 0 &&
            $(window.location.hash).offset().top > 0
        ) {
            $('main').scrollTop($(window.location.hash).offset().top);
        }
    }, 100);

    // Show star count
    function setStarsCount(stars) {
        $('.star-count').text(stars);
    }

    var date = new Date();
    var starsKey = 'stars_' + date.getMonth() + '_' + date.getYear();
    var stars = localStorage.getItem(starsKey);
    if (!stars) {
        $.ajax('https://api.github.com/repos/Alex-D/Trumbowyg', {
            success: function (data) {
                var stars = data.stargazers_count; // jshint ignore:line
                localStorage.clear();
                localStorage.setItem(starsKey, stars);
                setStarsCount(stars);
            }
        });
    } else {
        setStarsCount(stars);
    }

    // Switch iframe src for demos
    if ($('.main-demos').length > 0) {
        $('.documentation-summary a').each(function() {
            var demoHash = $(this).attr('href').replace('.html', '').replace(/[\/.]/g, '-').replace(/^-*/g, '');
            $(this).attr('data-hash', demoHash);
            $(this).click(function() {
                $('.main-demos iframe').attr('src', $(this).attr('href'));
                window.location.hash = demoHash;
                return false;
            });
        });
        if (window.location.hash.length > 1) {
            var demoHref = $('[data-hash="' + window.location.hash.replace('#', '') + '"]').attr('href');
            $('.main-demos iframe').attr('src', demoHref);
        }
    }
})(jQuery);

/* Google Analytics */
// jshint ignore:start
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('set', 'anonymizeIp', true);
ga('create', 'UA-35470243-1', 'auto');
ga('send', 'pageview');

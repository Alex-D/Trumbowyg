hljs.initHighlightingOnLoad();

(function($, undefined){
    $('.cross-projects-open-button').on('click', function(){
        $('.cross-projects-list').slideToggle(200);
    });

    // Lang accordion
    $('#lang-list-view-full').on('click', function(){
        $('#lang-list-light').slideUp(100);
        $('#lang-list-full').slideDown(350);
    });

    // Add anchors
    $('.feature h3[id]').each(function(){
        $(this).after($('<a/>', {
            text: '§',
            'class': 'title-link',
            href: '#' + $(this).attr('id'),
            title: 'Permalink to ' + $(this).text()
        }));
    });
})(jQuery);
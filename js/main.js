hljs.initHighlightingOnLoad();

(function($, undefined){
    $(".cross-projects-open-button").on("click", function(){
        $(".cross-projects-list").slideToggle(200);
    });

    // Add anchors
    $('.feature h3[id]').each(function(){
        $(this).after($('<a/>', {
            text: '§',
            'class': 'title-link',
            href: '#' + $(this).attr('id'),
            title: "Permalink to " + $(this).text()
        }));
    });
})(jQuery);
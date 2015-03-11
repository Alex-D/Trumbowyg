hljs.initHighlightingOnLoad();

(function($, undefined){
	$(".cross-projects-open-button").on("click", function(){
		$(".cross-projects-list").slideToggle(200);
	});
})(jQuery);
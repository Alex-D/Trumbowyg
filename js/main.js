hljs.initHighlightingOnLoad();


var offset = parseInt($('#container').css('padding-top'));

$('section').each(function(eq){
	var $that = $(this);
	$that.attr('id', "js-"+$that.attr('id'));
	$that.attr('data-eq', eq+1);
});

$(document).ready(function(){
	$('body').pageScroller({
		navigation: "header nav",
		keyboardControl: false,
		HTML5mode: true,
		scrollOffset: - offset - 10
	});
});

$('a.link').click(function(e){
	var $that = $(this);
	pageScroller.goTo($($that.attr('href').replace(/\#/, '#js-')).attr('data-eq'));
});




$('#page a[href^="#"]').click(function(e){
	if($($(this).attr('href')).size() > 0)
		scrollGoto($(this).attr('href'));
	else
		scrollGoto('#js-' + $(this).attr('href').replace('#', ''));
	e.preventDefault();
});

function scrollGoto(cible){
	var hauteur = ($(cible).size() > 0) ? (parseInt($(cible).offset().top) - offset - 10)+"px" : 0;
	$('html,body').animate({scrollTop: hauteur}, 750);
}
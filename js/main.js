var offset = parseInt($('#container').css('padding-top'));

$('section').each(function(eq){
	var $that = $(this);
	$that.attr('id', "js-"+$that.attr('id'));
	$that.attr('data-eq', eq+1);
});

$(document).ready(function(){
	$('body').pageScroller({
		section: ".section",
		navigation: "header nav",
		deepLink: true,
		scrollOffset: - offset -10
	});
});

$('a.link').click(function(e){
	var $that = $(this);
	pageScroller.goTo($($that.attr('href').replace(/\#/, '#js-')).attr('data-eq'));
});




$('#page a[href^="#"]').click(function(e){
	scrollGoto($(this).attr('href'));
	e.preventDefault();
});

function scrollGoto(cible){
	var hauteur = ($(cible).length >= 1) ? (parseInt($(cible).offset().top) - offset - 20)+"px" : 0;
	$('html,body').animate({scrollTop: hauteur}, 750);
}
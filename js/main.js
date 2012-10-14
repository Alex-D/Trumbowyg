$('a[href^="#"]').click(function(e){
	scrollGoto($(this).attr('href'));
	e.preventDefault();
});

function scrollGoto(cible){
	var hauteur = ($(cible).length >= 1) ? (parseInt($(cible).offset().top) - parseInt($('#container').css('padding-top')) - 15)+"px" : 0;
	$('html,body').animate({scrollTop: hauteur}, 750);
}
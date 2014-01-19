/* ===========================================================
 * trumbowyg.upload.js
 * Upload plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Alexandre Demode (Alex-D)
 *          Twitter : @AlexandreDemode
 *          Website : alex-d.fr
 */


/**
 *
 * /!\ IN DEV - NOT FUNCTIONAL /!\
 * This plugin is in developement, do not use it
 * 
 */
(function($){
	$.extend($.trumbowyg.langs.en, {
		upload: "Upload",
		file: 	"File"
	});

	$.extend($.trumbowyg.langs.fr, {
		upload: "Envoi",
		file: 	"Fichier"
	});



	$.trumbowyg.opts.btnsDef = {
		upload: {
			func: function(params, tbw){
				tbw.openModalInsert(
					tbw.lang['upload'],
					{
						file: {
							type: 'file'
						},
						description: {}
					},
					function(){
						console.log("cool ! It's ok !");
					}
				);
			}
		}
	};
})(jQuery);
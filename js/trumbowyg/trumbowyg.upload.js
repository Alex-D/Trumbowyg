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
	$.extend(true, $.trumbowyg, {
		langs: {
			en: {
				upload: "Upload",
				file: 	"File"
			},
			fr: {
				upload: "Envoi",
				file: 	"Fichier"
			}
		},

		opts: {
			btnsDef: {
				insertImage: { dropdown: ['insertImage', 'upload'] },
				upload: {
					func: function(params, tbw){
						tbw.openModalInsert(
							// Title
							tbw.lang['upload'],

							// Fields
							{
								file: {
									type: 'file',
									required: true
								},
								alt: {
									label: 'description'
								}
							},

							// Callback
							function(values){
								console.log(values);
							}
						);
					}
				}
			}
		}
	});
})(jQuery);
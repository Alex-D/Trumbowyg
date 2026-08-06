/* ===========================================================
 * trumbowyg.pasteembed.js v1.0
 * Url paste to iframe with noembed. Plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Max Seelig
 *          Facebook : https://facebook.com/maxse
 *          Website : https://www.maxmade.nl/
 */
!function(e){"use strict";var t={enabled:!0,endpoint:"https://noembed.com/embed?nowrap=on"};e.extend(!0,e.trumbowyg,{plugins:{pasteEmbed:{init:function(n){n.o.plugins.pasteEmbed=e.extend(!0,{},t,n.o.plugins.pasteEmbed||{}),Array.isArray(n.o.plugins.pasteEmbed.endpoints)&&(n.o.plugins.pasteEmbed.endpoint=n.o.plugins.pasteEmbed.endpoints[0]),n.o.plugins.pasteEmbed.enabled&&n.pasteHandlers.push((function(t){try{var a=(t.originalEvent||t).clipboardData.getData("Text"),s=n.o.plugins.pasteEmbed.endpoint;if(!a.startsWith("http"))return;t.stopPropagation(),t.preventDefault();var i=new URL(s);i.searchParams.append("url",a.trim()),fetch(i,{method:"GET",cache:"no-cache",signal:AbortSignal.timeout(2e3)}).then((e=>e.json().then((e=>e.html)))).catch((()=>{})).then((t=>{void 0===t&&(t=e("<a>",{href:a,text:a})[0].outerHTML),n.execCmd("insertHTML",t)}))}catch(e){}}))}}}})}(jQuery);
/* ===========================================================
 * trumbowyg.mention.js v0.1
 * Mention plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Viper
 *          Github: https://github.com/Globulopolis
 *          Website: http://киноархив.com
 */
!function(n){"use strict";var t={source:[],formatDropdownItem:function(n){return n.login},formatResult:function(n){return"@"+n.login+" "}};function e(t,e){var o=[];return n.each(t,(function(n,t){var i="mention-"+n,m={hasIcon:!1,text:e.o.plugins.mention.formatDropdownItem(t),fn:function(){return e.execCmd("insertHTML",e.o.plugins.mention.formatResult(t)),!0}};e.addBtnDef(i,m),o.push(i)})),o}n.extend(!0,n.trumbowyg,{langs:{en:{mention:"Mention"},az:{mention:"Bildirmək"},by:{mention:"Згадаць"},da:{mention:"Nævn"},de:{mention:"Erwähnung"},et:{mention:"Maini"},fr:{mention:"Mentionner"},hu:{mention:"Említ"},ko:{mention:"언급"},pt_br:{mention:"Menção"},ru:{mention:"Упомянуть"},sl:{mention:"Omeni"},tr:{mention:"Bahset"},zh_tw:{mention:"標記"}},plugins:{mention:{init:function(o){o.o.plugins.mention=n.extend(!0,{},t,o.o.plugins.mention||{});var i={dropdown:e(o.o.plugins.mention.source,o)};o.addBtnDef("mention",i)}}}})}(jQuery);
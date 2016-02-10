/* ===========================================================
 * trumbowyg.activecontrols.js v1.0
 * Plugin to display active formattig buttons in buttons pane
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Rastislav Švarba (ra100)
 *          Twitter : @ra100
 *          Website : ra100.net
 */

(function ($) {
    'use strict';

    $.trumbowyg.tagToButton = {
        'strong': 'strong',
        'b': 'strong',
        'em': 'em',
        'i': 'em',
        'p': 'p',
        'center': 'justifyCenter',
        'left': 'justifyLeft',
        'right': 'justifyRight',
        'justify': 'justifyFull',
        'ol': 'orderedList',
        'ul': 'unorderedList',
        'a': 'link',
        'img': 'insertImage',
        'u': 'underline',
        'strike': 'strikethrough',
        'del': 'del',
        'h1': 'h1',
        'h2': 'h2',
        'h3': 'h3',
        'h4': 'h4',
        'h5': 'h5',
        'h6': 'h6',
        'blockquote': 'blockquote'
    };

    $.extend(true, $.trumbowyg, {
        opts: {
            on: {
                activecontrols: {
                    events: 'mouseup keydown',
                    handler: function (event, t) {
                        t.saveSelection();
                        if (t.selection !== null) {
                            t.o.controlButtonActivate(t.selection.commonAncestorContainer.parentNode, t);
                        }
                    }
                }
            },
            activeTags: [],

            // Active tags
            controlButtonActivate: function (element, t) {
                var tags = [],
                    newTags = [];
                t.o.getTagsRecursive(element, tags);
                newTags = t.o.activeTags.filter(function (val) {
                    if (tags.indexOf(val) < 0) {
                        t.$btnPane.find('.' + t.o.prefix + t.tagToButton[val.toLowerCase()] + '-button').removeClass('active');
                        return false;
                    }
                });
                for (var i in tags) {
                    var tag = tags[i];
                    if (newTags.indexOf(tag) < 0) {
                        t.$btnPane.find('.' + t.o.prefix + t.tagToButton[tag.toLowerCase()] + '-button').addClass('active');
                    }
                }
                t.o.activeTags = tags;
            },
            getTagsRecursive: function (element, tags) {
                var tag = element.tagName;
                if (tag === 'DIV')
                    return;
                if (tag === 'P' && element.style.textAlign !== "") {
                    tags.push(element.style.textAlign);
                }
                tags.push(tag);
                this.getTagsRecursive(element.parentNode, tags);
            }
        }
    });
})(jQuery);

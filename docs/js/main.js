'use strict';

if (window.location.href.indexOf('index.html') > 0) {
    window.location = window.location.href.replace('index.html', '');
}

hljs.configure({
    ignoreUnescapedHTML: true,
});
// Highlight.js mergeHtmlPlugin
hljs.addPlugin((function () {
    'use strict';

    var originalStream;

    /**
     * @param {string} value
     * @returns {string}
     */
    function escapeHTML(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    /* plugin itself */

    /** @type {HLJSPlugin} */
    const mergeHTMLPlugin = {
        // preserve the original HTML token stream
        "before:highlightElement": ({ el }) => {
            originalStream = nodeStream(el);
        },
        // merge it afterwards with the highlighted token stream
        "after:highlightElement": ({ el, result, text }) => {
            if (!originalStream.length) return;

            const resultNode = document.createElement('div');
            resultNode.innerHTML = result.value;
            result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
            el.innerHTML = result.value;
        }
    };

    /* Stream merging support functions */

    /**
     * @typedef Event
     * @property {'start'|'stop'} event
     * @property {number} offset
     * @property {Node} node
     */

    /**
     * @param {Node} node
     */
    function tag(node) {
        return node.nodeName.toLowerCase();
    }

    /**
     * @param {Node} node
     */
    function nodeStream(node) {
        /** @type Event[] */
        const result = [];
        (function _nodeStream(node, offset) {
            for (let child = node.firstChild; child; child = child.nextSibling) {
                if (child.nodeType === 3) {
                    offset += child.nodeValue.length;
                } else if (child.nodeType === 1) {
                    result.push({
                        event: 'start',
                        offset: offset,
                        node: child
                    });
                    offset = _nodeStream(child, offset);
                    // Prevent void elements from having an end tag that would actually
                    // double them in the output. There are more void elements in HTML
                    // but we list only those realistically expected in code display.
                    if (!tag(child).match(/br|hr|img|input/)) {
                        result.push({
                            event: 'stop',
                            offset: offset,
                            node: child
                        });
                    }
                }
            }
            return offset;
        })(node, 0);
        return result;
    }

    /**
     * @param {any} original - the original stream
     * @param {any} highlighted - stream of the highlighted source
     * @param {string} value - the original source itself
     */
    function mergeStreams(original, highlighted, value) {
        let processed = 0;
        let result = '';
        const nodeStack = [];

        function selectStream() {
            if (!original.length || !highlighted.length) {
                return original.length ? original : highlighted;
            }
            if (original[0].offset !== highlighted[0].offset) {
                return (original[0].offset < highlighted[0].offset) ? original : highlighted;
            }

            return highlighted[0].event === 'start' ? original : highlighted;
        }

        /**
         * @param {Node} node
         */
        function open(node) {
            function attributeString(attr) {
                return ' ' + attr.nodeName + '="' + escapeHTML(attr.value) + '"';
            }
            result += '<' + tag(node) + [].map.call(node.attributes, attributeString).join('') + '>';
        }

        /**
         * @param {Node} node
         */
        function close(node) {
            result += '</' + tag(node) + '>';
        }

        /**
         * @param {Event} event
         */
        function render(event) {
            (event.event === 'start' ? open : close)(event.node);
        }

        while (original.length || highlighted.length) {
            let stream = selectStream();
            result += escapeHTML(value.substring(processed, stream[0].offset));
            processed = stream[0].offset;
            if (stream === original) {
                /*
                On any opening or closing tag of the original markup we first close
                the entire highlighted node stack, then render the original tag along
                with all the following original tags at the same offset and then
                reopen all the tags on the highlighted stack.
                */
                nodeStack.reverse().forEach(close);
                do {
                    render(stream.splice(0, 1)[0]);
                    stream = selectStream();
                } while (stream === original && stream.length && stream[0].offset === processed);
                nodeStack.reverse().forEach(open);
            } else {
                if (stream[0].event === 'start') {
                    nodeStack.push(stream[0].node);
                } else {
                    nodeStack.pop();
                }
                render(stream.splice(0, 1)[0]);
            }
        }
        return result + escapeHTML(value.substr(processed));
    }

    return mergeHTMLPlugin;

}()));
Array.from(document.querySelectorAll('pre code')).forEach(function (codeElement) {
    const hasDiff = codeElement.classList.contains('diff');
    if (hasDiff) {
        hljs.highlightElement(codeElement);
        codeElement.classList.remove('diff', 'language-diff');
    }
    hljs.highlightElement(codeElement);
    if (hasDiff) {
        codeElement.classList.add('language-diff');
    }
});

(function ($) {
    if ($.trumbowyg) {
        var configurations = {
            core: {},
            plugins: {
                btnsDef: {
                    // Customizable dropdowns
                    align: {
                        dropdown: ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                        ico: 'justifyLeft'
                    }
                },
                btns: [
                    ['viewHTML'],
                    ['undo', 'redo'],
                    ['formatting'],
                    ['strong', 'em', 'del', 'underline'],
                    ['foreColor', 'backColor'],
                    ['link'],
                    ['insertImage', 'upload', 'base64', 'noembed', 'giphy'],
                    ['align'],
                    ['preformatted'],
                    ['horizontalRule'],
                    ['fullscreen']
                ],
                plugins: {
                    giphy: {
                        apiKey: 'dNhCbN6hrhpBMxXhIswM34wIR2UBpCns'
                    },
                    // Add imgur parameters to upload plugin
                    upload: {
                        serverPath: 'https://api.imgur.com/3/image',
                        fileFieldName: 'image',
                        headers: {
                            'Authorization': 'Client-ID 9e57cb1c4791cea'
                        },
                        urlPropertyName: 'data.link'
                    }
                }
            }
        };

        // Demo switch
        var $demoTextarea = $('#trumbowyg-demo');
        $demoTextarea.trumbowyg(configurations.core);
        $('.demo-switcher .button').on('click', function () {
            var $current = $('.demo-switcher .current');
            $(this).parent().removeClass('current-' + $current.data('config'));
            $current.removeClass('current');
            $(this).addClass('current');
            $(this).parent().addClass('current-' + $(this).data('config'));
            $demoTextarea.trumbowyg('destroy');
            $demoTextarea.trumbowyg(configurations[$(this).data('config')]);
        });

        // Lang accordion
        $('#lang-list-view-full').on('click', function () {
            $('#lang-list-light').slideUp(100);
            $('#lang-list-full').slideDown(350);
        });
    }

    // Languages continent switch
    var $continentNames = $('.continent-name');
    $continentNames.each(function () {
        $(this).parent().attr('data-height', $(this).parent().height());
    });
    $continentNames.click(function () {
        var $oldOpen = $('#languages').find('.col-list ul li[style]');
        $oldOpen.removeAttr('style');
        $(this).parent().css({
            height: $(this).parent().attr('data-height') + 'px'
        });
    });
    $continentNames.last().parent().css({
        height: $continentNames.last().parent().attr('data-height') + 'px'
    });

    // Add anchors
    $('.feature h3[id], .feature h4[id]').each(function () {
        $(this).after($('<a/>', {
            html: '<svg><use xlink:href="#trumbowyg-link"></use></svg>',
            'class': 'title-link',
            href: '#' + $(this).attr('id'),
            title: 'Permalink to ' + $(this).text()
        }));
    });

    // Show star count
    function setStarsCount(stars) {
        $('.star-count').text(stars);
    }

    var date = new Date();
    var starsKey = 'stars_' + date.getMonth() + '_' + date.getYear();
    var stars = localStorage.getItem(starsKey);
    if (!stars) {
        $.ajax('https://api.github.com/repos/Alex-D/Trumbowyg', {
            success: function (data) {
                var stars = data.stargazers_count; // jshint ignore:line
                localStorage.clear();
                localStorage.setItem(starsKey, stars);
                setStarsCount(stars);
            }
        });
    } else {
        setStarsCount(stars);
    }

    // Switch iframe src for demos
    if ($('.main-demos').length > 0) {
        $('.documentation-summary a').each(function() {
            var demoHash = $(this).attr('href').replace('.html', '').replace(/[\/.]/g, '-').replace(/^-*/g, '');
            $(this).attr('data-hash', demoHash);
            $(this).click(function() {
                $('.main-demos iframe').attr('src', $(this).attr('href'));
                window.location.hash = demoHash;
                return false;
            });
        });
        if (window.location.hash.length > 1) {
            var demoHref = $('[data-hash="' + window.location.hash.replace('#', '') + '"]').attr('href');
            $('.main-demos iframe').attr('src', demoHref);
        }
    }
})(jQuery);

/* Google Analytics */
// jshint ignore:start
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('set', 'anonymizeIp', true);
ga('create', 'UA-35470243-1', 'auto');
ga('send', 'pageview');

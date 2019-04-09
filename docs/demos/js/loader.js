var baseURL = window.location.hostname.indexOf('github.') !== -1 ? '//rawcdn.githack.com/Alex-D/Trumbowyg/v2.15.2/' : '../../../';
var styleLoadingContainer = document.querySelector('.loading-head');
var scriptLoadingContainer = document.querySelector('.loading-body');

function loadStyle(stylePath, comment) {
    'use strict';

    document.write('<link rel="stylesheet" href="' + baseURL + stylePath + '"/>');

    styleLoadingContainer.innerHTML = styleLoadingContainer.innerHTML.trim();
    if (styleLoadingContainer.innerHTML.length > 0) {
        styleLoadingContainer.innerHTML = '\n' + styleLoadingContainer.innerHTML;
    }
    if (comment !== undefined) {
        styleLoadingContainer.innerText += '\n<!-- ' + comment + ' -->';
    }
    styleLoadingContainer.innerText += '\n<link rel="stylesheet" href="node_modules/trumbowyg/' + stylePath + '">\n\n';
}

function loadScript(scriptPath, comment) {
    'use strict';

    document.write('<script src="' + baseURL + scriptPath + '"></script>');

    scriptLoadingContainer.innerHTML = scriptLoadingContainer.innerHTML.trim();
    if (scriptLoadingContainer.innerHTML.length > 0) {
        scriptLoadingContainer.innerHTML = '\n' + scriptLoadingContainer.innerHTML;
    }
    if (comment !== undefined) {
        scriptLoadingContainer.innerText += '\n<!-- ' + comment + ' -->';
    }
    scriptLoadingContainer.innerText += '\n<script src="node_modules/trumbowyg/' + scriptPath + '"></script>\n\n';
}

(function($) {
    'use strict';

    $('a').click(function() {
        window.top.location = $(this).attr('href');
        return false;
    });
})(jQuery);

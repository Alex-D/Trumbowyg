var baseURL = window.location.hostname.indexOf('github.') !== -1 ? '//rawcdn.githack.com/Alex-D/Trumbowyg/v2.23.0/' : '../../../';
var styleLoadingContainer = document.querySelector('.loading-head');
var scriptLoadingContainer = document.querySelector('.loading-body');

function loadTag(tagToInsert, container, comment, tagForDocumentation) {
    'use strict';

    document.write(tagToInsert);

    var html = '';
    if (container.innerHTML.trim().length > 0) {
        html = '\n' + container.innerHTML.trim() + '\n';
    }

    if (comment !== undefined) {
        html += '\n&lt;!-- ' + comment + ' -->';
    }
    html += tagForDocumentation.replace(/</g, '&lt;');

    container.innerHTML = html;
}

function loadStyle(stylePath, comment) {
    'use strict';

    loadTag(
      '<link rel="stylesheet" href="' + baseURL + stylePath + '"/>',
      styleLoadingContainer,
      comment,
      '\n<link rel="stylesheet" href="trumbowyg/' + stylePath + '">\n\n'
    );
}

function loadScript(scriptPath, comment) {
    'use strict';

    loadTag(
      '<script src="' + baseURL + scriptPath + '"></script>',
      scriptLoadingContainer,
      comment,
      '\n<script src="trumbowyg/' + scriptPath + '"></script>\n\n'
    );
}

(function($) {
    'use strict';

    $('a').click(function() {
        window.top.location = $(this).attr('href');
        return false;
    });
})(jQuery);

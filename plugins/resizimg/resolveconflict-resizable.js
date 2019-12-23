(function(factory, define, require, module, undefined) {
	'use strict';

    if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof module === 'object' && typeof module.exports === 'object') {
		// CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Global jQuery
		factory(jQuery);
	}
}(function($, undefined) {
	'use strict';

    // rename to avoid conflict with jquery-resizable
    $.fn.uiresizable = $.fn.resizable;
    delete $.fn.resizable;
}));
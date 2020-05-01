/* globals Prism */
(function ($, Prism) {
    'use strict';

    // My plugin default options
    var defaultOptions = {
        languageNames: false,
        languages: {
            "shell": "Shell \\ Bash",

            // For updated list of languages
            // see https://github.com/PrismJS/prism/blob/master/plugins/show-language/prism-show-language.js
            "html": "HTML",
            "xml": "XML",
            "svg": "SVG",
            "mathml": "MathML",
            "ssml": "SSML",
            "css": "CSS",
            "clike": "C-like",
            "js": "JavaScript",
            "abap": "ABAP",
            "abnf": "Augmented Backus–Naur form",
            "al": "AL",
            "antlr4": "ANTLR4",
            "g4": "ANTLR4",
            "apacheconf": "Apache Configuration",
            "apl": "APL",
            "aql": "AQL",
            "arff": "ARFF",
            "asciidoc": "AsciiDoc",
            "adoc": "AsciiDoc",
            "asm6502": "6502 Assembly",
            "aspnet": "ASP.NET (C#)",
            "autohotkey": "AutoHotkey",
            "autoit": "AutoIt",
            "basic": "BASIC",
            "bbcode": "BBcode",
            "bnf": "Backus–Naur form",
            "rbnf": "Routing Backus–Naur form",
            "conc": "Concurnas",
            "csharp": "C#",
            "cs": "C#",
            "dotnet": "C#",
            "cpp": "C++",
            "cil": "CIL",
            "coffee": "CoffeeScript",
            "cmake": "CMake",
            "csp": "Content-Security-Policy",
            "css-extras": "CSS Extras",
            "dax": "DAX",
            "django": "Django/Jinja2",
            "jinja2": "Django/Jinja2",
            "dns-zone-file": "DNS zone file",
            "dns-zone": "DNS zone file",
            "dockerfile": "Docker",
            "ebnf": "Extended Backus–Naur form",
            "ejs": "EJS",
            "etlua": "Embedded Lua templating",
            "erb": "ERB",
            "excel-formula": "Excel Formula",
            "xlsx": "Excel Formula",
            "xls": "Excel Formula",
            "fsharp": "F#",
            "firestore-security-rules": "Firestore security rules",
            "ftl": "FreeMarker Template Language",
            "gcode": "G-code",
            "gdscript": "GDScript",
            "gedcom": "GEDCOM",
            "glsl": "GLSL",
            "gml": "GameMaker Language",
            "gamemakerlanguage": "GameMaker Language",
            "graphql": "GraphQL",
            "hs": "Haskell",
            "hcl": "HCL",
            "hlsl": "HLSL",
            "http": "HTTP",
            "hpkp": "HTTP Public-Key-Pins",
            "hsts": "HTTP Strict-Transport-Security",
            "ichigojam": "IchigoJam",
            "iecst": "Structured Text (IEC 61131-3)",
            "inform7": "Inform 7",
            "javadoc": "JavaDoc",
            "javadoclike": "JavaDoc-like",
            "javastacktrace": "Java stack trace",
            "jq": "JQ",
            "jsdoc": "JSDoc",
            "js-extras": "JS Extras",
            "js-templates": "JS Templates",
            "json": "JSON",
            "jsonp": "JSONP",
            "json5": "JSON5",
            "latex": "LaTeX",
            "tex": "TeX",
            "context": "ConTeXt",
            "lilypond": "LilyPond",
            "ly": "LilyPond",
            "emacs": "Lisp",
            "elisp": "Lisp",
            "emacs-lisp": "Lisp",
            "llvm": "LLVM IR",
            "lolcode": "LOLCODE",
            "md": "Markdown",
            "markup-templating": "Markup templating",
            "matlab": "MATLAB",
            "mel": "MEL",
            "moon": "MoonScript",
            "n1ql": "N1QL",
            "n4js": "N4JS",
            "n4jsd": "N4JS",
            "nand2tetris-hdl": "Nand To Tetris HDL",
            "nasm": "NASM",
            "neon": "NEON",
            "nginx": "nginx",
            "nsis": "NSIS",
            "objectivec": "Objective-C",
            "objc": "Objective-C",
            "ocaml": "OCaml",
            "opencl": "OpenCL",
            "parigp": "PARI/GP",
            "objectpascal": "Object Pascal",
            "pcaxis": "PC-Axis",
            "px": "PC-Axis",
            "peoplecode": "PeopleCode",
            "pcode": "PeopleCode",
            "php": "PHP",
            "phpdoc": "PHPDoc",
            "php-extras": "PHP Extras",
            "plsql": "PL/SQL",
            "powerquery": "PowerQuery",
            "pq": "PowerQuery",
            "mscript": "PowerQuery",
            "powershell": "PowerShell",
            "properties": ".properties",
            "protobuf": "Protocol Buffers",
            "py": "Python",
            "q": "Q (kdb+ database)",
            "qml": "QML",
            "rkt": "Racket",
            "jsx": "React JSX",
            "tsx": "React TSX",
            "renpy": "Ren'py",
            "rest": "reST (reStructuredText)",
            "robotframework": "Robot Framework",
            "robot": "Robot Framework",
            "rb": "Ruby",
            "sas": "SAS",
            "sass": "Sass (Sass)",
            "scss": "Sass (Scss)",
            "shell-session": "Shell session",
            "solidity": "Solidity (Ethereum)",
            "solution-file": "Solution file",
            "sln": "Solution file",
            "soy": "Soy (Closure Template)",
            "sparql": "SPARQL",
            "rq": "SPARQL",
            "splunk-spl": "Splunk SPL",
            "sqf": "SQF: Status Quo Function (Arma 3)",
            "sql": "SQL",
            "tap": "TAP",
            "toml": "TOML",
            "tt2": "Template Toolkit 2",
            "trig": "TriG",
            "ts": "TypeScript",
            "t4-cs": "T4 Text Templates (C#)",
            "t4": "T4 Text Templates (C#)",
            "t4-vb": "T4 Text Templates (VB)",
            "t4-templating": "T4 templating",
            "uscript": "UnrealScript",
            "uc": "UnrealScript",
            "vbnet": "VB.Net",
            "vhdl": "VHDL",
            "vim": "vim",
            "visual-basic": "Visual Basic",
            "vb": "Visual Basic",
            "wasm": "WebAssembly",
            "wiki": "Wiki markup",
            "xeoracube": "XeoraCube",
            "xojo": "Xojo (REALbasic)",
            "xquery": "XQuery",
            "yaml": "YAML",
            "yml": "YAML"
        }
    };

    function highlightIt(text, language) {
        return [
            '<pre class="language-' + language + '">',
            '<code class="language-' + language + '">' + Prism.highlight(text, Prism.languages[language]) + '</code>',
            '</pre>',
        ].join('');
    }

    // If my plugin is a button
    function buildButtonDef(trumbowyg) {
        return {
            fn: function () {
                var $modal = trumbowyg.openModal('Code', [
                    '<div class="' + trumbowyg.o.prefix + 'highlight-form-group">',
                    '   <select class="' + trumbowyg.o.prefix + 'highlight-form-control language">',
                    (function () {

                        // Get a list of Prism language identificators
                        var languages = [];
                        for (var lang in Prism.languages) {
                            if (Prism.languages.hasOwnProperty(lang)) {
                                var langName = lang;

                                // If displaying of language names is enabled
                                if (trumbowyg.o.plugins.highlight.languageNames) {
                                    // Determine if language can be displayed
                                    langName = trumbowyg.o.plugins.highlight.languages.hasOwnProperty(lang)
                                        ? trumbowyg.o.plugins.highlight.languages[lang]
                                        : null;
                                }

                                // If language can be displayed
                                if (langName) {
                                    languages.push({ id: lang, name: langName });
                                }
                            }
                        }

                        // Sort languages by name
                        languages.sort(function(a, b){
                            return a.name.localeCompare(b.name);
                        });

                        // Generate a list of options
                        var options = '';
                        languages.forEach(function(language){
                            options += '<option value="' + $('<div/>').text(language.id).html() + '">' + $('<div/>').text(language.name).html() + '</option>';
                        });

                        return options;
                    })(),
                    '   </select>',
                    '</div>',
                    '<div class="' + trumbowyg.o.prefix + 'highlight-form-group">',
                    '   <textarea class="' + trumbowyg.o.prefix + 'highlight-form-control code"></textarea>',
                    '</div>',
                ].join('\n')),
                $language = $modal.find('.language'),
                $code = $modal.find('.code');

                // Listen clicks on modal box buttons
                $modal.on('tbwconfirm', function () {
                    trumbowyg.restoreRange();
                    trumbowyg.execCmd('insertHTML', highlightIt($code.val(), $language.val()));
                    trumbowyg.execCmd('insertHTML', '<p><br></p>');

                    trumbowyg.closeModal();
                });

                $modal.on('tbwcancel', function () {
                    trumbowyg.closeModal();
                });
            }
        };
    }

    $.extend(true, $.trumbowyg, {
        // Add some translations
        langs: {
            // jshint camelcase:false
            en: {
                highlight: 'Code syntax highlight'
            },
            hu: {
                highlight: 'Kód kiemelés'
            },
            ko: {
                highlight: '코드 문법 하이라이트'
            },
            pt_br: {
                highlight: 'Realçar sintaxe de código'
            },
            // jshint camelcase:true
        },
        // Add our plugin to Trumbowyg registered plugins
        plugins: {
            highlight: {
                init: function (trumbowyg) {
                    // Fill current Trumbowyg instance with my plugin default options
                    trumbowyg.o.plugins.highlight = $.extend(true, {},
                        defaultOptions,
                        trumbowyg.o.plugins.highlight || {}
                    );

                    // If my plugin is a button
                    trumbowyg.addBtnDef('highlight', buildButtonDef(trumbowyg));
                }
            }
        }
    });
})(jQuery, Prism);

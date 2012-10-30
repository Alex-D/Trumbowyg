<?php
var_dump($_POST);
?>

<!DOCTYPE html>
<html>
    <head>
        <title>Trumbowyg by Alex-D</title>
        <link rel="stylesheet" href="js/trumbowyg/design/css/trumbowyg.css">
        <style type="text/css">
            html, body {
                margin: 0;
                padding: 0;
                background-color: #F2F2F2;
                font-family: "Trebuchet MS", Verdana, Arial, Helvetica, sans-serif;
            }
            header {
                text-align: center;
            }
            #main {
                width: 960px;
                margin: 0 auto;
            }
        </style>
    </head>
    <body>
        <div id="main" role="main">
            <header>
                <h1>Examples of use Trumbowyg</h1>

                <p>
                    Close an editor on clic on « Close » in top right corner. <br>
                    For re-open a editor, double-click on his text.
                </p>
            </header>

            <form action="" method="post">
                <textarea id="form-content" class="editor" cols="30" rows="10" name="content"></textarea>
                <input type="submit">
            </form>
        </div>
        <script src="js/vendor/jquery-1.8.2.min.js"></script>
        <script src="js/trumbowyg/trumbowyg.js"></script>
        <script src="js/trumbowyg/langs/fr.js"></script>
        <script>
            var btnsGrps = $.trumbowyg.btnsGrps;
            $('.editor').trumbowyg({
                lang: 'fr',
                closable: true,
                mobile: true,
                fixedBtnPane: true,
                fixedFullWidth: true,
                semantic: true,
                resetCss: true,
                autoAjustHeight: true
            });
            $('input').click(function(){
            	$('form').submit();
            	return false;
            });
        </script>
    </body>
</html>
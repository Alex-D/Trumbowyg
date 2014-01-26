<?php
/* ===========================================================
 * trumbowyg.upload.php
 * Upload plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Alexandre Demode (Alex-D)
 *          Twitter : @AlexandreDemode
 *          Website : alex-d.fr
 * ===========================================================
 * /!\ This file was make just for tests. Do not use it in
 *     production because it is not secure.
 */



/**
 * Upload directory
 */
define("UPLOADDIR", "./uploaded-files/");



// Detect if it is an AJAX request
if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    $error = false;
    $files = array();
 
    foreach($_FILES as $file) {
        if(move_uploaded_file($file['tmp_name'], UPLOADDIR . basename($file['name']))) {
            $files[] = UPLOADDIR . $file['name'];
        } else {
            $error = true;
        }
    }

    $data = $error
        ? array(
            'message'   => 'uploadError'
          )
        : array(
            'message'   => 'uploadSuccess',
            'files'     => $files
          )
    ;
} else {
    $data = array('message' => 'uploadNotAjax', 'formData' => $_POST);
}



echo json_encode($data);
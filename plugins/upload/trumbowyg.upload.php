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
    $file = array_shift($_FILES);


    $target_file = UPLOADDIR . $file['name'];
    $uploadOk = 1;


    // Check if image file is a actual image or fake image
    $check = getimagesize($file["tmp_name"]);
    if($check !== false) {
        $uploadOk = 1;
    } else {
        $data = array(
            'error' => true,
            'success' => false,
            'message' => 'File is not an image'
        );
        $uploadOk = 0;
    }


    // Check if file already exists
    if (file_exists($target_file)) {
        $uploadOk = 0;
        $data = array(
            'error' => true,
            'success' => false,
            'message' => 'Sorry, file already exists'
        );
    }

    // Check file size
    // 4000000 = ~4mb
    if ($file["size"] > 4000000) {
        $uploadOk = 0;
        $data = array(
            'error' => true,
            'success' => false,
            'message' => 'Sorry, your file is too large.'
        );
    }

    // Allow certain file formats
    $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
    $imageFileType = strtolower($imageFileType);
    if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
    && $imageFileType != "gif" ) {
        $uploadOk = 0;
        $data = array(
            'error' => true,
            'success' => false,
            'message' => 'Sorry, only JPG, JPEG, PNG & GIF files are allowed.'
        );
    }

    // Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 0) {
        echo json_encode($data);
    // if everything is ok, try to upload file
    } else {
        if(move_uploaded_file($file['tmp_name'], UPLOADDIR . basename($file['name']))) {
            $file = dirname($_SERVER['PHP_SELF']) . str_replace('./', '/', UPLOADDIR) . $file['name'];
            $data = array(
                'success' => true,
                'file'    => $file,
            );
            echo json_encode($data);
        } else {
            $error = true;
            $data = array(
                'message' => 'uploadError',
            );
            echo json_encode($data);
        }
    }
} else {
    $data = array(
        'message' => 'uploadNotAjax',
        'formData' => $_POST
    );
    echo json_encode($data);
}
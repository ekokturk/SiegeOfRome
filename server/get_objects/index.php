<?php
/*
 @copyright: Copyright (C) 2019  Eser Kokturk. All Rights Reserved.
 */

include '../AJAXServer.php';
class Server extends AJAXServer {

    public function handleAction( $request , $filePaths) {

        $levelPath = $filePaths["level"];
        $objectPath = $filePaths["object"];
        $usersPath = $filePaths["users"];


        $response = [];
        $payload = array();                             // Initialize payload data array
        // Convert serialized data to JSON with numeric values (JSON_NUMERIC_CHECK) 
        // and proper format (JSON_PRETTY_PRINT)
        $error = 0;
        if($this->validateUser($request['userid'], $usersPath)){                        // Check if username is valid  
            $files = scandir($objectPath);                   // Get the filenames of the objects in directory
            foreach($files as $file) {                              // Loop through each filename
                if(!is_dir($file) && strpos($file, '.json')){           // Check if file is not a directory and a JSON
                    $fileName = basename($file,'.json');                   // Get filename without extention
                    $newItem = array($fileName => $file);
                    $payload = $payload + $newItem;
                }
            }
            $response  = array("payload" =>$payload , "error" => 0);    // Create combine error message and payload data
        }
        else{
            $response  = array("error" => 1);                           // Set error
        }        
        return $response;
    }
}

$myServer = new Server ();
?>
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
        // Convert serialized data to JSON with numeric values (JSON_NUMERIC_CHECK) 
        // and proper format (JSON_PRETTY_PRINT)
        $data = json_encode($request, JSON_PRETTY_PRINT|JSON_NUMERIC_CHECK|JSON_UNESCAPED_SLASHES);
        $error = 0;
        if($this->validateUser($request['userid'], $usersPath)){                        // Check if username is valid 
            if($request['datatype'] == 'level'){                         // If requested save is for a level
                $file = $levelPath. $request['name'] .'.json';          // Create JSON file
                $fileData = file_get_contents($file);                           // Add JSON data to file
            }
            else if($request['datatype'] == 'object'){                   // If requested save is for an object
                $file = $objectPath. $request['name'] .'.json';   // Create JSON file
                $fileData = file_get_contents($file);                        // Add JSON data to file
            
            }
            $fileDataSerial = json_decode($fileData,true);
            $fileSize = filesize( $file);       // Get file size
            if($fileSize > 0){                  // Check if file is written
                $response = array("name"=>$request['name'], "payload"=> $fileDataSerial['payload'], "bytes" => $fileSize, "error" => 0 );
            }
            else{
                $response = array("error" => 1);
            }
        }
        else{
            $response = array("error" => 1);
        }
        return $response;
    }
}

$myServer = new Server ();
?>
<?php
/*
 @copyright: Copyright (C) 2019  Eser Kokturk. All Rights Reserved.
 */

include '../AJAXServer.php';
class Server extends AJAXServer {

    public function handleAction( $request , $filePaths) {

        $usersPath = $filePaths["users"];
        $response = [];
        if($this->validateUser($request['userid'], $usersPath)){                        // Check if username is valid 
            $fileData = file_get_contents($usersPath . $request['userid'] . ".json");              // Add JSON data to file
            $fileDataSerial = json_decode($fileData,true);
            if(password_verify($request['password'], $fileDataSerial['password']))
            {
                $file = $usersPath. $request['userid'] .'.json';          // Create JSON file
                $fileData = file_get_contents($file);                                       // Add JSON data to file
                $fileDataSerial = json_decode($fileData,true);
                $response  = array("userid" =>$request['userid'], "type" => $fileDataSerial["type"], "error" => 0);    // Create combine error message and payload data
            }
            else
                $response  = array("error" => 2); 
        }
        else
            $response  = array("error" => 1);                           // Set error
        return $response;
    }
}

$myServer = new Server ();
?>
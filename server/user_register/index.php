<?php
/*
 @copyright: Copyright (C) 2019  Eser Kokturk. All Rights Reserved.
 */

include '../AJAXServer.php';
class Server extends AJAXServer {

    public function handleAction( $request , $filePaths) {

        $usersPath = $filePaths["users"];
        $response = [];
        // Convert serialized data to JSON with numeric values (JSON_NUMERIC_CHECK) 
        // and proper format (JSON_PRETTY_PRINT)
        $error = 0;
        $sameID = false;

        if(!$this->validateUser($request['userid'], $usersPath)){                        // Check if username is valid 
            $file = $usersPath. $request['userid'] .'.json';                             // Create JSON file
            $request["password"] = password_hash($request["password"], PASSWORD_DEFAULT);
            $data = json_encode($request, JSON_PRETTY_PRINT|JSON_NUMERIC_CHECK|JSON_UNESCAPED_SLASHES);
            file_put_contents($file, $data);                                            // Add JSON data to file
            $response  = array("userid" =>$request['userid'] , "error" => 0);       // Create combine error message and payload data
        }
        else{
            $response  = array("error" => 1);                           // Set error
        }        
        return $response;
    }
}

$myServer = new Server ();
?>
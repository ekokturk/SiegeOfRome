<?php
/* ===============================================================================================
 * AJAX Action handler class
 * Copyright (C) 2014 - 2018 Kibble Games Inc, in cooperation with Vancouver Film School Ltd.
 * Copyright (C) 2019  Eser Kokturk. All Rights Reserved.
 * All Rights REserved
 */

class AJAXServer {

    private $debug_mode          = TRUE;

    public function __construct() {
;
        // $this->CORSHeader();
        $filePaths = array(
            'level'=>"../data/game/levels/", 
            'object'=>"../data/game/objects/",
            'users'=>"../data/users/"
        );

        // Create data folders
        foreach($filePaths as $key => $value )
        {
            if(!file_exists($value))
                mkdir($value, 0777, true);
        }

        $response["error"] = -1; // unknown
        $request = $this->valid_request();
        if ($request != NULL) { //Checks if action value exists

            $response = $this->handleAction( $request, $filePaths);

            if($response == null)
                echo $response;
            else
                echo json_encode( $response, JSON_PRETTY_PRINT|JSON_NUMERIC_CHECK|JSON_UNESCAPED_SLASHES);

        return 0;

        }
    }
    
    public function CORSHeader() {

        // * wont work in FF w/ Allow-Credentials
        //if you dont need Allow-Credentials, * seems to work
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: x-requested-with');

        //if you need cookies or login etc
        header('Access-Control-Allow-Credentials: true');
        /*
        if ($this->getRequestMethod() == 'OPTIONS') {
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Max-Age: 604800');
            //if you need special headers
            exit(0);
        }
        */
    }

    public function handleAction( $request, $filePaths) {

        // OVERRIDE this method with your own handlers
        $response = $request;
        $response['error'] = 0; // All OK

        // must return a JSON string as a response
        return json_encode( $response );
    }

    public function validateUser($userID, $usersPath)
    {
        if(file_exists($usersPath . $userID . ".json"))
            return true;
        else
            return false;
    }

    public function validateAdmin($userID, $usersPath)
    {
        if(file_exists($usersPath . $userID . ".json")){

            $fileData = file_get_contents($usersPath . $userID . ".json");                                       // Add JSON data to file
            $fileDataSerial = json_decode($fileData,true);

            if($fileDataSerial["type"] == "admin")
                return true;
            else
                return false;
        }
        else
            return false;
    }

    private function is_ajax() {

        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
    }


    private function valid_request() {

        $request = NULL;

        if ($this->is_ajax() || ($_SERVER['REQUEST_METHOD']=="POST")) {

            $request = $_POST;

        } elseif ($_SERVER['REQUEST_METHOD']=="GET") {

            $request = $_GET;
        }

        return $request;
    }


    private function is_error( $error_msg ) {
        /*
         * When we encounter an error the handler should call is error with a message and hand that back
         * as a response to the client
         */

        // Create a response array (attrib => value) with the origingal post params to start
        $response = $_POST;

        // Add our error message
        $response["error"] = $error_msg;

        // convert the whole response to a JSON string, then add that string
        // as another element to the return message
        //
        // This lets us see the data coming back as a string in the debugger
        if ($this->debug_mode) {

            $response["json"] = json_encode( $response );
        }

        // Respond to the client with a JSON string containing attrib => value pairs encoded
        return json_encode( $response );
    }

}
?>

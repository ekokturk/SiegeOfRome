<?php
/*
 @copyright: Copyright (C) 2019  Eser Kokturk. All Rights Reserved.
 */

include '../AJAXServer.php';
class Server extends AJAXServer {

    public function handleAction( $request , $filePaths) {

        $usersPath = $filePaths["users"];
        if($this->validateUser($request["userid"], $usersPath)){
            if($this->validateAdmin($request["userid"], $usersPath)){
                include '../editor.php';
                return;
            }
            else
                return 2;
        }
        else
            return  1;
        
    }
}

$myServer = new Server ();
?>
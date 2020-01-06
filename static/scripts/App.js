/**
 @copyright: Copyright (C) 2019 Eser Kokturk. All Rights Reserved.
 */

'use strict';

import LevelEditor from './LevelEditor.js'
import Game from './Game.js'
import GameController from './GameController.js';

// ADMIN OVERRIDE - Allows every registered user to use the level editor
let USER = {type: "admin"}

// let USER = {type: "user"}

export default class App{
    constructor(){
        // Private members
        this['private'] = {
            data:    new WeakMap(),
            members: ( key, value ) => {
                if (value != undefined) 
                    this.private.data.set( key, value );
                return this.private.data.get( key );
            }
        };
        // Initialize private members
        this.private.members( this, {
            userID: "",
            userType: USER.type
	    });

        this.levelEditor;                                                           // Level Editor
        this.gameController;                                                        // Game UI
        $("#level-editor-button").on("click",() => {this.loadEditor();});           // load editor from server
        $("#play-game-button").on("click",() => { this.loadGame();});               // load game from server

        $("#user-form").on("submit",(event) => {                                    // Login or register
            event.preventDefault();
            if($(document.activeElement).attr("value") == "LOGIN")                  // If login button is clicked
                this.loginUser(event);
            else if($(document.activeElement).attr("value") == "REGISTER")          // If register button is clicked
                this.registerUser(event);
            $("#user-form").trigger("reset");                                       // reset form inputfields
        });
        $("#user-logout").on("click",() => { this.logoutUser();});                  // logout from game
    }

    // Load level editor from the server 
    loadEditor(){
        let userID = this.private.members( this ).userID;
        let request = $.param({"userid": userID});
        $.post('./server/get_editor/', request).then(data =>{                        // Get editor via AJAX
            if(data == 1)
                $("#main-menu-info").html("Invalid User");                           // If user is not registered
            else if(data == 2)
                $("#main-menu-info").html("No admin privileges for " + userID);      // Check if user type is admin
            else{
                $("#main-menu").addClass("hide");                                    // Get level editor
                $("#app-wrapper").html(data);
                $("#back-to-main").on("click", (e) => { 
                    $("#app-wrapper").html("");
                    $("#main-menu").removeClass("hide");
                });
                this.levelEditor = new LevelEditor(userID);
            }
        });        
    }

    // Load game from the server 
    loadGame(){
        let userID = this.private.members( this ).userID;
        let request = $.param({"userid": userID});
        $.post('./server/get_game/', request).then(data =>{                         // Get game via AJAX
            if(data == 1)
                $("#main-menu-info").html("Invalid User");                          // If user is not registered
            else{
                $("#main-menu").addClass("hide");                                   // Hide main menu
                $("#app-wrapper").html(data);                                       
                $("#back-to-main").on("click", (e) => {                             // Go back to the main menu
                    $("#app-wrapper").html("");
                    $("#main-menu").removeClass("hide");
                    Game.destroyInstance();                                         // delete game singleton
                });
                this.gameController = new GameController(userID);
            }
        });             
    }

    registerUser(event){
        event.preventDefault();
        let form = $('#user-form').serializeArray();                                                    // Get data from the form
        let userID = form[0].value;                                                                     // User id from the form
        let password = form[1].value;                                                                   // Password from the form
        let request = $.param({"userid":userID, "password":password, "type":USER.type, "data":""});     // Setup an AJAX request
        $.post("./server/user_register/", request).then(data =>{                                        // Save level via AJAX
            data = JSON.parse(data);
            if(data.error == "0"){
                $("#main-menu-info").html("You are registered as " + userID);                           // Show confirmation message
                let members = this.private.members( this );
                members.userID = data.userid;                                                           // Show user id
                console.log(USER.type);
                $("#main-menu-info").html(members.userID);
                if(USER.type == "admin")                                                                // If user is admin show level editor
                    $("#main-menu-editor").removeClass("hide");
                else                                                                                    // If user is not admin hide level editor
                    $("#main-menu-editor").addClass("hide");
                $("#user-modal").addClass("hide");
            }
            else
                $("#user-modal-info").html("User " + userID + " already exists!");                      // If user id is already in the server

        });
    }

    loginUser(event){
        event.preventDefault();
        let form = $('#user-form').serializeArray();                                // Get data from the form
        let userID = form[0].value;                                                 // User id from the form
        let password = form[1].value;                                               // Password from the form
        let request = $.param({"userid": userID, "password":password});             // Setup an AJAX request
        $.post("./server/user_login/",request).then(data =>{                        // Save level via AJAX
            data = JSON.parse(data);
            if(data.error == "0")
            {
                let members = this.private.members( this );
                members.userID = data.userid;
                members.userType = data.type;
                $("#main-menu-info").html(members.userID);
                if(members.userType == "admin")                                     // Check if user is admin
                    $("#main-menu-editor").removeClass("hide");                     // If so show level editor button
                else
                    $("#main-menu-editor").addClass("hide");                        // Hide level editor button
                $("#user-modal").addClass("hide");
            }
            else if(data.error == "1")
                $("#user-modal-info").html("Invalid User");
            else if(data.error == "2")
                $("#user-modal-info").html("Invalid Password");
        });
    }

    // Logout from the application
    logoutUser(){
        let members = this.private.members( this );
        if(members.userID != "")
        {
            Game.destroyInstance();                                                 // delete game singleton
            $("#main-menu-info").html("");                                          // Clear action info
            $("#user-modal-info").html("User " + members.userID + " logged out!");  // Show confirmation message
            members.userID = "";
            $("#user-modal").removeClass("hide");                                   // Show login modal
        }
        else
            $("#main-menu-info").html("You are not logged in!");                    // If user is not logged in already


    }

}


/**
 @copyright: Copyright (C) 2019  Eser Kokturk. All Rights Reserved.
 */

'use strict';

import Game from './Game.js'

export default class GameController{
    constructor(userID){
        let my = this.__private__ = {
            userID: userID,
        }

        let game = new Game(my.userID);
        this.loadLevelList();
        // Game UI Interactions
        $("#game-level-refresh").on("click", e =>{ this.playLevel() });             // Level refresh UI button
        $('#level-list').on('change', e => {                                        // Level list dropdown
            $('#level-list').children().removeAttr('selected');                         // Unselect all levels
            this.playLevel()                                                            // Start level
            let $selected = $('#level-list option:selected');                           // Get current selected option
            $selected.attr('selected', 'selected');                                     // Add selected attribute to it
        });
        $('#game-level-prev').on('click', e => { this.previousLevel() });           // Previous level UI button
        $('#game-level-next').on('click', e => { this.nextLevel() });               // Next level UI button
    }

    playLevel(){
        this.disableButtons();
        let levelName = $("#level-list").val();
        $("#game-viewport").remove();                                                   // Remove previous
        $("#game-area").prepend("<div id='game-viewport'></div>");                      // Create new viewport
        $("#game-viewport").on("contextmenu", e => {e.preventDefault();});              // Disable context menu
        Game.destroyInstance();                                                         // Destroy game singleton

        // Clear dynamically generated keyframes by JQuery Keyframes from stylesheet
        var element = document.getElementById("keyframesjs-stylesheet");                // Stylesheet element
        let size =  element.sheet.rules.length ;                                        // Amount of current animations
        for(i = 0; i< size ; i++)
        {
            element.sheet.removeRule(0);                                                // Clear animation from stylesheet
        }
        this.runGame(levelName);                                                        // Run the current level
    }

    // Start the game depending on the selected level
    runGame(levelName){
        let my = this.__private__;                          // Private members
        setTimeout(() => {                                  // Put a delay before clearing previous game
            new Game(my.userID);
        }, 300);
        setTimeout(() => {                                  // Put a delay before
            let game = Game.getInstance();
            this.resetLevelButtons();
            game.run(levelName);
        }, 500); 
    }

    loadLevelList(defaultLevel = ""){
        let my = this.__private__;
        let requestSerial = $.param({"userid": my.userID});                         // Serialize request
        let $levelSelect = $("#level-list");                                        // Level dropdown list
        $levelSelect.html("");                                                      // Clear dropdown menu
        $.post('./server/get_levels/', requestSerial).then(data => {                // Request level list via AJAX
            data = JSON.parse(data);                                                // Convert data into JSON format
            if(data.error == "0"){                                                  // If operation is successful
                if(data.payload == null || data.payload.length == 0)                // If level list is empty
                    return
                else{                                                               // If level list is not empty
                    for (let key in data.payload) {                                 // Add all levels to dropdown list
                        if (data.payload.hasOwnProperty(key)) 
                            $levelSelect.append(`<option value="${key}" data-file="${data.payload}">${key}</option>`)
                    }
                    if(defaultLevel == "")                                          // Set default level as dropdown default value
                        defaultLevel = $("#level-list").val()
                    if($levelSelect.children().length != 0){                        // If level list has data
                        this.resetLevelButtons();                                   // Reset game UI buttons
                        $levelSelect.val(defaultLevel);                             // Select default level
                        let game = Game.getInstance()                               // Get game singleton instance
                        game.run(defaultLevel);                                     // Load a level
                    }
                }
            }
        });                  
    }

    // Go to next level
    nextLevel(){
        let $selected = $('#level-list option:selected');                                   // Selected level from the list
        let $nextBtn = $('#game-level-next');                                               // Next level button
        if($selected.index() != $("#level-list").children('option').length - 1){            // It is the last level
            if($nextBtn.attr("disabled") != "disabled"){                                    // Check if button is disabled
                $nextBtn.attr("disabled", "disabled").css("pointer-events", "none");        // Stop pointer interactionss
                $('#level-list').children().removeAttr('selected');
                $selected.next().attr('selected', 'selected');                              // Go to next level
                $('#level-list').val( $selected.next().val())
                this.playLevel()                                                            // Start game for that level
            }
        }
    }

    // Go to previous level
    previousLevel(){
        let $selected = $('#level-list option:selected');                                   // Selected level from the list
        let $prevBtn = $('#game-level-prev');                                               // Previous level button
        if($selected.index() != 0){                                                         // It is the first level
            if($prevBtn.attr("disabled") != "disabled"){                                    // Check if button is disabled
                $('#level-list').children().removeAttr('selected');
                $selected.prev().attr('selected', 'selected');                              // Go to previous level
                $('#level-list').val( $selected.prev().val())
                this.playLevel()                                                            // Start game for that level
            }
        }
    }

    // Reset next and previous buttons according to the index of the current level
    resetLevelButtons(){
        let $selected = $('#level-list option:selected');                                   // Selected level from the list
        let $prevBtn = $('#game-level-prev');                                               // Next level button
        let $nextBtn = $('#game-level-next');                                               // Previous level button
        if($selected.index() != 0 && $("#level-list").children('option').length > 0)        // Check if previous level is available
            $prevBtn.removeAttr("disabled").css("pointer-events", "auto");
        if($selected.index() != $("#level-list").children('option').length - 1 &&
            $("#level-list").children('option').length > 0)                                 // Check if next level is available
            $nextBtn.removeAttr("disabled").css("pointer-events", "auto");
        if($("#level-list").children('option').length > 0)                                  // Check if current level is available
            $("#game-level-refresh").removeAttr("disabled").css("pointer-events", "auto");
    }

    // Diable UI buttons 
    disableButtons(){
        $('#game-level-prev').attr("disabled", "disabled").css("pointer-events", "none");
        $('#game-level-next').attr("disabled", "disabled").css("pointer-events", "none");
        $('#game-level-refresh').attr("disabled", "disabled").css("pointer-events", "none");

    }

}
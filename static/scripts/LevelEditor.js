/**
 @copyright: Copyright (C) 2019  Eser Kokturk. All Rights Reserved.
 */

'use strict';

import EditorSettings from "./EditorSettings.js";

export default class LevelEditor{
    constructor(userID = "default"){
        this.loadBackgrounds()                                  // Load backgrounds from images folder
        this.loadTextures();                                    // Load textures from images folder
        this.settings = new EditorSettings();                   // Setup editor functions
        this.userid = userID;                                   // Current user

        // Event actions for loading and saving data
        $('#level-dropdown').on('change', event => {$("#info").html("");                            
            this.loadLevel($("#level-dropdown").val())});
        $('#level-data-form').on('submit', event => {$("#info").html("");this.saveLevel(event)});         // Save level
        $('#delete-level-btn').on('click', event => {$("#info").html("");this.deleteLevel(event)});       // Delete level
        $('#new-level-btn').on('click', event => {$("#info").html("");this.newLevel()});                  // Create new empty level
        $('#save-as-level-btn').on('click', event => {$("#info").html("");this.saveAsLevel()});           // Save current level as new one
        $('#modal-data-form').on('submit', event => {$("#info").html("");this.saveObject(event)});        // Save object to server
        $('#level-refresh-btn').on('click', event => 
                                {$("#info").html("");this.loadLevelList($("#level-dropdown").val())});    // Reload level list from server
        $('#library-refresh-btn').on('click', event => {$("#info").html("");this.loadObjectsLibrary()});  // Reload library objects from server
        $("#ctx-lib-item-delete").on('click', () =>{$("#info").html(""); this.deleteLibraryObject()});    // Delete function for context menu
        
        setTimeout(() => {this.loadLevelList();}, 200);                                                   // Load levels list and first level
        setTimeout(() => {this.loadObjectsLibrary();}, 300);                                              // Load library
    }

    //============================= SAVE TO SERVER =============================================
    // Save level data to a JSON file with AJAX
    saveLevel(event){
        event.preventDefault();                                                     // Prevent submit event
        let $info = $("#info");                                                     // Action messages
        let levelName = $("#level-dropdown").val();                                 // Get selected level name from dropdown list
        if(!(levelName == "" || levelName == undefined || levelName == null)){      // Check if level name is valid
            let request = this.levelSaveRequest(levelName);                         // Get current level data from viewport
            $.post('./server/save/', request).then(data =>{                        // Save level via AJAX
                data = JSON.parse(data);                                            // Convert callback from the server to JSON
                if(data.error == "0"){                                              // If there is no error
                    // Show confirmation message
                    $info.append(`Level <span class="debug-text">${levelName}</span> successfully saved for user 
                    <span class="debug-text"> ${this.userid}</span> </span>(${data.bytes} bytes)<br><br>`);
                }
                else if(data.error != 0)                                            // If there is an error
                    // Show error message if something went wrong with the server
                    $info.html(`<span class="debug-error">Error ${data.error} occured while saving level list</span>`);
            });             
        }
        else
            // Show error message if there are no levels created to be saved
            $info.html(`<span class="debug-error">Create a new level in order to save data</span>`) 
    }

    // Create a new level with default settings and empty data
    newLevel(){
        let validInput = this.settings.newLevelName();                                // Check if level name input is valid
        let $info = $("#info");                                                     // Action messages
        if(validInput){                                                             // If it is valid
            $("#editor-viewport").html("");                                         // Clear objects in viewport
            $("#level-data-form").trigger("reset");                                 // Reset current form for level settings
            let levelName = $('input[name="levelName"]').val();                     // Get level name submitted by the user
            let request = this.levelSaveRequest(levelName);                         // Get current level data
            $.post('./server/save/', request).then(data =>{                        // Save level via AJAX
                data = JSON.parse(data);                                            // Convert callback from the server to JSON
                if(data.error == "0"){                                              // If there is no error
                    // Show confirmation message
                    $info.append(`Level <span class="debug-text">${levelName}</span> successfully 
                    created for user <span class="debug-text"> 
                    ${this.userid}</span> </span>(${data.bytes} bytes)<br><br>`);
                    this.loadLevelList(levelName);                                  // Load newly created level
                }
                else if(data.error != 0)                                            // If there is an error
                    // Show error message if something went wrong with the server
                    $info.html(`<span class="debug-error">Error ${data.error} occured while creating a new level</span>`);
            });             
        }
    }

    // Save current level as a new one
    saveAsLevel(){
        let validInput = this.settings.newLevelName();                                // Check if level name input is valid
        let $info = $("#info");                                                     // Action messages
        if(validInput){                                                             // If it is valid
            let levelName = $('input[name="levelName"]').val();                     // Get level name submitted by the user
            let request = this.levelSaveRequest(levelName);                         // Get current level data
            $.post('./server/save/', request).then(data =>{                        // Save level
                data = JSON.parse(data);                                            // Convert callback from the server to JSON
                if(data.error == "0"){                                              // If there is no error
                    // Show confirmation message
                    $info.append(`Current level successfully 
                    saved as <span class="debug-text">${levelName}</span> for user <span class="debug-text"> 
                    ${this.userid}</span> </span>(${data.bytes} bytes)<br><br>`);
                    this.loadLevelList(levelName);                                  // Load newly created level
                }
                else if(data.error != 0)                                            // If there is an error
                    // Show error message if something went wrong with the server
                    $info.html(`<span class="debug-error">
                    Error ${data.error} occured while saving a new level</span>`);
            });             
        }
    }

    // Save library object to server or edit an already created one
    saveObject(event){
        event.preventDefault();                                                 // Prevent submit event
        let request = this.librarySaveRequest();                                // Get user inputs from library add modal
        $.post('./server/save/', request).then(data => {                       // Save library via AJAX post request
            data = JSON.parse(data);                                            // Concert callback to JSON
            if(data.error == "0"){                                              // If there is no error
                if($("#modal-submit").attr("value") == "ADD"){                  // When the operation is to add a new object
                    // Show confirmation message
                    $("#info").append(`Object successfully saved as <span class="debug-text">${data.name}</span> 
                    for user <span class="debug-text"> ${this.userid}</span> </span>(${data.bytes} bytes)<br><br>`);
                }
                else if($("#modal-submit").attr("value") == "EDIT"){            // When the operation is to edit an existing object
                    // Show confirmation message
                    $("#info").append(`Object <span class="debug-text">${data.name}</span> successfully 
                    edited for user <span class="debug-text">${this.userid}</span> </span>(${data.bytes} bytes)<br><br>`);
                }
                this.loadObjectsLibrary();                                      // Reload library
            }
            else if(data.error != 0)                                            // If there is an error
                // Show error message if something went wrong with the server
                $("#info").html(`<span class="debug-error">
                Error ${data.error} occured while saving a new level</span>`);
        });        
        $("#library-add-modal").hide();               // Hide modal
        $("#modal-data-form").trigger("reset");       // Reset modal data
        this.settings.setModalViewer();                 // Reset modal image
    }

    //============================= SAVE REQUESTS =============================================
    // Get data from level settings and viewport then serialize it for the server
    levelSaveRequest(levelName){
        let formDataObj = $('#level-data-form').serializeArray();       // Get level settings from form
        let theLevel = this.dataFromLevel();                            // Get data from viewport
        let levelDataToSave = {                                         // Create a dictionary
            userid: this.userid,                                        // Id of the currentuser
            name: levelName,                                            // Name of the level
            datatype: 'level',                                          // Datatype for server
            payload: {                                                  // Level data
                ammo: formDataObj[0].value,                             // Play catapult ammo
                score:{
                        star1: formDataObj[1].value,                    // Score to get 1 star
                        star2: formDataObj[2].value,                    // Score to get 2 stars
                        star3: formDataObj[3].value                     // Score to get 3 stars
                    },
                background: formDataObj[4].value,                       // Level background
                objects: theLevel                                       // Level objects
            }
        }
        return $.param(levelDataToSave);                                // Serialize request
    }

    // Get data from library object add form then serialize it for the server
    librarySaveRequest(){
        let modalData = $('#modal-data-form').serializeArray();      // Get data from modal
        let objectName = "";                                            
        if($("#modal-submit").attr("value") == "EDIT")               // If modal is for editing an existing item
            objectName = modalData[0].value;                         // Set its name to same
        else                                                         // If it is for adding check the name for validity
            objectName = this.settings.setItemName("#library-items", modalData[0].value);
        let theObject = {                                            // Library object data
            type: modalData[3].value,                                // Type
            name: objectName,                                        // Name of the object
            height: modalData[1].value,                              // Height
            width: modalData[2].value,                               // Width
            texture: modalData[9].value,                             // Selected texture from images folder
            crop: modalData[10].value,                                // Selected texture from images folder
            hp: modalData[8].value,                                  // Hit Points
            shape: modalData[4].value,                               // Shape
            friction: modalData[6].value,                            // Friction
            mass: modalData[5].value,                                // Mass
            restitution: modalData[7].value,                         // Restitution
        }
        let objectDataToSave = {                                     // Information required for the server
            userid: this.userid,                                     // ID of the current user
            name: objectName,                                        // Name of the file
            datatype: 'object',                                      // Datatype for the server to categorize
            payload: theObject                                       // Object data
        }
        return $.param(objectDataToSave);                            // Serialize dictionary
    }

    // Get data from level as an array of objects
    dataFromLevel(){
        let levelData = [];                                         // Library items array
        $("#editor-viewport").children().each((i,el) =>{            // For each object in viewport
            let data = {                                            
                id: i,                                              // Object id
                pos: {
                        x: Math.floor($(el).position().left),       // X Position relative to viewport
                        y: Math.floor($(el).position().top)         // Y Position relative to viewport
                     },
                entity: this.getItemData($(el))                     // Object data
            }                   
            levelData.push(data);                                   // Add it to the array    
        });
        return levelData;                                           // Return all objects in an array
    }

    //============================= LOAD FROM SERVER =============================================
    // Load level list and if the data is successfully fetched load a level
    loadLevelList(defaultLevel = ""){
        let request = {"userid": this.userid};                              // Server post request is user id    
        let requestSerial = $.param(request);                               // Serialize request
        let levelSelect = $("#level-dropdown");                             // Level dropdown list
        $("#editor-viewport").html("");
        $('#objects-list').html("");
        $("#level-data-form").trigger("reset");
        $("input[name='levelName']").val("");                               // Clear level name input field
        levelSelect.html("");                                               // Clear dropdown menu
        $.post('./server/get_levels/', requestSerial).then(data => {       // Request level list via AJAX
        // console.log(data);
            data = JSON.parse(data);                                        // Convert data into JSON format
            if(data.error == "0"){                                          // If operation is successful
                $("#info").append(`Level list successfully loaded for user 
                <span class="debug-text"> ${request.userid}</span><br>`);
                if(data.payload == null || data.payload.length == 0)       // If level list is empty
                    $("#info").append(`<span class="debug-error">No levels found in the server</span><br><br>`);
                else{                                                       // If level list is not empty
                    $("#info").append(`<br>`);
                    for (let key in data.payload) {                         // Add all levels to dropdown list
                        if (data.payload.hasOwnProperty(key)) 
                            levelSelect.append(`<option value="${key}" data-file="${data.payload}">${key}</option>`)
                    }
                    if(defaultLevel == "")                                  // Set default level as dropdown default value
                        defaultLevel = $("#level-dropdown").val()
                    if(levelSelect.children().length != 0){                 // If level list has data
                        levelSelect.val(defaultLevel);
                        this.loadLevel(defaultLevel);                       // Load a level
                    }
                }
            }
            else if(data.error != 0)                                        // If there is an error with the server
                $("#info").html(`<span class="debug-error">
                Error ${data.error} occured while loading levels list</span><br>`);
        });                  
    }

    // Load objects list and if the data is successfully fetched load all objects to library
    loadObjectsLibrary(){
        let request = {"userid": this.userid};                              // Server post request is user id    
        let requestSerial = $.param(request);                               // Serialize request
        $("#library-items").html("");                                       // Level dropdown list
        $.post('./server/get_objects/', requestSerial).then(data => {      // Request level list via AJAX
            data = JSON.parse(data);                                        // Convert data into JSON format
            if(data.error == "0"){                                          // If operation is successful
                $("#info").append(`Objects list successfully loaded for user 
                <span class="debug-text">${request.userid}</span><br>`);
                if(data.payload == null || data.payload.length == 0)        // If object list is empty
                    $("#info").append(`<span class="debug-error">No objects found in the server</span><br><br>`);
                else{
                    $("#info").append(`<br>`);
                    for (let key in data.payload) {                         // For every file in object list
                        if (data.payload.hasOwnProperty(key)) 
                            this.loadObject(key);                           // Load library object
                    }
                }
            }
            else if(data.error != 0)                                        // If there is an error with the server
                $("#info").html(`<span class="debug-error">
                Error ${data.error} occured while loading objects list</span><br>`);
        });                  
    }

    // Load library object from the server
    loadObject(name){
        let request = {"userid": this.userid,"name":name,"datatype": "object"};      // Server post request 
        let requestSerial = $.param(request);                                        // Serialize request
        $.post('./server/load/', requestSerial).then(data => {                      // Request library object via AJAX
            data = JSON.parse(data);                                                 // Convert data into JSON format
            if(data.error == "0"){                                                   // If operation is successful
                let respItem = data.payload;                                         // Get object data 
                // Show success message
                $("#info").append(`Library object <span class="debug-text">${name}</span> successfully loaded 
                for user <span class="debug-text">${request.userid} </span>(${data.bytes} bytes)<br>`);
                $("#library-items").append(`<div data-name="${respItem.name}" class="lib-item"></div>`);
                let $item =  $(`#library-items div[data-name="${respItem.name}"]`);  // Add item to library and select it
                $item.draggable({                                                    // Make item draggable
                    containment: "window",                                           // Make it movable inside window
                    revert: "invalid",                                               // Show revert animation
                    helper: 'clone',                                                 // Drag clone instead of object itself
                    start: (event,ui) =>{                                            // Change the size to original when dragged
                        $(ui.helper).css("width", `${respItem.width}px`).css("height", `${respItem.height}px`) 
                                    .css("position", `absolute`).css("cursor" , 'grabbing')
                                    .css("background-size",`${respItem.crop == 0 ? respItem.width : respItem.crop}px ${respItem.height}px`);
                    }})
                    // Rescale object to fit in library

                    let rescaleWidth = respItem.height>100 ? respItem.width*100/respItem.height : respItem.width;
                    let rescaleHeight = respItem.height>100 ? 100 : respItem.height;
                    let rescaleCrop = respItem.height>100 ? (respItem.crop*100/respItem.height) : respItem.crop;
                    $item
                    .css("width", `${rescaleWidth}px`).css("height",`${rescaleHeight}px`)
                    .css("background-image", `url('./${respItem.texture}')`)
                    .css("background-size",`${respItem.crop == 0 ? rescaleWidth : rescaleCrop}px ${rescaleHeight}px`)
                    // Add data as attributes
                    .attr("data-type",respItem.type).attr("data-name",respItem.name).attr("data-shape",respItem.shape)
                    .attr("data-friction",respItem.friction).attr("data-mass",respItem.mass)
                    .attr("data-height",respItem.height).attr("data-width",respItem.width)
                    .attr("data-restitution",respItem.restitution).attr("data-hp",respItem.hp)
                    .attr("data-texture",respItem.texture).attr("data-crop",respItem.crop);
            }
            else if(data.error != 0){                                                // If there is an error with the server
                $("#info").html(`<span class="debug-error">
                Error ${data.error} occured while loading object ${name}</span>`);
            }
        });     
    }

    // Load level from server
    loadLevel(name){
        let request = {"userid": this.userid,"name":name,"datatype": "level"};          // Server post request 
        let requestSerial = $.param(request);                                           // Serialize request
        $("#editor-viewport").html("");                                                 // Clear viewport
        $.post('./server/load/', requestSerial).then(data => {                         // Request level via AJAX
            data = JSON.parse(data);                                                    // Convert data into JSON format
            if(data.error == "0"){                                                      // If operation is successful
                $("input[name='ammoCount']").val(data.payload.ammo);                    // Set Ammo input in level settings
                $("input[name='starScore1']").val(data.payload.score.star1);            // Set Star 1 Score input in level settings
                $("input[name='starScore2']").val(data.payload.score.star2);            // Set Star 2 Score input in level settings
                $("input[name='starScore3']").val(data.payload.score.star3);            // Set Star 3 Score input in level settings
                setTimeout(() => {                                                      // Set background dropdown value with a delay
                $("select[name='backgroundName']").val(data.payload.background);}, 100);        
                $("#editor-viewport").css("background",`url(${data.payload.background})`);  // Change viewport background
                $("#info").append(`Level <span class="debug-text">${name}</span> successfully loaded 
                for user <span class="debug-text">${request.userid}</span> (${data.bytes} bytes)<br>`);
                if(data.payload.objects != null && data.payload.objects.length != 0){   // Check if there are objects in level
                    for(let i=0; i<data.payload.objects.length;i++){                    // For every object in the list
                        let respItem = data.payload.objects[i];
                        let respEntity = data.payload.objects[i].entity;
                        $("#editor-viewport").append(`<div data-name="${respEntity.name}" class="game-item"></div>`)
                        let $item = $(`#editor-viewport div[data-name="${respEntity.name}"]`);
                        $item.draggable({                                               // Make object draggable inside the viewport
                                containment: "parent",              
                                drag: () =>{                                            // Change form input values
                                    $("input[name='objectTop']").val($item.position().top).prop('disabled', false);
                                    $("input[name='objectLeft']").val($item.position().left).prop('disabled', false);
                            }})
                            .css("width", `${respEntity.width}px`).css("top",`${respItem.pos.y}px`)
                            .css("height", `${respEntity.height}px`).css("left",`${respItem.pos.x}px`)
                            .css("background-image", `url('./${respEntity.texture}')`)
                            .css("background-size",`${respEntity.crop == 0 ? respEntity.width : respEntity.crop}px ${respEntity.height}px`)
                            .attr("data-type",respEntity.type).attr("data-texture",respEntity.texture)
                            .attr("data-shape",respEntity.shape).attr("data-friction",respEntity.friction)
                            .attr("data-mass",respEntity.mass).attr("data-height",respEntity.height)
                            .attr("data-crop",respEntity.crop).attr("data-hp",respEntity.hp)
                            .attr("data-width",respEntity.width).attr("data-restitution",respEntity.restitution);
                    }
                this.settings.updateTargets(); 

                }
                else                                                                    // If there are no objects in level
                    $("#info").append(`<span class="debug-error">Level contains no objects</span><br><br>`);
                this.settings.objectsMenu.fillObjectsList();                              // Create an option for each viewport object
            }
            else if(data.error != 0){                                                   // If there is an error with the server
                $("#info").html(`<span class="debug-error">
                Error ${data.error} occured while loading level ${name}</span>`);
            }
        });     
    }

    //============================= DELETE =============================================
    deleteLevel(){
        let $info = $("#info");                                                     // Action messages
        let levelName = $("#level-dropdown").val();                                 // Get selected level name from dropdown list
        if(!(levelName == "" || levelName == undefined || levelName == null)){      // Check if level name is valid
            let request = {"userid": this.userid,"name":levelName,"datatype": "level"};                  
            $.post('./server/delete/', request).then(data =>{                      // Save level via AJAX
                data = JSON.parse(data);                                            // Convert callback from the server to JSON
                if(data.error == "0"){                                              // If there is no error
                    // Show confirmation message
                    setTimeout(() => {
                        this.loadLevelList();
                    }, 100);
                    $info.append(`Level <span class="debug-text">${levelName}</span> successfully deleted for user 
                    <span class="debug-text"> ${this.userid}</span> </span>(${data.bytes} bytes)<br><br>`);
                }
                else if(data.error != 0)                                            // If there is an error
                    // Show error message if something went wrong with the server
                    $info.html(`<span class="debug-error">Error ${data.error} occured while deleting level</span>`);
            });             
        }
        else
            // Show error message if there are no levels created to be saved
            $info.html(`<span class="debug-error">Level is not found for delete operation</span>`) 
    }

    deleteLibraryObject(){
        let $info = $("#info");                                                     // Action messages
        let name = $("#ctx-menu-name").text();                                      // Get context menu title for object name
        if(!(name == "" || name == undefined || name == null)){                     // Check if level name is valid
            let request = {"userid": this.userid,"name":name,"datatype": "object"};                  
            $.post('./server/delete/', request).then(data =>{                      // Save level via AJAX
                data = JSON.parse(data);                                            // Convert callback from the server to JSON
                if(data.error == "0"){                                              // If there is no error
                    // Show confirmation message
                    setTimeout(() => {
                        this.loadObjectsLibrary();
                    }, 100);
                    $info.append(`Library item <span class="debug-text">${name}</span> is successfully deleted for user 
                    <span class="debug-text"> ${this.userid}</span> </span>(${data.bytes} bytes)<br><br>`);
                }
                else if(data.error != 0)                                            // If there is an error
                    // Show error message if something went wrong with the server
                    $info.html(`<span class="debug-error">Error ${data.error} occured while deleting level</span>`);
            });             
        }
        else
            // Show error message if there are no levels created to be saved
            $info.html(`<span class="debug-error">Object is not found for delete operation</span>`) 
    }


    //============================= OTHER =============================================
    // Get data from jquery element
    getItemData($item){
        let data = {                                        
                    'type': $item.attr("data-type"),                // Type
                    'name': $item.attr("data-name"),                // Name
                    'height': $item.attr("data-height"),            // Height
                    'width': $item.attr("data-width"),              // Width
                    'texture': $item.attr("data-texture"),          // Background Texture
                    'crop': $item.attr("data-crop"),                // Background Crop
                    'shape': $item.attr("data-shape"),              // Shape
                    'friction': $item.attr("data-friction"),        // Friction
                    'mass': $item.attr("data-mass"),                // Mass
                    'restitution': $item.attr("data-restitution"),  // Restitution
                    'hp': $item.attr("data-hp"),                    // HP
                    }
        return data;
    }

    // Load object texture filenames from images folder (images/textures)
    loadTextures(){
        let $textureList = $('select[name="itemTexture"]');             // Texture list dropdown in object add modal
        $textureList.html("");                                          // Clear current list
        $.get("./static/images/textures/", request =>{                  // Get filename via AJAX get 
            $(request).find("a:contains(.png)").each((index, el)=>{     // For each file (All textures are PNG)
                let fileName = $(el).attr("href");                      // Get filename
                let textureName = fileName.replace('.png', '')          // Remove extension before adding
                // Add to textures dropdown list with filepath as the value
                $textureList.append(`<option value="./static/images/textures/${fileName}">${textureName}</option>`)
            });
        });
    }
    // Load background image filenames from images folder (images/backgrounds)
    loadBackgrounds(){
        let $backgroundsList = $('select[name="backgroundName"]');      // Background list dropdown in level options side menu
        $backgroundsList.html("");                                      // Clear current list
        $.get("./static/images/backgrounds/", request =>{               // Get filename via AJAX get 
            $(request).find("a:contains(.jpg)").each((index, el)=>{     // For each file (All backgrounds are JPG)
            let fileName = $(el).attr("href");                          // Get filename
            let backgroundName = fileName.replace('.jpg', '')           // Remove extension before adding
            // Add to backgrounds dropdown list with filepath as the value
            $backgroundsList.append(`<option value="./static/images/backgrounds/${fileName}">${backgroundName}</option>`)
            });
        });
    }

}
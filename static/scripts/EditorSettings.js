/**
 @copyright: Copyright (C) 2019  Eser Kokturk. All Rights Reserved.
 */
import ObjectsMenu from "./ObjectsMenu.js";

export default class EditorSettings{

    constructor(){
        this.objectsMenu = new ObjectsMenu();                                                       // Objects menu functionality
        setTimeout(() => {this.viewportEvents();}, 200);                                                                      // Viewport functions
        this.libraryModal();                                                                        // Library modal functions
        this.setModalViewer();                                                                      // Reset libary modal object
        this.rightClickMenu();                                                                      // Setup context menu
        $("#library-items-container").on('mousewheel', event=>{ this.libraryScroll(event); });      // Library mouse scrolling
        $("#editor-tabs").on('click', event =>{ this.toggleMenus() });                              // Setup side menu tabs
        // Update library modal objects when values are changed
        $("input[name='itemHeight']").on('keyup input paste', () => this.setModalViewer());              
        $("input[name='itemWidth']").on('keyup input paste', () => this.setModalViewer());
        $("input[name='itemCrop']").on('keyup input paste', () => this.setModalViewer());
        $("select[name='itemTexture']").on('change', () => this.setModalViewer());
        // Object manipulation and selection
        $("#objects-list").on('click', event => this.selectObject(event));
        $("#objects-delete").on('click', event =>this.deleteObject(event));
        $("#objects-copy").on('click', event =>this.copyObject(event));
    }

    // Toggle editor options menu tabs
    toggleMenus(){
        let $target = $(event.target);                                                  
        $('#level-options').addClass( "hide" );                                             // Hide level settings
        $('#objects-options').addClass( "hide" );                                           // Hide object settings
        $("#editor-tabs").children().removeClass( "tab-on" ).addClass( "tab-off" );         // Reset tabs to unclicked
        if( $target.attr('id') == "tab-level"){                                             // If level tab is click
            $target.removeClass( "tab-off" ).addClass( "tab-on" );                          // Set it visually to be on
            $('#level-options').removeClass( "hide" );                                      // Show level options
        }
        else if( $target.attr('id') == "tab-objects"){                                      // If object tab is clicked
            $target.removeClass( "tab-off" ).addClass( "tab-on" );                          // Set it visually to be on
            $('#objects-options').removeClass( "hide" );                                    // Show objects options
        }
    }

    // Horizontal scrolling for library
    libraryScroll(event){
        event.preventDefault();
        //stackoverflow.com/a/36879891
        // Add mousewheel control to library navigation
        let delta = -Math.max(-1, Math.min(1, (event.originalEvent.wheelDelta || -event.originalEvent.detail)));
        $("#library-items-container").scrollLeft($("#library-items-container").scrollLeft() - ( delta * 40 ) );
    }

    // ================================ VIEWPORT ================================
    // Add events to viewport
    viewportEvents(){
        let $viewport = $("#editor-viewport");                               // Get viewport
        let viewportX =  $viewport.position().left;                          // Viewport left position
        let viewportY =  $viewport.position().top;                           // Viewport top position
        $viewport.on('mousedown', event => this.selectGameItem(event));          // When an object is clicked select it
        $(".game-item").draggable({                                          // Make game object draggable
             containment: "parent",                                          // Limit its motion to viewport
             drag: () =>{                                                    // When it is dragged
                let $dragged = $(ui.helper).clone();
                $("input[name='objectTop']").val($dragged.position().top).prop('disabled', false);
                $("input[name='objectLeft']").val($dragged.position().left).prop('disabled', false);
             }});
        let $background = $("select[name='backgroundName']")
        $background.on('change keyup', () => {
        $viewport.css("background",`url(${$background.val()})`)});
        $viewport.droppable({                           // Make library item to drop to viewport when released
            accept: ".lib-item",                                                                // Set element type
            tolerance: "pointer",
            drop: (event, ui) =>{                                                               // After drop is successful
                let $dragClone = $(ui.helper).clone();                                          // Get dragged clone of the item
                if($("#editor-viewport").find(`[data-type="catapult"]`).length > 0 &&
                    $dragClone.attr("data-type") == 'catapult'){
                    $("#info").html(`<span class="debug-error">There can be only one "Catapult" type in the game</span>`);
                }
                else{
                    // Make middle of the dropped object to snap to mouse location
                    let dropLocX = Math.floor(event.clientX - viewportX - $dragClone.width()/2);    // Set its X location
                    let dropLocY = Math.floor(event.clientY - viewportY - $dragClone.height()/2);   // Set its Y location
                    // Snap object to viewport if it is out of boundaries
                    if(event.clientY > viewportY){                                                  
                        if(event.clientX - viewportX + $dragClone.width() > 1280)                   
                            dropLocX = 1280 - $dragClone.width();
                        else if (dropLocX < 0) 
                            dropLocX = 0;                
                        if(event.clientY - viewportY + $dragClone.height()  > 720) 
                            dropLocY = 720 - $dragClone.height();
                        else if (dropLocY < 0) 
                            dropLocY = 0;
                        let clonedItemName = this.setItemName("#editor-viewport",$dragClone.attr("data-name"));
                        $dragClone                                                                  // Add item inside viewport html
                            .attr("data-name",clonedItemName).appendTo($viewport).css("cursor" , 'grab')
                            .attr("class", "game-item").attr("id", "").css("top", `${dropLocY}px`)
                            .css("left", `${dropLocX}px`).draggable({ 
                                containment: "parent", 
                                drag: () =>{
                                    $("input[name='objectTop']").val($dragClone.position().top).prop('disabled', false);
                                    $("input[name='objectLeft']").val($dragClone.position().left).prop('disabled', false);
                            }});
                            this.objectsMenu.fillObjectsList();
                            $viewport.find(`.game-item-select`).removeClass("game-item-select");        // Remove selected CSS
                            $("#info").html(`Game object <span class="debug-text">${clonedItemName}</span> is created`);
                            this.updateTargets(); 
                    }

                }
            }
        });
    }

    // Select game object when click, deselect it otherwise both in viewport and objects list
    selectGameItem(event){
        let $target = $(event.target);                             // Get target of selection event
        $("#editor-viewport").find(`.game-item-select`)            // Find selected game object
                             .removeClass("game-item-select");     // Deselect it by removing class
        $("#objects-list option").prop("selected", false);         // Deselect item in the objects list
        if($target.hasClass('game-item')){                         // If clicked element is a game object
            $target.addClass("game-item-select");                  // Select that game object
            $(`#objects-list`).children().each((i,el)=>{           // Search each element in objects list
                if($(el).text() == $target.attr("data-name"))      // If div text is exactly same as object name
                    $(el).prop("selected", true);                  // Select that option in the list
            });
        }
        this.objectsMenu.showObjectData($target);
    }

    // ================================ MODAL ================================
    // Actions for library modal
    libraryModal(){                                                     
        let $modal = $("#library-add-modal");
        let $form = $("#library-add-form");
        $("#editor-library").on("click", event => {                     // When library is click
            if(event.target.id == "library-add"){                       // If it is add button
                this.resetModal();                                      // Reset modal form data to default
                $form.trigger("reset");                                 // Clear form data
                this.setModalViewer();                                  // Reset modal object
                $modal.show();                                          // Show library modal
            }
        });
        $modal.on("click",  event => {                                  
            if(event.target.id == "modal-close"){                       // If close button is clicked
                $form.trigger("reset");                                 // Reset modal form data
                $modal.hide();                                          // Hide Modal
            }
            else if(event.target.id == "modal-reset"){                  // If reset button is clicked
                setTimeout(() => {this.setModalViewer();}, 100);        // Reset modal object with a small delay
                $form.trigger("reset");                                 // Reset modal form data
            }
        });
    }

    // Set modal for library object edit action and add objects data as form input values
    setModalForSelected($item){
        $("#modal-title").html("EDIT LIBRARY ITEM");                                            // Change modal title
        $('#modal-submit').attr("value",`EDIT`);                                                // Change modal submit value
        $('input[name="itemName"]').attr("value",`${$item.attr("data-name")}`)                  // Set name as objects name
                                   .attr("readonly",`readonly`);                                // Make name uneditable
        $('input[name="itemHeight"]').attr("value",`${$item.attr("data-height")}`);             // Change modal input to object height
        $('input[name="itemWidth"]').attr("value",`${$item.attr("data-width")}`);               // Change modal input to object width
        $('select[name="itemType"]').attr("value",`${$item.attr("data-type")}`);                // Change modal dropdown to object type
        $('select[name="itemType"]').find(`[value="${$item.attr('data-type')}"]`)               
                                    .attr("selected",`selected`)                                // Set that value for type default
        $('select[name="itemShape"]').val(`${$item.attr("data-shape")}`);                       // Change modal input to object shape
        $('select[name="itemShape"]').find(`[value="${$item.attr('data-shape')}"]`)
                                     .attr("selected",`selected`);                              // Set that value for shape default
        $('input[name="itemMass"]').attr("value",`${$item.attr("data-mass")}`);                 // Change modal input to object mass
        $('input[name="itemFriction"]').attr("value",`${$item.attr("data-friction")}`);         // Change modal input to object friction
        $('input[name="itemRestitution"]').attr("value",`${$item.attr("data-restitution")}`);   // Change modal input to object restitution
        $('input[name="itemHP"]').attr("value",`${$item.attr("data-hp")}`);                     // Change modal input to object hp
        $('input[name="itemCrop"]').attr("value",`${$item.attr("data-crop")}`);                     // Change modal input to object hp
        $('select[name="itemTexture"]').val(`${$item.attr("data-texture")}`);                   // Change modal dropdown to object texture
        $('select[name="itemTexture"]').find(`[value="${$item.attr('data-texture')}"]`)
                                       .attr("selected",`selected`);                            // Set that value for texture default
      
    }

    // Set modal to default value for adding a library object
    resetModal(){
        $('select[name="itemShape"]').children().removeAttr('selected');        // Set shape dropdown list to default value
        $('select[name="itemType"]').children().removeAttr('selected');         // Set type dropdown list to default value
        $('select[name="itemTexture"]').children().removeAttr('selected');      // Set texture dropdown list to default value
        $('input[name="itemName"]').attr("value",``)                            // Clear name input field
                                   .removeAttr("readonly",`readonly`);          // Set name input field to editable
        $('input[name="itemHeight"]').attr("value",75);                         // Set height to default value 
        $('input[name="itemWidth"]').attr("value",75);                          // Set width to default value
        $('input[name="itemMass"]').attr("value",50);                           // Set mass to default value
        $('input[name="itemFriction"]').attr("value",0);                        // Set friction to default value
        $('input[name="itemHP"]').attr("value",1);                              // Set friction to default value
        $('input[name="itemCrop"]').attr("value",0);                              // Set friction to default value
        $('input[name="itemRestitution"]').attr("value",0);                     // Set restitution to default value
        $("#modal-title").html("ADD ITEM TO LIBRARY");                          // Change modal title
        $('#modal-submit').attr("value",`ADD`);                                 // Submit value
    }

    // Change visual representation of the object in library modal
    setModalViewer(){
        let $height = $("input[name='itemHeight']").val();                                      // Height Input
        let $width = $("input[name='itemWidth']").val();                                        // Width Input
        let $crop = $("input[name='itemCrop']").val();                                          // Crop Input
        let $texture = $("select[name='itemTexture']").val();                                   // Texture Input
        let $modalView = $("#modal-view");                                                      // Library Modal Object
        if($width >= 5 && $width <=550 && $height >= 5 && $height <= 400){                      // Check if input is valid for width and height
            $modalView.css("top",200-$height/2).css("left",275-$width/2)
                      .css("width",$width).css("height",$height)
                      .css("background-size", `${$crop == 0 ? $width : $crop}px ${$height}px`)     // Change objects style
        }
        $modalView.css("background-image",`url(${$texture})`)
                      .css("position", "absolute").css("background-repeat","no-repeat")
                      .draggable({containment: "parent"})
    }

    // ================================ OBJECT OPTIONS ================================
    // Select object from objects list
    selectObject(){
        $("#objects-list option").prop("selected", false);                              // Clear objects list selection
        let $target = $(event.target);                                                  // Get event target
        let itemName = $target.text();                                                  // Get target name
        $target.prop("selected", true);                                                 // Select target in objects list
        $("#editor-viewport div").removeClass("game-item-select");                      // Remove previous selection in viewport
        let $itemElement = $("#editor-viewport").find(`[data-name="${itemName}"]`);     // Find newly selected object
        $itemElement.addClass("game-item-select");                                      // Select current object
        this.objectsMenu.showObjectData($itemElement);                                  // Show object data in objects form
    }

    // Copy an object in the viewport
    copyObject(){
        let itemName = $("#objects-list option:selected").text();                                 // Get selected object name
        if(itemName != "" && itemName != undefined){                                              // If name is valid
            let newItemName = this.setItemName("#editor-viewport", itemName);                     // Set name as unique
            let $selectedItem = $("#editor-viewport").find(`[data-name="${itemName}"]`);
            if($("#editor-viewport").find(`[data-type="catapult"]`).length > 0 &&
                $selectedItem.attr("data-type") == 'catapult'){
                $("#info").html(`<span class="debug-error">There can be only one "Catapult" type in the game</span>`);
            }
            else{
                let $copyItem = $selectedItem.clone();                                             // Copy object
                $copyItem.appendTo("#editor-viewport")                                            // Attach copy object to viewport
                    .attr("data-name",newItemName).draggable(                                     // Change its name
                    { containment: "parent",                                                      // Make object draggable inside viewport
                        drag: () =>{
                        $("input[name='objectTop']").val($copyItem.position().top).prop('disabled', false);
                        $("input[name='objectLeft']").val($copyItem.position().left).prop('disabled', false);}
                    });
                this.updateTargets(); 
                // Show confirmation message
                $("#info").html(`Game object <span class="debug-text">
                                ${itemName}</span> copied as <span class="debug-text">${newItemName}</span> `);

            }
            $("#editor-viewport div").removeClass("game-item-select");
            this.objectsMenu.fillObjectsList();                                                    // Add viewport objects to list
        }
        else                                                                                       // If no object is selected
            $("#info").html(`<span class="debug-error">No object selected for COPY</span>`);
   }

   // Delete an object from the viewport
   deleteObject(){
      let itemName = $("#objects-list option:selected").text();
      if(itemName != "" && itemName != undefined){                                                  // Check if an object is selected
         $("#editor-viewport").find(`[data-name="${itemName}"]`).remove();                          // Delete object element
         $("#objects-list option:selected").remove();                                               // Delete list element
         $("#info").html(`Game object <span class="debug-text">${itemName}</span> is deleted`);     // Confirmation message   
         this.updateTargets(); 
      }
      else                                                                                          // If no object is selected
         $("#info").html(`<span class="debug-error">No object selected for DELETE</span>`);
   }

    // ================================ OTHER ================================
    // Set name of an item, if there is one with the same name change name
    setItemName(id, name){
        let itemName = name, i = 1;                                         // Initialize variables
        if(itemName.includes('('))                                          // Check if item has paranthesis in its name
            itemName = itemName.substr(0, itemName.indexOf('('));           // If there is remove it
        if($(id).find(`[data-name="${itemName}"]`).length == 0)             // If there are no objects with same name
            return itemName;                                                // Return that name
        itemName = itemName + `(${i})`;                                        
        for(i; $(id).find(`[data-name="${itemName}"]`).length != 0; i++){   // If there is an object with same name
            itemName = itemName.replace(`(${i})`,`(${i+1})`);               // Increment copy name 
        }
        return itemName;
    }

    // Function for context menu which appears when a library or level object is right clicked
    rightClickMenu(){
        let $editor = $("#editor-area");                                                        // Library and viewport area
        let $menu = $("#ctx-menu");                                                             // Context menu
        // Context menu for level objects
        $("#ctx-game-item-copy").on('click', () =>{ this.copyObject(); });                      // Add copy function to context menu
        $("#ctx-game-item-up").on('click', () =>{ this.objectsMenu.moveSelectedUp(); });        // Add move up function to context menu
        $("#ctx-game-item-down").on('click', () =>{ this.objectsMenu.moveSelectedDown(); });    // Add move down function to context menu
        $("#ctx-game-item-delete").on('click', () =>{ this.deleteObject(); });                  // Add delete function to context menu
        // Context menu for library objects
        $("#ctx-lib-item-edit").on('click', () =>{                                  // Edit function for context menu
            let name = $("#ctx-menu-name").text();                                  // Get context menu title for object name
            let $item = $("#library-items").find(`[data-name="${name}"]`);          // Find the object in library items
            this.setModalForSelected($item);                                        // Set modal data values as objects values
            $("#library-add-form").trigger("reset");                                // Reset modal to object values
            this.setModalViewer();                                                  // Change modal object to library object
            $("#library-add-modal").show();                                         // Show modal
        });
        $editor.on('contextmenu', event =>{
            event.preventDefault();                                                 // Prevent default context menu
            $menu.addClass('hide');                                                 // Hide when clicked right mouse button
            $("#ctx-game-item-opts").addClass('hide');                              // Hide options for level objects
            $("#ctx-lib-item-opts").addClass('hide');                               // Hide options for library objects
            if($(event.target).hasClass("game-item")){                              // Click event for level objects
                $("#ctx-menu-name").text($(event.target).attr("data-name"));        // Change conext menu title to object name
                $("#ctx-game-item-opts").removeClass('hide');                       // Show level object options
                $menu.removeClass('hide');                                          // Show context menu
            }
            else if($(event.target).hasClass("lib-item")){                          // Click event for library objects
                $("#ctx-menu-name").text($(event.target).attr("data-name"));        // Change conext menu title to object name
                $("#ctx-lib-item-opts").removeClass('hide');                        // Show library object options
                $menu.removeClass('hide');                                          // Show context menu
            }
            // Reallign context menu if it is out of viewport
            let posX = event.clientX + $menu.width() > $editor.offset().left + $editor.width() ?
                    event.clientX - $menu.width() - 20 : event.clientX;
            let posY = event.clientY + $menu.height() > $editor.offset().top + $editor.height() ?
                    event.clientY - $menu.height() - 20 : event.clientY;
            $menu.offset({ top: posY, left: posX });
        });
        $("body").on('click drag', event => {
            if(!(event.target.id == "ctx-menu" || event.target.id == "ctx-menu-name"))
                $menu.addClass('hide');
        });
    }         
    // Update target count in the editor viewport
    updateTargets(){
        let $targetCount = $("#target-count");
        $targetCount.html($("#editor-viewport").find(`[data-type="target"]`).length);
    }

    // Check if level name is invalid or already existing one
    newLevelName() {
        let $inputName = $("input[name='levelName']");                                  // Get level input from the field
        let inputValue = $inputName.val();                                              // Get inputfields value
        if (/^[a-zA-Z0-9_-]{1,30}$/.test(inputValue) &&                                 // Check if characters are valid
            $('#level-dropdown').find(`option[value="${inputValue}"]`).length == 0) {   // Check if level already exists
            $("#info").html(``);                                                        // Clear action message
            return true;                                                                // Return true since name checks out
        }
        else {                                                                          // If there is a problem with the name
        $("#info").html(`<span class="debug-error">Input Error: ${$inputName.attr("title")}</span>`);
        $inputName.addClass("debug-input");                                             // Show error animation in inputfield
        $inputName.removeClass("debug-input",2000);
        return false;                                                                   
        }
    }

}
/**
 @copyright: Copyright (C) 2019  Eser Kokturk. All Rights Reserved.
 */

'use strict';

export default class ObjectsMenu {
   constructor() {
      // Change order of objects in viewport
      $("#objects-move-up").on('click', event => { this.moveSelectedUp() });              // Send object backward
      $("#objects-move-down").on('click', event => { this.moveSelectedDown() });          // Bring object forward
      $("#objects-move-top").on('click', event => { this.moveSelectedTop() });            // Send object to back
      $("#objects-move-bottom").on('click', event => { this.moveSelectedBottom() });      // Bring object to front

      // Change data of level object when form data is changed and the input is valid
      $("input[name='objectName']").on('keyup paste', event => { this.changeName() });                      // Change name
      $("input[name='objectTop']").on('keyup input paste', event  => { this.changeTopPosition() });         // Change top location
      $("input[name='objectLeft']").on('keyup input paste', event => { this.changeLeftPosition() });        // Change left location
      $("input[name='objectHeight']").on('keyup input paste', event => { this.changeHeight() });            // Change height
      $("input[name='objectWidth']").on('keyup input paste', event => { this.changeWidth() });              // Change width
      $("input[name='objectMass']").on('keyup input paste', event => { this.changeMass() });                // Change mass
      $("input[name='objectHP']").on('keyup input paste', event => { this.changeHP() });                // Change HP
      $("input[name='objectFriction']").on('keyup input paste', event => { this.changeFriction() });        // Change friction
      $("input[name='objectRestitution']").on('keyup input paste', event => { this.changeRestitution() });  // Change restitution
   }

   // ======================== CHANGE OBJECT DATA FROM INPUT FIELDS ===============================================
   // Fill in object list on side editor with objects from viewport
   fillObjectsList(){
      $("#objects-list").html("");                                                    // Clear objects list
      $("#editor-viewport").children().each((i, el) =>{                               // For each object in viewport
         $("#objects-list").append(`<option>${$(el).attr("data-name")}</option>`);    // Add a option to object list
      });
   }

   // When a level object is selected show its stats in objects tab form
   showObjectData($item){
      if($item.hasClass('game-item')){                                                                      //  if click item is a level object
         $(".debug-input").removeClass("debug-input");                                                      // Clear error style from input fields
         $("input[name='objectName']").val($item.attr("data-name")).prop('disabled', false);                // Set name input as object name, make it editable
         $("input[name='objectTop']").val(Math.floor(Number($item.position().top)))                         // Set top position input as object top, make it editable
                     .prop('disabled', false).attr("max",Number(720-$item.attr("data-height")));            // Set validification for it according to its height
         $("input[name='objectLeft']").val(Math.floor(Number($item.position().left)))                       // Set left position input as object left, make it editable
                     .prop('disabled', false).attr("max",Number(1280-$item.attr("data-width")));            // Set validification for it according to its width
         $("input[name='objectHeight']").val($item.attr("data-height")).prop('disabled', false);            // Set height input as object height, make it editable
         $("input[name='objectWidth']").val($item.attr("data-width")).prop('disabled', false);              // Set width input as object width, make it editable
         $("input[name='objectMass']").val($item.attr("data-mass")).prop('disabled', false);                // Set mass input as object mass, make it editable
         $("input[name='objectFriction']").val($item.attr("data-friction")).prop('disabled', false);        // Set friction input as object friction, make it editable
         $("input[name='objectRestitution']").val($item.attr("data-restitution")).prop('disabled', false);  // Set restitution input as object restitution, make it editable
         $("input[name='objectHP']").val($item.attr("data-hp")).prop('disabled', false);                    // Set hp input as object restitution, make it editable
         $("input[name='objectType']").val($item.attr("data-type"));                                        // Set type input as object type
         $("input[name='objectShape']").val($item.attr("data-shape"));                                      // Set shape input as object shape
         let textureName = $item.attr("data-texture");                                                      // Remove path from texture
         textureName = textureName.replace("./static/images/textures/", "");
         textureName = textureName.replace(".png", "");
         $("input[name='objectTexture']").val(textureName);                                                 // Set texture input field as texture
         $("#info").html(`Selected object <span class="debug-text"> ${$item.attr("data-name")}</span>`);
      }
      else{                                                                                                 // If level object is not clicked
         $("#object-data-form").find("input").each((index, el)=>{                                           // Make input fields uneditable and remove their text
               $(el).val("").prop('disabled', true);
         });
         $("#info").html(``);                                                                               // Clear action message
      }
   }

   // Change level object name from objects list form name input field
   changeName() {
      let $inputName = $("input[name='objectName']");                                     // Get input field for name
      let inputValue = $inputName.val();                                                  // Get value of input field
      let $selectedItem = $("#editor-viewport").find(`.game-item-select`);                // Find selected item in viewport
      if (/^[a-zA-Z0-9_-]{1,30}$/.test(inputValue) &&                                     // Check if characters are valid
         $('#editor-viewport').find(`[data-name="${inputValue}"]`).length == 0) {         // Check if name does not exist
         $("#objects-list option:selected").text(inputValue);                             // Change name in objects list
         $selectedItem.attr("data-name", inputValue);                                     // Change level object data attribute
         $inputName.removeClass("debug-input");                                           // Clear error style if it is added
         // Show confirmation message
         $("#info").html(`Object name changed to <span class="debug-text">${inputValue}</span>`);
      }
      else {                                                                              // If name is invalid
         if ($('#editor-viewport').find(`[data-name="${inputValue}"]`).index() != $selectedItem.index()) {
            // Show error message
            $("#info").html(`<span class="debug-error">Input Error: ${$inputName.attr("title")}</span>`);
            $inputName.addClass("debug-input");                                           // Add error style
         }
      }
   }

   // Change Top (Y) postion of the level object from objects list form
   changeTopPosition() {
      let $item = $("#editor-viewport").find(`.game-item-select`);                        // Find selected item in viewport
      let $inputTop = $("input[name='objectTop']");                                       // Get input field for top position
      let inputValue = Number($inputTop.val());                                           // Get top input vlaue as a number
      let itemHeight = Number($item.attr("data-height"));                                 // Get height value from object
      if (inputValue >= 0 && inputValue + itemHeight <= 720) {                            // Check position of the box according to its height
         $inputTop.removeClass("debug-input");                                            // Remove error from input field
         $item.css("top", `${inputValue}px`);                                             // Change object top position
         // Success message
         $("#info").html(`Top position of object <span class="debug-text">${$item.attr("data-name")}</span>
          changed to <span class="debug-text">${inputValue}</span>`);
      }
      else {                                                                              // If object is at viewport boundaries
         // Error message
         $("#info").html(`<span class="debug-error">Input Error: Object cannot be moved out of viewport boundaries</span>`);
         $inputTop.addClass("debug-input");                                               // Add error style to input field
      }
   }
   // Change Left (X) postion of the level object from objects list form
   changeLeftPosition(){
      let $inputLeft = $("input[name='objectLeft']");                                     // Get input field for left position
      let $item = $("#editor-viewport").find(`.game-item-select`);                        // Find selected item in viewport
      let inputValue = Number($inputLeft.val());                                          // Get left position value as a input
      let itemWidth = Number($item.attr("data-width"));                                   // Get width value from object
      if (inputValue >= 0 && inputValue + itemWidth <= 1280) {                            // Check position of the box according to its width
         $inputLeft.removeClass("debug-input");                                           // Remove error from input field
         $item.css("left", `${inputValue}px`);                                            // Change object left position
         // Success message
         $("#info").html(`Left position of object <span class="debug-text">${$item.attr("data-name")}</span>
          changed to <span class="debug-text">${inputValue}</span>`);
      }
      else {                                                                              // If object is at viewport boundaries
         // Error message
         $("#info").html(`<span class="debug-error">Input Error: Object cannot be moved out of viewport boundaries</span>`);
         $inputLeft.addClass("debug-input");
      }
   }

   // Change height of the level object from objects list form
   changeHeight(){
      let $inputHeight = $("input[name='objectHeight']");                                 // Get input field for height
      let $inputTop = $("input[name='objectTop']");                                       // Get input field for top position
      let $item = $("#editor-viewport").find(`.game-item-select`);                        // Find selected item in viewport
      let cropData = Number($item.attr("data-crop"));                                    // Get new object crop
      let widthData = Number($item.attr("data-width"));                                    // Get new object crop
      let inputValue = Number($inputHeight.val());                                        // Get height value as a input
      if (inputValue >= 5 && inputValue <= 400) {                                         // Check for height limits
         $inputHeight.removeClass("debug-input");                                         // Remove error style from input field
         $item.css("height", `${inputValue}px`);                                          // Change object height visually
         $item.css("height", `${inputValue}px`); 
         $item.css("background-size",`${cropData == 0 ? widthData : cropData}px ${inputValue}px`)
         $item.attr("data-height", inputValue);                                           // Change object height from data attributes
         let itemHeight = Number($item.attr("data-height"));                              // Get new object height
         $inputTop.attr("max", Number(720 - $item.attr("data-height")));                  // Set new maximum limit for input field
         if (itemHeight + $item.position().top >= 720) {                                  // If you are at the viewport boundaries
            $inputTop.removeClass("debug-input");                          
            $item.css("top", 720 - itemHeight);                                           // Change height by locking its position at boundary
            $inputTop.val(720 - itemHeight);
         }
         // Success message
         $("#info").html(`Height of object <span class="debug-text">${$item.attr("data-name")}</span>
          changed to <span class="debug-text">${$item.attr("data-height")}</span>`);
      }
      else {                                                                              // Check if size is invalid
         // Error message
         $("#info").html(`<span class="debug-error">Input Error: Object cannot be moved out of viewport boundaries</span>`);
         $inputHeight.addClass("debug-input");
      }
   }

   // Change width of the level object from objects list form
   changeWidth(){
      let $inputWidth = $("input[name='objectWidth']");                                   // Get input field for width
      let $inputLeft = $("input[name='objectLeft']");                                     // Get input field for left position
      let $item = $("#editor-viewport").find(`.game-item-select`);                        // Find selected item in viewport
      let cropData = Number($item.attr("data-crop"));                                    // Get new object crop
      let heightData = Number($item.attr("data-height"));                                    // Get new object crop
      let widthData = Number($item.attr("data-width"));                                    // Get new object crop
      let cropRatio = cropData / widthData;
      let inputValue = Number($inputWidth.val());                                         // Get height value as a input
      if (inputValue >= 5 && inputValue <= 550) {                                         // Check for width limits
         $inputWidth.removeClass("debug-input");                                          // Remove error style from input field
         $item.css("width", `${inputValue}px`);                                           // Change object width visually
         $item.css("background-size",`${cropData == 0 ? inputValue : inputValue*cropRatio}px ${heightData}px`)
         $item.attr("data-width", inputValue);                                            // Change object width from data attributes
         $item.attr("data-crop", inputValue*cropRatio);                                            // Change object width from data attributes
         let itemWidth = Number($item.attr("data-width"));                                // Get new object width
         $inputLeft.attr("max", Number(1280 - $item.attr("data-width")));                 // Set new maximum limit for input field
         if (Math.floor(itemWidth) + $item.position().left >= 1280) {                     // If you are at the viewport boundaries
            $inputLeft.removeClass("debug-input");
            $item.css("left", 1280 - itemWidth);                                          // Change width by locking its position at boundary
            $inputLeft.val(1280 - itemWidth);
         }
         // Success message
         $("#info").html(`Width of object <span class="debug-text">${$item.attr("data-name")}</span>
          changed to <span class="debug-text">${$item.attr("data-width")}</span>`);
      }
      else {                                                                              // Check if size is invalid
         // Error message
         $("#info").html(`<span class="debug-error">Input Error: Object cannot be moved out of viewport boundaries</span>`);
         $inputWidth.addClass("debug-input");
      }
   }

   // Change mass of the level object from objects list form
   changeMass(){
      let $inputMass = $("input[name='objectMass']");                                     // Get input field for mass
      let $item = $("#editor-viewport").find(`.game-item-select`);                        // Find selected item in viewport
      let inputValue = Number($inputMass.val());                                          // Get mass value as a input
      if (inputValue >= 0.1 && inputValue <= 1000) {                                      // Check for mass limits
         $inputMass.removeClass("debug-input");                                           // Remove error style from input field
         $item.attr("data-mass", inputValue);                                             // Change object mass from data attributes 
         // Success message
         $("#info").html(`Mass of object <span class="debug-text">${$item.attr("data-name")}</span>
          changed to <span class="debug-text">${$item.attr("data-mass")}</span>`);
      }
      else {
         // Error message
         $("#info").html(`<span class="debug-error">Input Error: Mass has to be between 0.1 and 1000</span>`);
         $inputMass.addClass("debug-input");
      }
   }
   // Change friction of the level object from objects list form  
   changeFriction(){
      let $inputFriction = $("input[name='objectFriction']");                             // Get input field for friction
      let $item = $("#editor-viewport").find(`.game-item-select`);                        // Find selected item in viewport
      let inputValue = Number($inputFriction.val());                                      // Get friction value as a input
      if (inputValue >= 0 && inputValue <= 1) {                                           // Check for friction limits
         $inputFriction.removeClass("debug-input");                                       // Remove error style from input field
         $item.attr("data-friction", inputValue);                                         // Change object friction from data attributes 
         // Success message
         $("#info").html(`Friction of object <span class="debug-text">${$item.attr("data-name")}</span>
          changed to <span class="debug-text">${$item.attr("data-friction")}</span>`);
      }
      else {
         // Error message
         $("#info").html(`<span class="debug-error">Input Error: Friction has to be between 0 and 1</span>`);
         $inputFriction.addClass("debug-input");                                          // Check if size is invalid
      }
   }
   // Change restitution of the level object from objects list form  
   changeRestitution(){
      let $inputRestitution = $("input[name='objectRestitution']");                       // Get input field for restitution
      let $item = $("#editor-viewport").find(`.game-item-select`);                        // Find selected item in viewport
      let inputValue = Number($inputRestitution.val());                                   // Get restitution value as a input
      if (inputValue >= 0 && inputValue <= 1) {                                           // Check for restitution limits
         $inputRestitution.removeClass("debug-input");                                    // Remove error style from input field
         $item.attr("data-restitution", inputValue);                                      // Change object restitution from data attributes 
         // Success message
         $("#info").html(`Restitution of object <span class="debug-text">${$item.attr("data-name")}</span>
          changed to <span class="debug-text">${$item.attr("data-restitution")}</span>`);
      }
      else {
         // Error message
         $("#info").html(`<span class="debug-error">Input Error: Restitution has to be between 0 and 1</span>`);
         $inputRestitution.addClass("debug-input");                                       // Check if size is invalid
      }
   }

   // Change hp of the level object from objects list form  
   changeHP(){
      let $inputHP = $("input[name='objectHP']");                                         // Get input field for hp
      let $item = $("#editor-viewport").find(`.game-item-select`);                        // Find selected item in viewport
      let inputValue = Number($inputHP.val());                                            // Get HP value as a input
      if (inputValue >= 0 && inputValue <= 100) {                                         // Check for hp limits
         $inputHP.removeClass("debug-input");                                              // Remove error style from input field
         $item.attr("data-hp", inputValue);                                               // Change object HP from data attributes 
         // Success message
         $("#info").html(`HP of object <span class="debug-text">${$item.attr("data-name")}</span>
          changed to <span class="debug-text">${$item.attr("data-hp")}</span>`);
      }
      else {
         // Error message
         $("#info").html(`<span class="debug-error">Input Error: HP has to be between 0 and 100</span>`);
         inputHP.addClass("debug-input");                                       // Check if size is invalid
      }
   }


   // ======================== CHANGE OBJECT ORDER ===============================================
   // Send game object backward in viewport or move it up in objects list
   moveSelectedUp() {
      let $item = $("#editor-viewport").find(`.game-item-select`);      // Find selected object
      if ($item.html() != undefined) {                                  // Check if selectionis valid
         let $option = $("#objects-list option:selected");              // Selected object in objects list
         $item.insertBefore($item.prev());                              // Change order in viewport
         $option.insertBefore($option.prev());                          // Change order in objects list
         // Show success message
         $("#info").html(`Game object <span class="debug-text">${$option.text()}</span> is sent backward`);
      }
   }
   // Bring game object forward in viewport or move it down in objects list
   moveSelectedDown() {
      let $item = $("#editor-viewport").find(`.game-item-select`);      // Find selected object
      if ($item.html() != undefined) {                                  // Check if selectionis valid
         let $option = $("#objects-list option:selected");              // Selected object in objects list
         $item.insertAfter($item.next());                               // Change order in viewport
         $option.insertAfter($option.next());                           // Change order in objects list
         // Show success message
         $("#info").html(`Game object <span class="debug-text">${$option.text()}</span> is brought forward`);
      }
   }
   // Send game object to back in viewport or move it to top in objects list
   moveSelectedTop() {
      let $item = $("#editor-viewport").find(`.game-item-select`);      // Find selected object
      if ($item.html() != undefined) {                                  // Check if selectionis valid
         let $option = $("#objects-list option:selected");              // Selected object in objects list
         $item.prependTo($("#editor-viewport"));                        // Change order in viewport
         $option.prependTo($("#objects-list"));                         // Change order in objects list
         // Show success message
         $("#info").html(`Game object <span class="debug-text">${$option.text()}</span> is sent to back`);
      }
   }
   // Bring game object to front in viewport or move it to top in objects list
   moveSelectedBottom() {
      let $item = $("#editor-viewport").find(`.game-item-select`);      // Find selected object
      if ($item.html() != undefined) {                                  // Check if selectionis valid
         let $option = $("#objects-list option:selected");              // Selected object in objects list
         $item.appendTo($("#editor-viewport"));                         // Change order in viewport
         $option.appendTo($("#objects-list"));                          // Change order in objects list
         // Show success message
         $("#info").html(`Game object <span class="debug-text">${$option.text()}</span> is brought to front`);
      }
   }
}

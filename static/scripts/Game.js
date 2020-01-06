/**
 @copyright: Copyright (C) 2019  Eser Kokturk. All Rights Reserved.
 */
'use strict';

import WorldController from './WorldController.js';
import ContactListener from './ContactListener.js';
import Entity from './Entity.js'
// import {default as Keyframes} from './lib/jquery.keyframes.js'



var SECONDS_AS_MS      = 1000;   
var TARGET_FPS         = 60;
var TARGET_MS_PER_TICK = SECONDS_AS_MS / TARGET_FPS;
var UPDATE_MIN_MS      = 2000;

var gameInstance = null;

export default class Game {

//  ====================================== GAME SINGLETON ======================================
    constructor(userID) {
        if(gameInstance === null){
            gameInstance = this;
            // Game settings as private member variables
            let my = this.__private__ = {
                userID: userID,                                             // User ID
                gameRunning: true,                                          // Checks if game is going on
                gameWon: false,                                             // Checks if game has won
                lastAmmoDelay:{                                             // Delay before being defeated after last ammo
                                counter: 0,                                 // Counter starts after last ammo is used
                                delay: 7                                    // Stops the game when delay is reached
                              },                                         
                lastFrame: new Date().getTime(),                            // Current time for delta time
                ctrl: new WorldController($('#game-viewport')),             // World controller
                catapult: {                                                 // Game catapult
                            $view: null,                                    // Jquery object
                            entity: null                                    // Entity object
                          },
                entities: [],                                               // All entities in the game
                levelData:[],                                               // Data of the level
                ammo: {                                                     // Game ammo
                            max: 0,                                         // Maximum ammo
                            current: 0                                      // Current ammo
                      },
                targets: {                                                  // Game targets
                            max: 0,                                         // Maximum targets
                            current: 0                                      // Current targets
                        },
                attack: {
                            state: false,                                   // Current attack state
                            counterIncrease: true,                          // Power multiplier counter
                            power: 0                                        // Power multiplier
                        },
            }
        }
        return gameInstance;                                                // Game singleton instance
    }

    // Return game singleton instance
    static getInstance() {
        return gameInstance;
    }
    // Delete game singleton instance
    static destroyInstance(){
        gameInstance = null;
    }

//  =========================================================================================
    // Update game data for each frame
    update( dt ) {
        let my = this.__private__;
        if(my.gameRunning){                                                                         // Check if game is running
            my.ctrl.update(dt);                                                                     // Update world controller
            this.setPowerMultiplier(1.0, 4.0, 0.04)                                                 // Update projectile power
        }
    }
    // Render game data for each frame
    render( dt ) {
        let my = this.__private__;                                                                  // Private members
        if(my.gameRunning){
            my.targets.current = my.targets.max;                                                    // Reinitialize targets
            for(var i=0; i<my.entities.length; i++)                                                 // Render game entities
            {
                my.entities[i].run();                                                               // Update and render entities
                if(my.entities[i].gameData.type == "target" && my.entities[i].gameData.isDestoyed)  // Count available targets
                    my.targets.current -= 1;
            }
            $("#target-count").html(my.targets.current);                                            // Print target count to GUI
            $("#ammo-count").html(my.ammo.current);                                                 // Print ammo count to GUI

            if(my.targets.current == 0)                                     // Stop the game after targets are destroyed
            {
                my.gameRunning = false;                                     // Stop game
                my.gameWon = true;                                          // Set user as victorious
                this.createPopUp();                                         // Show popup menu
            }
            else if(my.ammo.current <= 0 && my.targets.current > 0)         // When user is out of ammo
            {
                if(my.lastAmmoDelay.counter< my.lastAmmoDelay.delay)        // Stop the game when delay is reached
                    my.lastAmmoDelay.counter += dt;
                else{
                    my.gameRunning = false;                                 // Stop game
                    this.createPopUp();                                     // Show popup menu
                }
            }
        }
    }

    // Start game
    run(levelName) {
        let my = this.__private__;
        this.loadLevel(levelName);                     // Load level
        this.init();                                   // Initialize game
    }
    

    // Initialize game inputs
    init(){
        let my = this.__private__;
        let catapultPos;
        let $viewport = $("#game-viewport");
        this.listener = new ContactListener(my.ctrl.model);
        // Create game cursor
        let $target = $(`<div id="catapult-cursor" class="cursor-target"><div class="cursor-target-power"></div>`)       
        $target.appendTo($viewport);                                                            // Add game cursor to game viewport
        $viewport.on("mousemove", (e) => {                                                      // Move cursor with mouse
            var relX = e.pageX - $("#game-viewport").position().left;                           // Get cusor positions
            var relY = e.pageY - $("#game-viewport").position().top;                            
            if(my.catapult.$view !== null)
                catapultPos = my.catapult.$view.position().left + my.catapult.$view.width();    // Get catapults top right corner
            if(relX < catapultPos)                                                              // Limit cursor target to front of catapult
                relX = catapultPos;
            $target.css("top",`${relY-25}px`).css("left",`${relX-25}px`);                       // Set cursor element
        });
        $viewport.on("mousedown", e=> {
            if(!my.attack.state && my.gameRunning)                                              // Check if game state is valid
            {
                my.catapult.$view.resetKeyframe()                                               // reset catapult animation
                if(my.ammo.current > 0)                                                         // Only attack when you have ammo
                    my.attack.state = true;
            }
        });
        $viewport.on("mouseup", e=> {
            if(my.attack.state && my.gameRunning)                                               // Check if game state is valid
            {
                if(my.ammo.current > 0){                                                        // Only attack when you have ammo
                    // Shoot a projectile towards a cursor
                    my.catapult.entity.playAnimation(my.levelData.name,0.7,"",this.spawnProjectile(e, 400))
                }
            }
        });
    }

    // Render single frame
    oneFrame() {
        if(gameInstance){
            let my = this.__private__;                                      // Private members
            let tm = new Date().getTime();                                  // Get current time
            window.requestAnimationFrame( () =>{this.oneFrame()} );         // Go to next frame
            let dt = (tm - my.lastFrame) / 1000;                            // Set delta time
            this.update( dt );                                              // Update game
            this.render( dt );                                              // Render game
            my.lastFrame = tm;                                              // Set frame time
        }
    }

    // Load a certain level
    loadLevel(levelName){
        let my = this.__private__;   
        let request = {"userid": my.userID,"name":levelName,"datatype": "level"};       // Server post request 
        let requestSerial = $.param(request);                                           // Serialize request
        $.post('./server/load/', requestSerial).then(data => {
            data = JSON.parse(data);                                                    // Convert data into JSON format
            if(data.error == "0")
            {
                my.levelData={                                                          // Level data
                    name : data.name,
                    ammo : data.payload.ammo,
                    star1 : data.payload.score.star1,
                    star2 : data.payload.score.star2,
                    star3 : data.payload.score.star3,
                }
                my.ammo.current = data.payload.ammo;
                my.ammo.max = data.payload.ammo;
                $("#game-viewport").css("background-image", `url(${data.payload.background})`)
                if(data.payload.objects != null && data.payload.objects.length != 0){   // Check if there are objects in level
                    for(let i=0; i<data.payload.objects.length;i++){                    // For every object in the list
                        let obj = data.payload.objects[i];                              // Object data
                        let entity = new Entity(my.ctrl, obj);                          // Create a entity with box2d body
                        my.entities.push(entity);                                       // Insert it to the array
                        if(obj.entity.type == "target"){                                // If created entity is a target
                            if(obj.entity.crop != 0 ){
                                entity.setAnimation(my.levelData.name)                  // Create an animation for it
                                entity.playAnimation(my.levelData.name,0.7)             // Play that animation on loop
                            }
                            my.targets.current++;                                       // Increase target count
                            my.targets.max++;
                        }
                        else if(obj.entity.type == "catapult"){                         // If created entity is a catapult type
                            my.catapult.entity = entity;                                // Set is as member
                            entity.$view.css("z-index",3);                              // Bring it to front
                            my.catapult.$view = entity.$view;
                            entity.setAnimation(my.levelData.name, my.levelData.name+"_catapult-anim")
                        }
                    }
                }
                this.oneFrame();
            }
        });
    }

// =================================== GAME FUNCTIONALITY ================================================
    
    //__________________________END GAME POPUP WINDOW____________________________________

    // Create a popup menu which will appear at the end of the level
    createPopUp(){
        let my = this.__private__;
        let message = ""
        let cls =""
        if(my.gameWon){                                                 // Victory Message
            message = "YOU ARE VICTORIOUS!"
            cls = "game-popup-victory";
        }
        else{                                                           // Defeat Message
            message = "YOU ARE DEFEATED!"
            cls = "game-popup-victory";
        }
        let popUp = $(`<div class="game-popup-bg"><div class="game-popup ${cls}">
                            <div class="game-title-xlg">${message}</div>
                            <div class="flx flx-row">${this.calculateScore()}</div>   
                    <div><div>`);

        $("#game-viewport").append(popUp);
    }

    // Show stars depending on the players progress with respect to level parameters
    calculateScore(){
        let my = this.__private__;
        let stars = { star1:"",star2:"",star3:""};
        if(my.targets.current > 0)                                                                      // Defeat no stars
            stars = { star1:"game-star-lose",star2:"game-star-lose",star3:"game-star-lose"};
        else{
            if(my.ammo.current  >= my.levelData.star3)                                                  // 3 Star Victory
                stars = { star1:"game-star-win",star2:"game-star-win",star3:"game-star-win"}
            else if(my.ammo.current  >= my.levelData.star2 )                                            // 2 Star Victory
                stars = { star1:"game-star-win",star2:"game-star-win",star3:"game-star-lose"}
            else if(my.ammo.current >= my.levelData.star1 )                                             // 1 Star Victory
                stars = { star1:"game-star-win",star2:"game-star-lose",star3:"game-star-lose"}
            else                                                                                        // For errors related to level setting
                stars = { star1:"game-star-lose",star2:"game-star-lose",star3:"game-star-lose"};

        }
        // Create DOM element
        let starsElement = `<div class="game-star-popup ${stars.star1}"></div>
                            <div class="game-star-popup ${stars.star2}"></div>
                            <div class="game-star-popup ${stars.star3}"></div>`;
        return starsElement;
    }
    //__________________________________________________________________________________

    // Change power output of the projectile while mouse is being pressed
    setPowerMultiplier(min, max, interval){
        let my = this.__private__;
        if(my.attack.state)
        {
            if(my.attack.power >= max)                      // Check if maximum multiplier is reached
                my.attack.counterIncrease = false;          // Reverse value
            else if(my.attack.power <= min)                 // Check if minimum multiplier is reached
                my.attack.counterIncrease = true;           // Reverse value

            if(my.attack.counterIncrease)                   // Increment or decriment accordingly
                my.attack.power += interval;
            else
                my.attack.power -= interval;
            // Set cursor power multiplier visual
            $(".cursor-target-power").css("clip-path",`inset(${50-(50*my.attack.power/max)}px 0px 0px 0px)`); 
        }
        else
            $(".cursor-target-power").css("clip-path",`inset(50px 0px 0px 0px)`); // Reset cursor power multiplier visual
    }

    //
    spawnProjectile(event, delay){
        let my = this.__private__;
        let obj = this.setProjectile();                                                           // Create projectile data
        var relX = event.pageX - $("#game-viewport").offset().left;                               // Get cursor X position
        var relY = event.pageY - $("#game-viewport").offset().top;                                // Get cursor Y position
        let catapultPos = my.catapult.$view.position().left + my.catapult.$view.width();
        if(relX < catapultPos)
            relX = catapultPos;
        my.ammo.current --;                                                                       // Decrese ammo count  
        setTimeout(() => {
            let entity = new Entity(my.ctrl, obj);                                                // Create projectile entity
            let degree = Math.atan((( 720 - relY ) - ( 720 - my.catapult.$view.position().top ))  // Calculate throw angle
                        / ( relX - catapultPos ));
            entity.applyImpulse(degree, 5000000 * my.attack.power);                               // Add Impultse force
            entity.applyTorque(-1000000000);
            my.entities.push(entity);                                                             // Add entity to the array
            my.attack.power = 0;
            my.attack.state = false;
        }, delay);
    }

    // Projectile parameters
    setProjectile(){
        let my = this.__private__;
        let obj = {
            pos:{
                    x: my.catapult.$view.position().left + my.catapult.$view.width(),
                    y: my.catapult.$view.position().top
                },
            "entity": {
                    "name": `projectile${my.ammo.max-my.ammo.current}`,
                    "type": "projectile",
                    "height": 50,
                    "width": 50,
                    "texture": "./static/images/stone_1.png",
                    "shape": "circle",
                    "crop": 0,
                    "friction": 0.4,
                    "mass": 50,
                    "restitution": 0,
                    "hp": 1
                }
        }
        return obj;
    }


}



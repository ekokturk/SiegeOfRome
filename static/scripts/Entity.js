
'use strict';

import {physics as Physics} from './lib/Physics.js';
import RigidBody from './RigidBody.js';

/*
 * Entity Controller
 */
export default class Entity {

    constructor( worldCtrl, data) {
        this.world = worldCtrl;                                 // World controller
        this.data = data;                                       // Entity data from the server
        this.animationName = "";                                // Animation name
        this.$view = this.createElement();                      // JQUery element
    	this.model = this.createModel();                        // Box2D model
        // Data which is important to the gameplay 
        this.gameData = {
            id: this.data.id,
            name: this.data.entity.name,
            type: this.data.entity.type,
            hp: this.data.entity.hp,
            destroy:false,
            isDestoyed: false
        }
        this.model.SetUserData(this.gameData);
    }
    // Add impulse for to entity
    applyImpulse( degrees, power ) {
        this.model.ApplyImpulse( new Physics.Vec2((1)  * power  * Math.cos(degrees),
                                                  (-1) * power  * Math.sin(degrees)), 
                                this.model.GetPosition());
    }
    // Add torque to the entity
    applyTorque(power)
    {
        this.model.ApplyTorque(power);
    }
    // Render and update object if it is alive
    run(){
        if(!this.gameData.isDestoyed){
            this.update();
            this.render();
        }
    }
    // Update object data
    update( opts = undefined ) {
        this.gameData = this.model.GetUserData();
    }

    // Render element
    render() {

        if(!this.gameData.destroy){
            let my = this.data.entity;
            let p = this.model.GetPosition();                                                   // Get box2D position
            let a = this.model.GetAngle();                                                      // Get box2D angle
            this.$view.css("left", `${p.x * Physics.WORLD_SCALE - my.width  / 2}px`);           // Set element X position
            this.$view.css("top",  `${p.y * Physics.WORLD_SCALE - my.height / 2}px`);           // Set element Y position
            this.$view.css("transform", `rotate(${a*180/3.14}deg)`);                            // Set element Rotation
        }
        else{
            this.deathAnimation();
            this.gameData.isDestoyed = true;
        }
    }
//  ================================== ANIMATION ========================================
    // Set animation for the entity
    setAnimation(levelName,entityName=`entity${this.data.id}`){                             
        this.animationName = entityName                                                 // Set animation name as member variable
        $.keyframe.define([{                                                            // Dynamically create keyframe animation
            name: `${levelName}_${entityName}_anim`,
            '100%': {'background-position': `-${this.data.entity.crop}px`} 
        }]);
    }
    // Play already set keyframe animation
    playAnimation(levelName, duration, loop="infinite", completeFN=null){
        if(this.animationName != ""){
            let steps = this.data.entity.crop / this.data.entity.width;                             // Get sprite count
            this.$view.playKeyframe(                                                                // Play animation
                `${levelName}_${this.animationName}_anim ${duration}s steps(${steps}) ${loop}`,
                null
            );
        }
    }
    // Default death animation which turns entitiy into dust
    deathAnimation(){
        let $entity = $(`[data-name='${this.data.entity.name}']`);
        $entity.pauseKeyframe();
        $entity.resetKeyframe();
        $entity.css("background-image","url('./static/images/smoke_effect.png')")
               .css("background-size","100% 100%")
               .animate({
                            opacity: 0.0,
                            top: `${this.data.pos.y-15}px`
                        }, 2000, 
                        ()=>{$(`[data-name='${this.data.entity.name}']`).remove()} );
    }

    
//  =====================================================================================

    // Create DOM element
    createElement(){                                                                                    
        let my = this.data.entity;
        let $element = $(`<div data-name="${my.name}" data-type="${my.type}"></div>`);                // Create element with data attributes
        $element.appendTo(this.world.$view);                                                          // Add it to viewport
        $element.css("background-image", `url(${my.texture})`);                                       // Set texture
        $element.css("background-size", `${my.crop == 0 ? my.width : my.crop}px ${my.height}px`);     // Set spritesheet crop
        $element.css("height", `${this.data.entity.height}`);                                         // Set height
        $element.css("width", `${this.data.entity.width}px`);                                         // Set width
        $element.css("position", `absolute`);                                                         // Set display type
        return $element;
    }

    createModel() {  
        let my = this.data.entity;
        let rigid = new RigidBody()
            .location(  (this.data.pos.x + my.width / 2) /  Physics.WORLD_SCALE,          // X position
                        (this.data.pos.y + my.height / 2) / Physics.WORLD_SCALE )         // Y position
            .fixture(    my.width * my.height * my.mass,                                  // Density
                         my.friction,                                                     // Friction
                         my.restitution                                                   // Restitution
                    );
        if(my.shape == "circle")
            rigid.dimensionCircle(my.width / 2 /  Physics.WORLD_SCALE)
        else
            rigid.dimensionBox( my.width / 2 /  Physics.WORLD_SCALE,                      // Width
                        my.height / 2 / Physics.WORLD_SCALE )                             // Height
        if (my.type == "static" )                                                         // Make object static if type is static
            rigid.staticBody();

        if(my.type == "ghost" || my.type == "catapult")                                   // Disable collision on catapult and ghost type
            rigid.deactivate();

        rigid.create( this.world.model );                                                 // create body

        return rigid.model;
    }
}




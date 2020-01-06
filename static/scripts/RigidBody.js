/**
 @copyright: Copyright (C) 2019  Eser Kokturk. All Rights Reserved.
 */

import {physics as Physics} from './lib/Physics.js'

export default class RigidBody {

    constructor(width, height){
        
        this.model;                                             // Rigidbody
        this.bodyDefn = new Physics.BodyDef;                    // Body Definition
        this.fixtureDefn = new Physics.FixtureDef;              // Fixture
        this.fixtureDefn.shape = new Physics.PolygonShape;      // Shape
        this.bodyDefn.type = Physics.Body.b2_dynamicBody;       // Body Type
    }
    // Location of the rigidbody
    location( x, y){
        this.bodyDefn.position.x = x ;
        this.bodyDefn.position.y = y ;
        return this;        
    }
    // Set it as a box
    dimensionBox( w, h ){
        this.fixtureDefn.shape.SetAsBox( w , h );
        return this;
    }
    // Set it as a circlt
    dimensionCircle( r ){
        this.fixtureDefn.shape = new Physics.CircleShape(r);      
        return this;
    }
    // Set fixture
    fixture( density, friction, bounciness){
        this.fixtureDefn.density = density;      // Density = area * mass
        this.fixtureDefn.friction = friction;     // 1 = sticky, 0 = slippery
        this.fixtureDefn.restitution = bounciness;  // 1 = very bouncy...
        return this;
    }
    // Set it to static
    staticBody(){
        this.bodyDefn.type = Physics.Body.b2_staticBody;
        return this;    
    }
    // Set it to dynamic
    dynamicBody(){
        this.bodyDefn.type = Physics.Body.b2_dynamicBody; 
        return this;    
    }
    // Disable collision on the body
    deactivate(){
        this.bodyDefn.active = false;  
        return this;    
    }
    create(worldModel){
        // Actually create the rigid body
        this.model = worldModel.CreateBody( this.bodyDefn ); 
        this.model.CreateFixture( this.fixtureDefn );
    }
}
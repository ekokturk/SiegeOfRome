/*
 * Contact Listener Controller Class
 *
 * Manage collisions between RigidBodies in a box2D world
 *
 * Copyright 2014-2017, Kibble Games. All Rights Reserved.
 * 
 *  @copyright: Copyright (C) 2019  Eser Kokturk. All Rights Reserved.
 */

'use strict';


import {physics as Physics} from './lib/Physics.js'

export default class ContactListener {
    
    constructor( theWorld ) {        

        this.m_listener = new Physics.Listener;
        
        this.m_listener.PreSolve = this.preSolve;

        this.m_listener.BeginContact = this.beginContact;
        this.m_listener.EndContact = this.endContact;
        
        this.m_listener.PostSolve = this.postSolve;

        theWorld.SetContactListener( this.m_listener );
    }
    
    // This is called after collision detection, but before collision resolution.
    // This gives you a chance to disable the contact based on the current configuration.
    preSolve( contact, oldManifold ) {


    }

    // This is called when two fixtures begin to overlap.
    beginContact( contact ) {
        // let bodyA = contact.GetFixtureA().GetBody();
        // let bodyB = contact.GetFixtureB().GetBody();

        // let thingA = bodyA.GetUserData();         
        // let thingB = bodyB.GetUserData();

        // if ((thingA == null) || (thingB == null) || (bodyA.isActive == false) || (bodyB.isActive == false))
        //     return;

    }

    // This is called when two fixtures cease to overlap.
    endContact( contact ) {


    }
    
    // The post solve event is where you can gather collision impulse results. If you don�t care about the impulses,
    // you should probably just implement the pre-solve event.
    postSolve( contact, impulse ) {


        let bodyA = contact.GetFixtureA().GetBody();                            // Contact body A
        let bodyB = contact.GetFixtureB().GetBody();                            // Contact body B

        let thingA = bodyA.GetUserData();         
        let thingB = bodyB.GetUserData();

        // Check if object is active or null
        if ((thingA == null) || (thingB == null) || (bodyA.isActive == false) || (bodyB.isActive == false))
            return;

        // Decrease health of the collided object
        if(thingB.type == "projectile" && thingA.type == "target" && thingA.hp > 0){
            thingA.hp = thingA.hp-1;
            bodyA.SetUserData(thingA);
        }
        let dataA = bodyA.GetUserData();
        let dateB = bodyB.GetUserData();

        // If object is dead disable collisions on it
        if(dataA.hp == 0){
            thingA.destroy=true;
            bodyA.SetUserData(thingA);
            bodyA.SetActive(false);
        }
 
    }    
}
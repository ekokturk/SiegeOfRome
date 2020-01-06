/**
 @copyright: Copyright (C) 2019  Eser Kokturk. All Rights Reserved.
 */


import {physics as Physics} from './lib/Physics.js'
import RigidBody from './RigidBody.js'


const WORLD = {
    TIMESTEP: 1/ 60,
    STEP: {
        VELOCITY: 10,
        POSITION: 10,
    },
    WALL: {
        DENSITY: 100,
        FRICTION: 0.5,
        RESTITUTION: 0.5
    },
}

export default class WorldController {
    constructor( $theView ){
        this.model = new Physics.World(new Physics.Vec2(0, Physics.GRAVITY))    // Game world
        this.$view = $theView;                                                  // Canvas element
        this.dtRemaining = 0;                                                   

        let view = {
            width: this.$view.width(),
            height:this.$view.height()
        }
        this._createBoundaries(view.width, view.height);
    }

    update(deltaT){
            this.model.Step(WORLD.TIMESTEP, WORLD.STEP.VELOCITY, WORLD.STEP.POSITION);
            this.model.ClearForces();	
    }

    render(deltaT){
    }

    _createBoundaries(width, height){
        // Left right and bottom wall from width height as screen dimension
        const UNIT = 0.01;
        const MID = { 
            x: width / 2 / Physics.WORLD_SCALE,      // Screen to world 
            y: height / 2 / Physics.WORLD_SCALE      // Screen to world
        };
        const MAX = {
             x: width / Physics.WORLD_SCALE,
             y: height / Physics.WORLD_SCALE
        };

        this._createWall( MID.x, MAX.y, MAX.x, UNIT );       // Ground (x, y, w, h)
        this._createWall( 0,     MID.y, UNIT,  MAX.x );      // left wall
        this._createWall( MAX.x, MID.y, UNIT,  MAX.y );      // right wall
    }

    // Create world boundaries
    _createWall(x, y, w, h){
        return new RigidBody()  
            .location(x, y)                                                             
            .dimensionBox(w, h)
            .fixture(WORLD.WALL.DENSITY, WORLD.WALL.FRICTION, WORLD.WALL.RESTITUTION)
            .staticBody()
            .create(this.model);
    }

}


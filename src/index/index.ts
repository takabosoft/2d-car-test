/**
 * Development Build: npx webpack -w
 * Development Server: npx live-server docs
 * Development Server(HTTPS): npx live-server docs --https=ssl/https.js
 * Release Build: npx webpack --mode=production
 * URL: http://localhost:8080/
 */

import { World, Testbed, Box, Vec2, Body, PolygonShape, RevoluteJoint, Edge, Chain } from "planck/with-testbed";
import { Car } from "../common/car/car";
import { ControlState } from "../common/car/controlState";




class HumanPlayer {
    readonly controlState = new ControlState();

    onKeyDown(key: string): void {
        switch (key) {
            case "W": this.controlState.accel = true; break;
            case "S": this.controlState.back = true; break;
            case "A": this.controlState.left = true; break;
            case "D": this.controlState.right = true; break;
        }
    }

    onKeyUp(key: string): void {
        switch (key) {
            case "W": this.controlState.accel = false; break;
            case "S": this.controlState.back = false; break;
            case "A": this.controlState.left = false; break;
            case "D": this.controlState.right = false; break;
        }
    }
}

$(() => {
    console.log("OK");

    // Construct a world object, which will hold and simulate the rigid bodies.
    const world = new World({
        gravity: new Vec2(0, 0),
    });


    // Call the body factory which allocates memory for the ground body
    // from a pool and creates the ground box shape (also from a pool).
    // The body is also added to the world.
    /*const groundBody = world.createBody({
        position: new Vec2(0, -10),
    });

    // Add the ground fixture to the ground body.
    groundBody.createFixture({
        shape: new Box(20.0, 1.0),
        density: 0.0,
        friction: 0.9,
    });*/

    //const boundaryBody = world.createBody();

    const boundaryChain = world.createBody();
    boundaryChain.createFixture(new Chain([
        new Vec2(-10, -5), // 左下
        new Vec2( 0, -6),
        new Vec2(10, -5),
        new Vec2(10, 5),
        new Vec2(-10, 5),
        new Vec2(-10, -5),
    ].map(v => v.mul(15))), { friction: 1.0 });

    const testPlayer = new HumanPlayer();

    //const tire = new Tire(world, testPlayer.controlState);

    const car = new Car(world, testPlayer.controlState);
    car.reset(new Vec2(0, 0), Math.PI / 2);

    const testbed = Testbed.mount();
    testbed.x = 0;
    testbed.y = 0;
    testbed.width = 300;
    testbed.height = 300;

    testbed.start(world);
    testbed.keydown = (keyCode, label) => {
        //console.log(keyCode);
        //const force = new Vec2(0, 5000);  // 上方向に500の力
        //rectBody.applyForce(force, rectBody.getWorldCenter());  // 物体に力を加える*/
        testPlayer.onKeyDown(label);

        if (label == " ") {
            console.log("TEST");
            car.reset(new Vec2(0, 10), Math.PI / 2);
            world.clearForces();
        }
    };
    testbed.keyup = (keyCode, label) => {
        testPlayer.onKeyUp(label);
    };

    let a = 0;
    testbed.step = (deltaTimeMS, totalTimeMS) => {
        //console.log("O?", dt, t)
        car.update();
        //car.reset(new Vec2(0, 10), a);
        //a += 0.1;
    };
})


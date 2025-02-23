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
import { TestCourse } from "../common/course/course";




class HumanPlayer {
    readonly controlState = new ControlState();

    onKeyDown(key: string): void {
        switch (key) {
            case "W": this.controlState.accel = true; break;
            case "S": this.controlState.brake = true; break;
            case "X": this.controlState.back = true; break;
            case "A": this.controlState.left = true; break;
            case "D": this.controlState.right = true; break;
        }
    }

    onKeyUp(key: string): void {
        switch (key) {
            case "W": this.controlState.accel = false; break;
            case "S": this.controlState.brake = false; break;
            case "X": this.controlState.back = false; break;
            case "A": this.controlState.left = false; break;
            case "D": this.controlState.right = false; break;
        }
    }
}

$(() => {
    console.log("OK");

    const world = new World({
        gravity: new Vec2(0, 0),
    });

    const testCourse = new TestCourse(world);

    const testPlayer = new HumanPlayer();

    //const tire = new Tire(world, testPlayer.controlState);

    const car = new Car(world, testPlayer.controlState);
    car.reset(testCourse.startPos, Math.PI / 2);

    const testbed = Testbed.mount();
    testbed.x = -testCourse.size.x / 2;
    testbed.y = -testCourse.size.y / 2;
    testbed.width = testCourse.size.x;
    testbed.height = testCourse.size.y;

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


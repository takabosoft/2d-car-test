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
    private readonly keyState = new Set<string>();

    private get calcSteeringRatio() {
        return 0 + (this.keyState.has("A") ? -1 : 0) + (this.keyState.has("D") ? +1 : 0);
    }

    onKeyDown(key: string): void {
        switch (key) {
            case "W": this.controlState.accel = true; break;
            case "S": this.controlState.brake = true; break;
            case "X": this.controlState.back = true; break;
            case "A":
            case "D":
                this.keyState.add(key);
                this.controlState.steeringRatio = this.calcSteeringRatio;
                break;
        }
    }

    onKeyUp(key: string): void {
        switch (key) {
            case "W": this.controlState.accel = false; break;
            case "S": this.controlState.brake = false; break;
            case "X": this.controlState.back = false; break;
            case "A":
            case "D":
                this.keyState.delete(key);
                this.controlState.steeringRatio = this.calcSteeringRatio;
                break;
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

    const car = new Car(world, testPlayer.controlState);
    car.reset(testCourse.startPos, Math.PI / 2);

    //const car2 = new Car(world, new ControlState());
    //car2.reset(testCourse.startPos, Math.PI / 2);

    const testbed = Testbed.mount();
    testbed.x = -testCourse.size.x / 2;
    testbed.y = -testCourse.size.y / 2;
    testbed.width = testCourse.size.x;
    testbed.height = testCourse.size.y;

    testbed.start(world);
    testbed.keydown = (keyCode, label) => {
        testPlayer.onKeyDown(label);

        if (label == " ") {
            console.log("TEST");
            car.reset(testCourse.startPos, Math.PI / 2);
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


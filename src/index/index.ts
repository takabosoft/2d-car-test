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
import { TestCourse } from "../common/courses/course";
import { SceneController } from "./scenes/sceneController";
import { GameScene } from "./scenes/game/gameScene";






$(() => new PageController().start());
    //console.log("OK");

    /*const world = new World({
        gravity: new Vec2(0, 0),
    });*/

    //const testCourse = new TestCourse(world);
    //const testPlayer = new HumanDriver();

    //const car = new Car(world, testPlayer.controlState);
    //car.reset(testCourse.startPos, Math.PI / 2);

    //const car2 = new Car(world, new ControlState());
    //car2.reset(testCourse.startPos, Math.PI / 2);

    /*const testbed = Testbed.mount();
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
    };*/
//})

class PageController {
    readonly sceneController = new SceneController();

    start() {
        $(document.body).append(this.sceneController.element);
        this.sceneController.changeScene(new GameScene(this.sceneController));
    }
}

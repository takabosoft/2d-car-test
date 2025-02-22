/**
 * Development Build: npx webpack -w
 * Development Server: npx live-server docs
 * Development Server(HTTPS): npx live-server docs --https=ssl/https.js
 * Release Build: npx webpack --mode=production
 */

import { World, Testbed, Box, Vec2 } from 'planck/with-testbed';


$(() => {
    console.log("OK");

    // Construct a world object, which will hold and simulate the rigid bodies.
    const world = new World({
        gravity: new Vec2(0, 0),
    });

    // Call the body factory which allocates memory for the ground body
    // from a pool and creates the ground box shape (also from a pool).
    // The body is also added to the world.
    const groundBody = world.createBody({
        position: new Vec2(0, 10),
    });

    // Add the ground fixture to the ground body.
    groundBody.createFixture({
        shape: new Box(20.0, 1.0), 
        density: 0.0,
        friction: 0.9,
    });


    // Define the dynamic body. We set its position and call the body factory.
    const rectBody = world.createDynamicBody({
        position: new Vec2(0, 0),
        angle: Math.PI / 5,
        // 線形減衰
        linearDamping: 1.5,
        // 角速度減衰
        angularDamping: 1
    });

    // Add the shape to the body.
    rectBody.createFixture({
        // 形状
        shape: new Box(1.0, 1.0),
        // 密度？
        density: 1.0,
        // 摩擦係数
        friction: 0.3,
        // 跳ね返り
        restitution: 0.3,
    });

    const testbed = Testbed.mount();
    testbed.start(world);
    testbed.keydown = (keyCode, label) => {
        if (label == " ") {
            console.log("OK")
            const force = new Vec2(0, 5000);  // 上方向に500の力
            rectBody.applyForce(force, rectBody.getWorldCenter());  // 物体に力を加える
        }
    };
})


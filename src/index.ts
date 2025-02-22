/**
 * Development Build: npx webpack -w
 * Development Server: npx live-server docs
 * Development Server(HTTPS): npx live-server docs --https=ssl/https.js
 * Release Build: npx webpack --mode=production
 */

import { World, Testbed, Box } from 'planck/with-testbed';


$(() => {
    console.log("OK");

    // Construct a world object, which will hold and simulate the rigid bodies.
    var world = new World({
        gravity: { x: 0.0, y: -10.0 },
    });

    {
        // Define the ground body.
        var groundBodyDef = {
            position: { x: 0.0, y: -10.0 },
        };

        // Call the body factory which allocates memory for the ground body
        // from a pool and creates the ground box shape (also from a pool).
        // The body is also added to the world.
        var groundBody = world.createBody(groundBodyDef);

        // Define the ground box shape.
        // The extents are the half-widths of the box.
        var groundBox = new Box(50.0, 10.0);

        // Add the ground fixture to the ground body.
        groundBody.createFixture(groundBox, 0.0);
    }

    {
        // Define the dynamic body. We set its position and call the body factory.
        var body = world.createBody({
            type: "dynamic",
            position: { x: 0.0, y: 20.0 },
        });

        // Define another box shape for our dynamic body.
        var dynamicBox = new Box(1.0, 1.0);

        // Add the shape to the body.
        body.createFixture({
            shape: dynamicBox,
            // Set the box density to be non-zero, so it will be dynamic.
            density: 1.0,
            // Override the default friction.
            friction: 0.3,
            restitution: 0.8,
        });
    }

    const testbed = Testbed.mount();
    testbed.start(world);
})


/**
 * Development Build: npx webpack -w
 * Development Server: npx live-server docs
 * Development Server(HTTPS): npx live-server docs --https=ssl/https.js
 * Release Build: npx webpack --mode=production
 */

import { World, Testbed, Box, Vec2, Body } from 'planck/with-testbed';

/**
 * タイヤクラス
 * 参考：https://www.iforce2d.net/b2dtut/top-down-car
 */
class Tire {
    readonly body: Body;

    constructor(world: World) {
        this.body = world.createDynamicBody({
            position: new Vec2(0, 0),
            angle: Math.PI / 5,
            // 線形減衰
            linearDamping: 1.5,
            // 角速度減衰
            angularDamping: 1
        });
    
        this.body.createFixture({
            // 形状
            shape: new Box(0.5, 1.25),
            // 密度 大きと重い
            density: 1.0,
            // 摩擦係数
            friction: 0.0,
            // 跳ね返り
            restitution: 0.0,
        });
    }

    /** 進行方向から見て横方向に掛かっているベクトル */
    get lateralVelocity(): Vec2 {
        const currentRightNormal = this.body.getWorldVector(new Vec2(1, 0));
        const velocity = Vec2.dot(currentRightNormal, this.body.getLinearVelocity());
        return Vec2.mul(velocity, currentRightNormal);
    }

    /** 横方向の力を打ち消す */
    cancelLateralVelocity(): void {
        const impulse = this.lateralVelocity.neg().mul(this.body.getMass());
        this.body.applyLinearImpulse( impulse, this.body.getWorldCenter());
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
    const groundBody = world.createBody({
        position: new Vec2(0, 10),
    });

    // Add the ground fixture to the ground body.
    groundBody.createFixture({
        shape: new Box(20.0, 1.0), 
        density: 0.0,
        friction: 0.9,
    });

    const tire = new Tire(world);

    const testbed = Testbed.mount();
    testbed.start(world);
    testbed.keydown = (keyCode, label) => {
        /*if (label == " ") {
            console.log("OK")
            const force = new Vec2(0, 5000);  // 上方向に500の力
            rectBody.applyForce(force, rectBody.getWorldCenter());  // 物体に力を加える
        }*/
    };
    testbed.step = (deltaTimeMS, totalTimeMS) => {
        //console.log("O?", dt, t)
        tire.cancelLateralVelocity();
    };
})


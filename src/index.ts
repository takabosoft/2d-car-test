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
    private readonly maxForwardSpeed = 100;
    private readonly maxBackwardSpeed = -20;
    private readonly maxDriveForce = 150;

    constructor(world: World, readonly controlState: ControlState) {
        this.body = world.createDynamicBody({
            position: new Vec2(0, 0),
            angle: Math.PI / 5,
            // 線形減衰
            //linearDamping: 1.5,
            // 角速度減衰
            //angularDamping: 1
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

    /** 前方のみのベロシティを取り出し */
    get forwardVelocity(): Vec2 {
        const currentForwardNormal = this.body.getWorldVector(new Vec2(0, 1));
        const velocity = Vec2.dot(currentForwardNormal, this.body.getLinearVelocity());
        return Vec2.mul(velocity, currentForwardNormal);
    }

    private updateFriction() {
        const maxLateralImpulse = 2.5; // 小さくするとすべる

        // 横方向を打ち消す
        let impulse = this.lateralVelocity.neg().mul(this.body.getMass());

        // 横方向の打ち消す力に上限を設けることで横滑りとなる
        if (impulse.length() > maxLateralImpulse) {
            impulse = Vec2.mul(maxLateralImpulse / impulse.length(), impulse); // ベクトルの大きさだけmaxLateralImpulseになる
        }
        this.body.applyLinearImpulse(impulse, this.body.getWorldCenter());

        // 自転も打ち消す
        this.body.applyAngularImpulse(0.1 * this.body.getInertia() * -this.body.getAngularVelocity());

        // 減速
        const currentForwardNormal = this.forwardVelocity;
        const currentForwardSpeed = currentForwardNormal.normalize();
        const dragForceMagnitude = -2 * currentForwardSpeed;
        this.body.applyForce(Vec2.mul(currentForwardNormal, dragForceMagnitude), this.body.getWorldCenter());
    }


    private updateDrive() {
        //find desired speed
        let desiredSpeed = 0;
        if (this.controlState.accel) {
            desiredSpeed = this.maxForwardSpeed;
        } else if (this.controlState.back) {
            desiredSpeed = this.maxBackwardSpeed;
        }

        //find current speed in forward direction
        const currentForwardNormal = this.body.getWorldVector(new Vec2(0, 1));
        const currentSpeed = Vec2.dot(this.forwardVelocity, currentForwardNormal);

        //apply necessary force
        let force = 0;
        if (desiredSpeed > currentSpeed) {
            force = this.maxDriveForce;
        } else if (desiredSpeed < currentSpeed) {
            force = -this.maxDriveForce;
        } else {
            return;
        }
        this.body.applyForce(Vec2.mul(force, currentForwardNormal), this.body.getWorldCenter());
    }

    /** 旋回（トルクを加える） */
    private updateTurn() {
        let desiredTorque = 0;
        if (this.controlState.left) {
            desiredTorque = 15;
        } else if (this.controlState.right) {
            desiredTorque = -15;
        }
        this.body.applyTorque(desiredTorque);
    }

    update(): void {
        this.updateFriction();
        this.updateDrive();
        this.updateTurn();
    }

}

class ControlState {
    accel = false;
    back = false;
    left = false;
    right = false;
}

class TestPlayer {
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
    const groundBody = world.createBody({
        position: new Vec2(0, 10),
    });

    // Add the ground fixture to the ground body.
    groundBody.createFixture({
        shape: new Box(20.0, 1.0),
        density: 0.0,
        friction: 0.9,
    });

    const testPlayer = new TestPlayer();

    const tire = new Tire(world, testPlayer.controlState);

    const testbed = Testbed.mount();
    testbed.start(world);
    testbed.keydown = (keyCode, label) => {
        //console.log(keyCode);
        //const force = new Vec2(0, 5000);  // 上方向に500の力
        //rectBody.applyForce(force, rectBody.getWorldCenter());  // 物体に力を加える*/
        testPlayer.onKeyDown(label);
    };
    testbed.keyup = (keyCode, label) => {
        testPlayer.onKeyUp(label);
    };
    testbed.step = (deltaTimeMS, totalTimeMS) => {
        //console.log("O?", dt, t)
        tire.update();
    };
})


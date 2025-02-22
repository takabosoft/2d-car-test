/**
 * Development Build: npx webpack -w
 * Development Server: npx live-server docs
 * Development Server(HTTPS): npx live-server docs --https=ssl/https.js
 * Release Build: npx webpack --mode=production
 * URL: http://localhost:8080/
 */

import { World, Testbed, Box, Vec2, Body, PolygonShape, RevoluteJoint, Edge, Chain } from 'planck/with-testbed';

/**
 * タイヤクラス
 * 参考：https://www.iforce2d.net/b2dtut/top-down-car
 */
class Tire {
    readonly body: Body;
    private readonly maxForwardSpeed = 250;
    private readonly maxBackwardSpeed = -40;

    joint?: RevoluteJoint;

    /**
     * 
     * @param world 
     * @param maxDriveForce 
     * @param maxLateralImpulse 横滑り打ち消し力上限　小さいとすべる
     */
    constructor(
        world: World,
        private readonly maxDriveForce: number,
        private readonly maxLateralImpulse: number,
    ) {
        this.body = world.createDynamicBody({
            position: new Vec2(0, 0),
            //angle: Math.PI / 5,
        });

        this.body.createFixture({
            // 形状
            shape: new Box(0.5, 1.25),
            // 密度 大きいと重い
            density: 1.0,
            // 摩擦係数
            friction: 0.0,
            // 跳ね返り
            restitution: 0.8,
            //userData
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

    /** 摩擦処理 */
    updateFriction() {
        // 横方向を打ち消す
        let impulse = this.lateralVelocity.neg().mul(this.body.getMass());

        // 横方向の打ち消す力に上限を設けることで横滑りとなる
        if (impulse.length() > this.maxLateralImpulse) {
            impulse = Vec2.mul(this.maxLateralImpulse / impulse.length(), impulse); // ベクトルの大きさだけmaxLateralImpulseになる
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

    /** 前進・後退 */
    updateDrive(controlState: ControlState) {
        //find desired speed
        let desiredSpeed = 0;
        if (controlState.accel) {
            desiredSpeed = this.maxForwardSpeed;
        } else if (controlState.back) {
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

const DEGTORAD = 0.0174532925199432957;
const RADTODEG = 57.295779513082320876;

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
}

function rotateVec2(vec: Vec2, angleRad: number) {
    return new Vec2(
        vec.x * Math.cos(angleRad) - vec.y * Math.sin(angleRad),
        vec.x * Math.sin(angleRad) + vec.y * Math.cos(angleRad));
}

class Car {
    readonly body: Body;
    private tires: Tire[] = [];
    private flJoint: RevoluteJoint;
    private frJoint: RevoluteJoint;

    constructor(world: World, readonly controlState: ControlState) {
        this.body = world.createDynamicBody({
            position: new Vec2(0, 0),
            angularDamping: 6, // 回転摩擦
            
        });

        const shape = new PolygonShape([
            new Vec2(1.5, 0),
            new Vec2(3, 2.5),
            new Vec2(2.8, 5.5),
            new Vec2(1, 10),
            new Vec2(-1, 10),
            new Vec2(-2.8, 5.5),
            new Vec2(-3, 2.5),
            new Vec2(-1.5, 0)
        ]);

        this.body.createFixture({
            shape: shape,
            density: 0.1,
            restitution: 0.8,
        });

        const appendTire = (x: number, y: number, maxDriveForce: number, maxLateralImpulse: number,) => {
            const tire = new Tire(world, maxDriveForce, maxLateralImpulse); // dummy state
            this.tires.push(tire);

            const def = new RevoluteJoint({
                bodyA: this.body,
                enableLimit: true,
                lowerAngle: 0,
                upperAngle: 0,
                bodyB: tire.body,
                localAnchorA: new Vec2(x, y),
                localAnchorB: new Vec2(0, 0),
            });
            const joint = world.createJoint(def)!;
            tire.joint = joint;
            return joint;
        };

        const frontTireMaxDriveForce = 500;
        const frontTireMaxLateralImpulse = 17.5; // 横滑り、旋回能力に影響

        const backTireMaxDriveForce = 300;
        const backTireMaxLateralImpulse = 19.5;

        this.flJoint = appendTire(-3, 8.5, frontTireMaxDriveForce, frontTireMaxLateralImpulse);
        this.frJoint = appendTire(+3, 8.5, frontTireMaxDriveForce, frontTireMaxLateralImpulse);
        appendTire(-3, 0.75, backTireMaxDriveForce, backTireMaxLateralImpulse);
        appendTire(+3, 0.75, backTireMaxDriveForce, backTireMaxLateralImpulse);
    }

    update() {
        this.tires.forEach(t => t.updateFriction());
        this.tires.forEach(t => t.updateDrive(this.controlState));

        // ハンドル操作による前輪タイヤの方向転換を行います。
        // 回転ジョインとの下限上限を使って強制的に変更します。

        //control steering
        const lockAngle = 40 * DEGTORAD;
        const turnSpeedPerSec = 160 * DEGTORAD;//from lock to lock in 0.5 sec
        const turnPerTimeStep = turnSpeedPerSec / 60.0;

        let desiredAngle = 0;
        if (this.controlState.left) {
            desiredAngle = lockAngle;
        } else if (this.controlState.right) {
            desiredAngle = -lockAngle;
        }

        const angleNow = this.flJoint.getJointAngle();
        let angleToTurn = desiredAngle - angleNow;
        angleToTurn = clamp(angleToTurn, -turnPerTimeStep, turnPerTimeStep);

        const newAngle = angleNow + angleToTurn;
        this.flJoint.setLimits(desiredAngle, desiredAngle);
        this.frJoint.setLimits(desiredAngle, desiredAngle);
    }

    /** 位置と角度を初期化します。 */
    reset(pos: Vec2, angleRad: number): void {
        this.body.setTransform(pos, angleRad);

        this.tires.forEach(t => {
            const joint = t.joint!;
            const localAnchorA = joint.getLocalAnchorA();
            const tirePos = rotateVec2(localAnchorA, angleRad).add(pos);
            t.body.setTransform(tirePos, angleRad);
        });
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

    const testPlayer = new TestPlayer();

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


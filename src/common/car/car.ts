import { World, Testbed, Box, Vec2, Body, PolygonShape, RevoluteJoint, Edge, Chain } from "planck/with-testbed";
import { Tire } from "./tire";
import { ControlState } from "./controlState";
import { clamp, degToRad, rotateVec2 } from "../utils/mathUtils";

export class Car {
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
        const lockAngle = 40 * degToRad;
        const turnSpeedPerSec = 160 * degToRad;//from lock to lock in 0.5 sec
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
        this.body.setLinearVelocity(Vec2.zero());
        this.body.setAngularVelocity(0);

        this.tires.forEach(t => {
            const joint = t.joint!;
            const localAnchorA = joint.getLocalAnchorA();
            const tirePos = rotateVec2(localAnchorA, angleRad).add(pos);
            t.body.setTransform(tirePos, angleRad);
            t.body.setLinearVelocity(Vec2.zero());
            t.body.setAngularVelocity(0);
        });
    }
}
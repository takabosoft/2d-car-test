import { World, Testbed, Box, Vec2, Body, PolygonShape, RevoluteJoint, Edge, Chain } from "planck/with-testbed";
import { Tire } from "./tire";
import { ControlState } from "./controlState";
import { clamp, degToRad, rotateVec2 } from "../utils/mathUtils";
import { pixelToSim } from "../env";

export class Car {
    readonly body: Body;
    private tires: Tire[] = [];
    private flJoint: RevoluteJoint;
    private frJoint: RevoluteJoint;

    constructor(world: World, readonly controlState: ControlState) {
        this.body = world.createDynamicBody({
            position: new Vec2(0, 0),
            linearDamping: 0,
            angularDamping: 0, // 回転摩擦
        });

        const maxForwardSpeed = 10;
        const maxBackwardSpeed = -0.5;

        const frontTireForwardDriveForce = 0.02;
        const frontTireBackwardDriveForce = 0.01;
        //const frontTireMaxLateralImpulse = 40.5 * 300; // 横滑り、旋回能力に影響

        const backTireForwardDriveForce = 0.00;
        const backTireBackwardDriveForce = 0.00;
        //const backTireMaxLateralImpulse = 40 * 300;

        const shape = new PolygonShape([
            new Vec2(-4.5, -8),
            new Vec2(-4.5, 16 -8 - 2),
            new Vec2(-4.5 + 2, 16 -8 ),
            new Vec2(+4.5 - 2, 16 -8),
            new Vec2(+4.5, 16 - 2 -8),
            new Vec2(+4.5, 0 -8),
        ].map(s => s.mul(pixelToSim)));

        this.body.createFixture({
            shape: shape,
            // 密度 大きいと重い
            density: 1.5,
            // 摩擦係数
            friction: 0.0,
            restitution: 0.8,
        });

        const appendTire = (x: number, y: number, forwardDriveForce: number, backwardDriveForce: number/*, maxLateralImpulse: number*/) => {
            const tire = new Tire(world, maxForwardSpeed, maxBackwardSpeed, forwardDriveForce, backwardDriveForce/*, maxLateralImpulse*/); // dummy state
            this.tires.push(tire);

            const def = new RevoluteJoint({
                bodyA: this.body,
                enableLimit: true,
                lowerAngle: 0,
                upperAngle: 0,
                bodyB: tire.body,
                localAnchorA: new Vec2(x, y).mul(pixelToSim),
                localAnchorB: new Vec2(0, 0),
            });
            const joint = world.createJoint(def)!;
            tire.joint = joint;
            return joint;
        };

        this.flJoint = appendTire(-5.5, 11.5 + 1 - 8, frontTireForwardDriveForce, frontTireBackwardDriveForce);
        this.frJoint = appendTire(+5.5, 11.5 + 1 - 8, frontTireForwardDriveForce, frontTireBackwardDriveForce);
        appendTire(-5.5, 4.5 - 1 - 8, backTireForwardDriveForce, backTireBackwardDriveForce);
        appendTire(+5.5, 4.5 - 1 - 8, backTireForwardDriveForce, backTireBackwardDriveForce);
    }

    update() {
        this.tires.forEach(t => t.updateFriction());
        this.tires.forEach(t => t.updateDrive(this.controlState));

        // ハンドル操作による前輪タイヤの方向転換を行います。
        // 回転ジョインとの下限上限を使って強制的に変更します。

        //control steering
        const lockAngle = 45 * degToRad;

        const desiredAngle = -this.controlState.steeringRatio * lockAngle;
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
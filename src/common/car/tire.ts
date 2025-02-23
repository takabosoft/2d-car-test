import { World, Testbed, Box, Vec2, Body, PolygonShape, RevoluteJoint, Edge, Chain } from "planck/with-testbed";
import { ControlState } from "./controlState";
import { pixelToSim } from "../env";

/**
 * タイヤクラス
 * 参考：https://www.iforce2d.net/b2dtut/top-down-car
 */
export class Tire {
    readonly body: Body;
    joint?: RevoluteJoint;

    /**
     * 
     * @param world 
     * @param driveForce 前後に押し出す力
     * @param maxLateralImpulse 横滑り打ち消し力上限　小さいとすべる
     */
    constructor(
        world: World,
        private readonly maxForwardSpeed: number,
        private readonly maxBackwardSpeed: number,
        private readonly forwardDriveForce: number,
        private readonly backwardDriveForce: number,
        //private readonly maxLateralImpulse: number,
    ) {
        this.body = world.createDynamicBody({
            position: new Vec2(0, 0),
            //angle: Math.PI / 5,
            linearDamping: 3,
            angularDamping: 0,
        });

        this.body.createFixture({
            // 形状
            shape: new Box(2 / 2 * pixelToSim, 3 / 2 * pixelToSim),
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

        /*{
            this.body.setLinearVelocity(this.body.getWorldVector(new Vec2(0, 1)).mul(this.body.getLinearVelocity().length()));   
        }*/

       
        // 横方向を打ち消す
        let impulse = this.lateralVelocity.neg().mul(this.body.getMass());
        // 横方向の打ち消す力に上限を設けることで横滑りとなる
        //if (impulse.length() > this.maxLateralImpulse) {
            //impulse = Vec2.mul(this.maxLateralImpulse / impulse.length(), impulse); // ベクトルの大きさだけmaxLateralImpulseになる
        //}
        this.body.applyLinearImpulse(impulse, this.body.getWorldCenter());

        // 自転も打ち消す
        //this.body.applyAngularImpulse(1 * this.body.getInertia() * -this.body.getAngularVelocity());

        // 減速
        /*const currentForwardNormal = this.forwardVelocity;
        const currentForwardSpeed = currentForwardNormal.normalize();
        const dragForceMagnitude = -0.02 * currentForwardSpeed;
        this.body.applyForce(Vec2.mul(currentForwardNormal, dragForceMagnitude), this.body.getWorldCenter());*/
    }

    /** 前進・後退 */
    updateDrive(controlState: ControlState) {

        // ブレーキ
        if (controlState.brake) {
            const currentForwardNormal = this.forwardVelocity;
            const currentForwardSpeed = currentForwardNormal.normalize();
            const dragForceMagnitude = -0.015 * currentForwardSpeed;
            this.body.applyForce(Vec2.mul(currentForwardNormal, dragForceMagnitude), this.body.getWorldCenter());
        }


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
            force = this.forwardDriveForce;
        } else if (desiredSpeed < 0 && desiredSpeed < currentSpeed) {
            force = -this.backwardDriveForce;
        } else {
            return;
        }
        this.body.applyForce(Vec2.mul(force, currentForwardNormal), this.body.getWorldCenter());
    }

}
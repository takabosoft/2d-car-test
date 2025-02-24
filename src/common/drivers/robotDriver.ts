import { Vec2 } from "planck";
import { Car } from "../car/car";
import { ControlState } from "../car/controlState";
import { clamp, degToRad } from "../utils/mathUtils";
import { lerpNumber } from "../animation/easing";
import { clampRobotGene, RobotGene } from "./robotGene";

export class RobotDriver {
    readonly controlState = new ControlState();
    readonly gene: RobotGene;

    constructor(gene: RobotGene) {
        this.gene = clampRobotGene(gene);
    }

    compute(car: Car) {
        this.controlState.accel = true;

        this.controlState.steeringRatio = 0;

        const speed = Vec2.lengthOf(car.body.getLinearVelocity());
        const rayCastMin1 = this.gene.rayCastMinDistance;
        const rayCastMin2 = this.gene.rayCastMinDistance * speed;
        const rayCastMin = lerpNumber(rayCastMin1, rayCastMin2, this.gene.rayCastSpeedRatio);
        const rayCastMax1 = this.gene.rayCastMaxDistance;
        const rayCastMax2 = this.gene.rayCastMaxDistance * speed;
        const rayCastMax = lerpNumber(rayCastMax1, rayCastMax2, this.gene.rayCastSpeedRatio);

        const rayFront = car.rayCast(rayCastMax, 0);
        if (rayFront == null) { return; }
        const rayFrontRatio = clamp((rayCastMax - rayCastMin) == 0 ? 0 : (rayFront - rayCastMin) / (rayCastMax - rayCastMin), 0, 1);

        // どっちに曲がるか
        let isLeft: boolean;
        const rayLeft = car.rayCast(rayCastMax, +this.gene.rayCastDirectionOffsetRad);
        const rayRight = car.rayCast(rayCastMax, -this.gene.rayCastDirectionOffsetRad);
        if (rayLeft == null && rayRight == null) {
            isLeft = Math.random() < 0.5;
        } else if (rayLeft == null && rayRight != null) {
            isLeft = true;
        } else if (rayLeft != null && rayRight == null) {
            isLeft = false;
        } else {
            isLeft = rayLeft! < rayRight!;
        }
        this.controlState.steeringRatio = lerpNumber(this.gene.steeringMaxRatio, this.gene.steeringMinRatio, rayFrontRatio) * (isLeft ? -1 : 1);
    }
} 
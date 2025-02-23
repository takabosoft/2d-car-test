import { Vec2 } from "planck";
import { Car } from "../car/car";
import { ControlState } from "../car/controlState";
import { clamp, degToRad } from "../utils/mathUtils";
import { lerpNumber } from "../animation/easing";


class GeneRange {
    constructor(readonly min: number, readonly max: number) {

    }

    clamp(value: number, minOverride?: number) {
        return clamp(value, minOverride ?? this.min, this.max);
    }
}

const rayCastDistanceRange = new GeneRange(0.001, 10);
const rayCastSpeedRatioRange = new GeneRange(0, 1);
const steeringRatioRange = new GeneRange(0.001, 1);
const rayCastDirectionOffsetRadRange = new GeneRange(0.001, 60 * degToRad);

export interface RobotGene {
    /** 検知する障害物の最小距離 */
    readonly rayCastMinDistance: number;
    /** 検知する障害物の最大距離 */
    readonly rayCastMaxDistance: number;
    /** 検知する障害物の距離に移動速度がどれだけ影響を与えるか */
    readonly rayCastSpeedRatio: number;
    /** 検知した障害物が最小距離に対応するハンドル舵角の最小 */
    readonly steeringMinRatio: number;
    /** 検知した障害物が最大距離に対応するハンドル舵角の最大 */
    readonly steeringMaxRatio: number;
    /** 左右どちらに曲がるかの判定に使うレイキャストの角度オフセット */
    readonly rayCastDirectionOffsetRad: number;
}

export class RobotDriver {
    readonly controlState = new ControlState();
    readonly gene: RobotGene;

    constructor(gene: RobotGene) {

        const rayCastMinDistance = rayCastDistanceRange.clamp(gene.rayCastMinDistance);
        const steeringMinRatio = steeringRatioRange.clamp(gene.steeringMinRatio);

        this.gene = {
            rayCastMinDistance,
            rayCastMaxDistance: rayCastDistanceRange.clamp(gene.rayCastMaxDistance, rayCastMinDistance),
            rayCastSpeedRatio: rayCastSpeedRatioRange.clamp(gene.rayCastSpeedRatio),
            steeringMinRatio,
            steeringMaxRatio: steeringRatioRange.clamp(gene.steeringMaxRatio, steeringMinRatio),
            rayCastDirectionOffsetRad: rayCastDirectionOffsetRadRange.clamp(gene.rayCastDirectionOffsetRad),
        };
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
        const rayFrontRatio = clamp((rayCastMax - rayCastMin) == 0 ? 1 : (rayFront - rayCastMin) / (rayCastMax - rayCastMin), 0, 1);

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
        this.controlState.steeringRatio = lerpNumber(this.gene.steeringMinRatio, this.gene.steeringMaxRatio, rayFrontRatio) * (isLeft ? -1 : 1);
    }
} 
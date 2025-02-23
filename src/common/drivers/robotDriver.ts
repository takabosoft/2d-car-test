import { Car } from "../car/car";
import { ControlState } from "../car/controlState";
import { clamp, degToRad } from "../utils/mathUtils";


class GeneRange {
    constructor(readonly min: number, readonly max: number) {

    }

    clamp(value: number, minOverride?: number) {
        return clamp(value, minOverride ?? this.min, this.max);
    }
}

const rayCastDistanceRange = new GeneRange(0.001, 10);
const rayCastSpeedRatioRange = new GeneRange(0.001, 10);
const steeringRatioRange = new GeneRange(0.001, 1);
const rayCastDirectionOffsetRadRange = new GeneRange(0.001, 60 * degToRad);

export interface RobotGene {
    /** 検知する障害物の最小距離 */
    readonly rayCastMinDistance: number;
    /** 検知する障害物の最大距離 */
    readonly rayCastMaxDistance: number;
    /** 検知する障害物の距離に移動速度をどれだけ掛けるか */
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


    }
} 
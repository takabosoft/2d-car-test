import { clamp, degToRad } from "../utils/mathUtils";
import { randomName } from "../utils/nameGen";
import { rndRange } from "../utils/random";

class GeneRange {
    constructor(readonly min: number, readonly max: number) {

    }

    clamp(value: number, minOverride?: number) {
        return clamp(value, minOverride ?? this.min, this.max);
    }

    rnd(minOverride?: number) {
        return rndRange(minOverride ?? this.min, this.max);
    }
}

const rayCastDistanceRange = new GeneRange(0.001, 2);
const rayCastSpeedRatioRange = new GeneRange(0, 1);
const steeringRatioRange = new GeneRange(0.001, 1);
const rayCastDirectionOffsetRadRange = new GeneRange(0.001, 60 * degToRad);

export interface RobotGene {
    readonly name: string;
    readonly color: number;
    /** 検知する障害物の最小距離 */
    readonly rayCastMinDistance: number;
    /** 検知する障害物の最大距離 */
    readonly rayCastMaxDistance: number;
    /** 検知する障害物の距離に移動速度がどれだけ影響を与えるか */
    readonly rayCastSpeedRatio: number;
    /** 検知した障害物が最大距離に対応するハンドル舵角 */
    readonly steeringMinRatio: number;
    /** 検知した障害物が最小距離に対応するハンドル舵角 */
    readonly steeringMaxRatio: number;
    /** 左右どちらに曲がるかの判定に使うレイキャストの角度オフセット */
    readonly rayCastDirectionOffsetRad: number;
}

export function clampRobotGene(gene: RobotGene): RobotGene {
    const rayCastMinDistance = rayCastDistanceRange.clamp(gene.rayCastMinDistance);
    const steeringMinRatio = steeringRatioRange.clamp(gene.steeringMinRatio);

    return {
        name: gene.name,
        color: gene.color,
        rayCastMinDistance,
        rayCastMaxDistance: rayCastDistanceRange.clamp(gene.rayCastMaxDistance, rayCastMinDistance),
        rayCastSpeedRatio: rayCastSpeedRatioRange.clamp(gene.rayCastSpeedRatio),
        steeringMinRatio,
        steeringMaxRatio: steeringRatioRange.clamp(gene.steeringMaxRatio, steeringMinRatio),
        rayCastDirectionOffsetRad: rayCastDirectionOffsetRadRange.clamp(gene.rayCastDirectionOffsetRad),
    };
}

export function createRandomGene(): RobotGene {

    const rayCastMinDistance = rayCastDistanceRange.rnd();
    const steeringMinRatio = steeringRatioRange.rnd();

    return {
        name: randomName(),
        color: Math.random(),
        rayCastMinDistance: rayCastMinDistance,
        rayCastMaxDistance: rayCastDistanceRange.rnd(rayCastMinDistance),
        rayCastSpeedRatio: rayCastSpeedRatioRange.rnd(),
        steeringMinRatio: steeringMinRatio,
        steeringMaxRatio: steeringRatioRange.rnd(steeringMinRatio),
        rayCastDirectionOffsetRad: rayCastDirectionOffsetRadRange.rnd(),
    }
}

/** とりあえず一周出来そうなパラメータ */
export const testGene: RobotGene = {
    name: "TEST ROBOT",
    color: 0,
    rayCastMinDistance: 0.2,
    rayCastMaxDistance: 0.7,
    rayCastSpeedRatio: 0.5,
    steeringMinRatio: 1,
    steeringMaxRatio: 1,
    rayCastDirectionOffsetRad: 30 * degToRad,
}
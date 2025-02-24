import { Chain, Vec2, World } from "planck";
import { FilterCategory, pixelToSim } from "../env";
import { CheckPoint } from "./checkPoint";

export type Polygon = [number, number][];

type CheckPointRaw = [Vec2, Vec2];

export const enum CourseId {
    Basic,
}

export interface CourseInfo {
    readonly courseId: CourseId;
    readonly name: string;
    readonly size: Vec2;
    /** 壁 */
    readonly outerWalls: Polygon[];
    /** 開始位置 */
    readonly startPos: Vec2;
    /** ゴールとチェックポイント */
    readonly checkPoints: CheckPointRaw[];
}

export class Course {
    constructor(world: World | undefined, readonly info: CourseInfo,) {

        if (world != null) {
            info.outerWalls.forEach(chainPath => {
                // 物理エンジンはY軸が上向きなので変換します。
                const chain = new Chain(chainPath.map(p => this.convertPosXY(p[0], p[1])));
                const boundaryChain = world.createBody();
                boundaryChain.createFixture(chain, {
                    friction: 1.0,
                    filterCategoryBits: FilterCategory.Wall,
                });
            });

            this.checkPoints.forEach((cp, idx) => {
                new CheckPoint(world, cp, idx);
            });
        }
    }

    get name() { return this.info.name; }
    get courseId() { return this.info.courseId; }
    get size() { return this.info.size.clone().mul(pixelToSim); }
    get startPos() { return this.convertPosVec2(this.info.startPos); }

    get outerWalls() { return this.info.outerWalls.map(poly => poly.map(p => this.convertPosXY(p[0], p[1]))); }
    get checkPoints(): CheckPointRaw[] { return this.info.checkPoints.map(cp => [this.convertPosVec2(cp[0]), this.convertPosVec2(cp[1])]) };
    get checkPointCount() { return this.info.checkPoints.length; }

    private convertPosXY(x: number, y: number): Vec2 {
        return new Vec2(x, this.info.size.y - y).mul(pixelToSim);
    }

    private convertPosVec2(v: Vec2): Vec2 {
        return new Vec2(v.x, this.info.size.y - v.y).mul(pixelToSim);
    }

    static fromId(id: CourseId, world: World | undefined): Course {
        switch (id) {
            case CourseId.Basic:
                return new BasicCourse(world);
        }
        return new BasicCourse(world);
    }
}

export class BasicCourse extends Course {
    constructor(world: World | undefined) {
        super(world, {
            courseId: CourseId.Basic,
            name: "普通のコース",
            size: new Vec2(800, 480),
            outerWalls: [
                [[472, 32], [486, 35], [495, 35], [519, 40], [528, 40], [547, 44], [554, 47], [558, 47], [568, 51], [572, 51], [592, 59], [638, 84], [674, 110], [691, 127], [713, 157], [726, 184], [734, 209], [735, 214], [735, 282], [733, 288], [732, 301], [730, 305], [729, 324], [725, 347], [723, 351], [722, 361], [713, 389], [693, 425], [675, 445], [654, 461], [638, 468], [629, 470], [590, 470], [589, 469], [580, 469], [574, 467], [556, 465], [529, 456], [504, 444], [482, 426], [454, 390], [443, 369], [434, 347], [431, 343], [406, 329], [400, 324], [370, 308], [342, 308], [326, 313], [205, 313], [186, 309], [175, 309], [169, 307], [151, 305], [124, 296], [82, 267], [66, 245], [54, 219], [51, 208], [51, 174], [55, 153], [62, 138], [66, 125], [77, 104], [95, 85], [110, 73], [136, 59], [151, 54], [155, 54], [177, 48], [194, 48], [209, 44], [217, 44], [226, 41], [269, 39], [280, 36], [327, 35], [342, 32], [396, 32], [397, 31], [472, 32]],
                [[395, 123], [354, 123], [342, 126], [293, 127], [284, 130], [240, 132], [230, 135], [222, 135], [209, 139], [192, 139], [178, 142], [169, 145], [152, 157], [142, 186], [142, 192], [145, 198], [152, 206], [156, 209], [170, 215], [181, 216], [187, 218], [198, 218], [217, 222], [312, 222], [330, 217], [385, 217], [405, 223], [442, 242], [463, 256], [479, 264], [494, 275], [510, 294], [520, 313], [531, 340], [552, 366], [575, 375], [587, 376], [593, 378], [601, 378], [602, 379], [615, 375], [621, 367], [629, 351], [630, 343], [633, 336], [634, 327], [637, 318], [638, 304], [639, 303], [639, 291], [644, 268], [644, 229], [635, 207], [626, 192], [616, 181], [587, 161], [552, 142], [535, 136], [531, 136], [515, 131], [507, 131], [494, 128], [484, 128], [459, 123], [396, 122], [395, 123]]
            ],
            startPos: new Vec2(446, 78),
            checkPoints: [
                [new Vec2(405, 25), new Vec2(405, 127)],
                [new Vec2(249, 211), new Vec2(249, 324)],
                [new Vec2(633, 245), new Vec2(748, 245)],
            ],
        });
    }
}
import { Chain, Vec2, World } from "planck";
import { FilterCategory, pixelToSim } from "../env";
import { CheckPoint } from "./checkPoint";

export type Polygon = [number, number][];

type CheckPointRaw = [Vec2, Vec2];

export const enum CourseId {
    Course01,
    Course02,
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
            case CourseId.Course01:
                return new Course01(world);
            case CourseId.Course02:
                return new Course02(world);
        }
        return new Course01(world);
    }
}

export class Course01 extends Course {
    constructor(world: World | undefined) {
        super(world, {
            courseId: CourseId.Course01,
            name: "コース01",
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

export class Course02 extends Course {
    constructor(world: World | undefined) {
        super(world, {
            courseId: CourseId.Course02,
            name: "コース02",
            size: new Vec2(800, 480),
            outerWalls: [
                [[551, 25], [564, 28], [571, 28], [576, 30], [600, 31], [611, 33], [652, 44], [692, 62], [709, 74], [722, 88], [734, 112], [743, 143], [744, 149], [744, 219], [742, 224], [741, 241], [734, 266], [733, 274], [726, 295], [710, 330], [706, 343], [689, 375], [672, 401], [660, 417], [638, 439], [616, 451], [610, 456], [590, 463], [539, 463], [510, 456], [480, 444], [448, 417], [387, 330], [360, 299], [348, 290], [337, 285], [334, 285], [328, 290], [297, 344], [284, 362], [271, 375], [237, 390], [208, 390], [207, 389], [200, 389], [190, 387], [166, 377], [158, 372], [137, 353], [121, 334], [113, 319], [103, 305], [96, 287], [86, 271], [85, 266], [69, 231], [68, 223], [63, 207], [63, 120], [70, 95], [75, 83], [96, 57], [114, 45], [139, 33], [171, 25], [551, 25]],
                [[172, 114], [152, 123], [149, 136], [149, 193], [153, 207], [178, 260], [188, 275], [191, 283], [198, 292], [218, 303], [225, 295], [238, 273], [245, 258], [259, 237], [284, 213], [309, 200], [328, 195], [357, 198], [395, 217], [411, 228], [434, 252], [436, 256], [458, 280], [480, 313], [491, 326], [506, 350], [518, 365], [529, 371], [552, 377], [572, 377], [586, 369], [596, 358], [602, 347], [616, 328], [619, 319], [639, 279], [646, 261], [654, 233], [655, 222], [656, 221], [656, 209], [658, 204], [658, 162], [652, 142], [642, 134], [623, 126], [614, 125], [596, 119], [589, 119], [584, 117], [576, 117], [575, 116], [559, 116], [538, 111], [184, 111], [172, 114]]
            ],
            startPos: new Vec2(382, 68),
            checkPoints: [
                [new Vec2(292, 15), new Vec2(292, 121)],
                [new Vec2(332, 171), new Vec2(332, 304)],
                [new Vec2(639, 191), new Vec2(757, 191)],
            ],
        });
    }
}
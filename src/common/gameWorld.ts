import { Vec2, World } from "planck";
import { Car } from "./car/car";
import { CheckPoint } from "./courses/checkPoint";
import { Course, TestCourse } from "./courses/course";

export class GameWorld {
    readonly world = new World({ gravity: new Vec2(0, 0) });
    readonly course: Course;
    private _totalSec = 0;

    constructor() {
        this.course = new TestCourse(this.world); // ステージはIDとかで切り替えるしかない

        this.world.on("begin-contact", e => {
            const aUserData = e.getFixtureA().getUserData();
            const bUserData = e.getFixtureB().getUserData();
            if (aUserData instanceof Car) {
                if (bUserData instanceof CheckPoint) {
                    aUserData.onCheckPoint(bUserData.index, this._totalSec, this.course.checkPointCount);
                }
            } else if (bUserData instanceof Car) {
                if (aUserData instanceof CheckPoint) {
                    bUserData.onCheckPoint(aUserData.index, this._totalSec, this.course.checkPointCount);
                }
            }
        });
    }

    get totalSec() { return this._totalSec; }

    step(deltaSec: number) {
        this._totalSec += deltaSec;
        this.world.step(deltaSec);
    }
}
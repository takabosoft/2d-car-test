import { Vec2, World } from "planck/with-testbed";
import { Course, TestCourse } from "../../../common/courses/course";
import { Scene } from "../scene";
import { SceneController } from "../sceneController";
import { TinyCanvas } from "../../../common/utils/tinyCanvas";
import { Car } from "../../../common/car/car";
import { HumanDriver } from "../../../common/drivers/humanDriver";
import { CarView } from "../../../common/car/carView";
import { pixelToSim } from "../../../common/env";
import { degToRad, radToDeg } from "../../../common/utils/mathUtils";
import { Ticker } from "../../../common/animation/ticker";

export class GameScene extends Scene {
    private readonly world = new World({ gravity: new Vec2(0, 0) });
    private readonly course: Course = new TestCourse(this.world);
    private _lastScreenSize = Vec2.zero();
    private readonly courseCanvas = new TinyCanvas();
    private courseMatrix = new DOMMatrix();
    private readonly humanDriver = new HumanDriver();
    private readonly car = new Car(this.world, this.humanDriver.controlState);
    private readonly carView = new CarView();
    private readonly ticker = new Ticker(frameStep => this.onTicker(frameStep))

    constructor(sceneController: SceneController) {
        super(sceneController, "game-scene");
        this.element.append(
            this.courseCanvas.element.addClass("course-canvas"),
            this.carView.element,
        )
        this.car.reset(this.course.startPos, Math.PI / 2);
        this.layout();
    }

    override onStartScene(): void {
        this.ticker.start();
    }

    override onEndScene(): void {
        this.ticker.stop();
    }

    override onResize(): void {
        this.layout();
    }

    override onKeyDown(e: KeyboardEvent): void {
        this.humanDriver.onKeyDown(e);
    }

    override onKeyUp(e: KeyboardEvent): void {
        this.humanDriver.onKeyUp(e);
    }

    private layout() {
        const screenSize = this.sceneController.screenSize;
        if (Vec2.areEqual(screenSize, this._lastScreenSize)) { return; }
        this._lastScreenSize = screenSize;

        const courseSize = this.course.size;
        const scale = Math.min(screenSize.x / courseSize.x, screenSize.y / courseSize.y);
        const scaledSize = Vec2.mul(courseSize, scale);
        const offset = Vec2.mul(0.5, Vec2.sub(screenSize, scaledSize));
        //console.log(scaledSize, offset);
        
        // コース→画面の変換行列を作っておきます。
        const mat = new DOMMatrix();
        mat.translateSelf(offset.x, offset.y, 0);
        mat.scaleSelf(scale, scale, 1, 0, 0, 0);
        mat.translateSelf(0, courseSize.y, 0);
        mat.scaleSelf(1, -1, 1, 0, 0, 0);
        this.courseMatrix = mat;
        
        this.courseCanvas.size = screenSize;
        this.courseCanvas.clear();
        this.courseCanvas.ctx.setTransform(mat);

        const ctx = this.courseCanvas.ctx;

        const path = new Path2D();
        this.course.outerWalls.forEach(wall => wall.forEach((pt, idx) => idx == 0 ? path.moveTo(pt.x, pt.y) : path.lineTo(pt.x, pt.y)));
        path.closePath();

        ctx.setLineDash([]);
        ctx.lineJoin = "round";
        /*ctx.lineWidth = 0.04;
        ctx.lineJoin = "round";
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.stroke(path);*/

        ctx.fillStyle = "rgb(64, 64, 64)";
        ctx.fill(path, "evenodd");

        ctx.save();
        ctx.clip(path);

        ctx.lineWidth = 0.06;
        ctx.strokeStyle = "white";
        ctx.stroke(path);

        ctx.setLineDash([0.1, 0.1]);
        ctx.strokeStyle = "red";
        ctx.stroke(path);

        ctx.restore();

        ctx.setLineDash([]);
        ctx.lineWidth = 0.02;
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.stroke(path);

        this.updateCarView();
    }

    private updateCarView() {
        const mat = new DOMMatrix();
        mat.multiplySelf(this.courseMatrix);
        const pos = this.car.body.getPosition();
        mat.translateSelf(pos.x, pos.y);
        
        mat.scaleSelf(pixelToSim, pixelToSim, 1);

        mat.rotateSelf(0, 0, this.car.body.getAngle() * radToDeg);
        mat.scaleSelf(1, -1, 1);
        mat.translateSelf(-13 / 2, -16 / 2, 0);
        this.carView.element[0].style.transform = mat.toString();
    }

    private onTicker(frameStep: number) {
        //console.log(frameStep);
        this.car.update();
        this.world.step(1 / 60 * frameStep);
        this.updateCarView();
    }
}
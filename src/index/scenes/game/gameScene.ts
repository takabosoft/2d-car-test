import { Vec2, World } from "planck/with-testbed";
import { Course, TestCourse } from "../../../common/courses/course";
import { Scene } from "../scene";
import { SceneController } from "../sceneController";
import { TinyCanvas } from "../../../common/utils/tinyCanvas";
import { Car } from "../../../common/car/car";
import { HumanDriver } from "../../../common/drivers/humanDriver";
import { CarView } from "../../../common/car/carView";
import { pixelToSim } from "../../../common/env";
import { Ticker } from "../../../common/animation/ticker";
import { spriteInfos, spriteSheet } from "../../../common/spriteSheet";
import { CheckPoint } from "../../../common/courses/checkPoint";

export class GameScene extends Scene {
    private readonly world = new World({ gravity: new Vec2(0, 0) });
    private readonly course: Course = new TestCourse(this.world);
    private _lastScreenSize = Vec2.zero();
    private readonly courseCanvas = new TinyCanvas();
    private courseMatrix = new DOMMatrix();
    private readonly humanDriver = new HumanDriver();
    private readonly car = new Car(this.world, this.humanDriver.controlState);
    private readonly carView = new CarView();
    private readonly ticker = new Ticker(frameStep => this.onTicker(frameStep));
    private totalSec = 0;
    private readonly textEl = $(`<div class="text">`);

    constructor(sceneController: SceneController) {
        super(sceneController, "game-scene");
        this.element.append(
            this.courseCanvas.element.addClass("course-canvas"),
            this.carView.element,
            this.textEl,
        )
        this.car.reset(this.course.startPos, Math.PI / 2);

        this.world.on("begin-contact", e => {
            const aUserData = e.getFixtureA().getUserData();
            const bUserData = e.getFixtureB().getUserData();
            if (aUserData instanceof Car) {
                if (bUserData instanceof CheckPoint) {
                    aUserData.onCheckPoint(bUserData.index, this.totalSec, this.course.checkPointCount);
                }
            } else if (bUserData instanceof Car) {
                if (aUserData instanceof CheckPoint) {
                    bUserData.onCheckPoint(aUserData.index, this.totalSec, this.course.checkPointCount);
                }
            }
        });

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

        const pixelScale = pixelToSim * mat.a;
        
        this.courseCanvas.size = screenSize;

        const ctx = this.courseCanvas.ctx;
        ctx.imageSmoothingEnabled = false;
        ctx.setLineDash([]);
        ctx.lineJoin = "round";
        const path = new Path2D();
        this.course.outerWalls.forEach(wall => wall.forEach((pt, idx) => idx == 0 ? path.moveTo(pt.x, pt.y) : path.lineTo(pt.x, pt.y)));
        path.closePath();

        // 背景を芝生で塗りつぶします。
        {
            ctx.resetTransform();
            ctx.scale(pixelScale, pixelScale);
            const pattern = ctx.createPattern(spriteSheet.crop(spriteInfos.grass).canvas, "repeat")!;
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, this.courseCanvas.canvas.width / pixelScale + 10, this.courseCanvas.canvas.height / pixelScale + 10);
        }

        this.courseCanvas.ctx.setTransform(mat);

        // コースをアスファルトテクスチャで塗りつぶします。
        {
            ctx.save();
            ctx.clip(path);
            ctx.resetTransform();
            ctx.scale(pixelScale, pixelScale);
            const pattern = ctx.createPattern(spriteSheet.crop(spriteInfos.asphalt).canvas, "repeat")!;

            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, this.courseCanvas.canvas.width / pixelScale + 10, this.courseCanvas.canvas.height / pixelScale + 10);
            ctx.restore();
        }

        {
            const checkPoints = this.course.checkPoints;
            if (checkPoints.length > 0) {
                ctx.beginPath();
                ctx.moveTo(checkPoints[0][0].x, checkPoints[0][0].y);
                ctx.lineTo(checkPoints[0][1].x, checkPoints[0][1].y);
                ctx.strokeStyle = "red";
                ctx.lineWidth = 0.02;
                ctx.stroke();
            }
        }

        // 縁石
        {
            ctx.save();
            ctx.clip(path);

            ctx.lineWidth = 0.08;
            ctx.strokeStyle = "white";
            ctx.stroke(path);

            ctx.setLineDash([0.08, 0.08]);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 0.06;
            ctx.stroke(path);

            ctx.restore();
        }

        ctx.setLineDash([]);
        ctx.lineWidth = 0.02;
        ctx.strokeStyle = "rgb(50, 50, 50)";
        ctx.stroke(path);

        this.updateCarView();
    }

    private updateCarView() {
        this.carView.update(this.car, this.courseMatrix);
    }

    private onTicker(deltaSec: number) {
        //console.log(frameStep);
        this.car.update();

        
        this.totalSec += deltaSec;
        this.world.step(deltaSec);
        this.updateCarView();
        this.updateTextInfo();
    }

    private formatTime(sec?: number): string {

        if (sec == null) { return "--'00.000"; }

        // 分と秒を計算
        const minutes = Math.floor(sec / 60);
        const seconds = Math.floor(sec % 60);
        const milliseconds = Math.floor((sec % 1) * 1000);
    
        // フォーマット：分 ' 秒.ミリ秒
        const formattedTime = `${minutes}'${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
    
        return formattedTime;
    }

    private updateTextInfo() {

        const lapTime = this.car.startSec == null ? this.formatTime() : this.formatTime(this.totalSec - this.car.startSec);

        this.textEl.text(`Lap: ${lapTime}　　　Last: ${this.formatTime(this.car.lastLapTime)}　　　Best: ${this.formatTime(this.car.bestLapTime)}`);
    }
}
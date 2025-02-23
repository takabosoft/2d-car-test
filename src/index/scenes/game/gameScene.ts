import { Vec2, World } from "planck/with-testbed";
import { Course, TestCourse } from "../../../common/courses/course";
import { Scene } from "../scene";
import { SceneController } from "../sceneController";
import { TinyCanvas } from "../../../common/utils/tinyCanvas";

export class GameScene extends Scene {
    private readonly world = new World({ gravity: new Vec2(0, 0) });
    private readonly course: Course = new TestCourse(this.world);
    private _lastScreenSize = Vec2.zero();
    private readonly courseCanvas = new TinyCanvas();
    private courseMatrix = new DOMMatrix();

    constructor(sceneController: SceneController) {
        super(sceneController, "game-scene");
        this.element.append(
            this.courseCanvas.element.addClass("course-canvas"),
        )
        this.layout();
    }

    override onStartScene(): void {
        console.log("start");
    }

    override onEndScene(): void {
        
    }

    override onResize(): void {
        this.layout();
    }

    private layout() {
        const screenSize = this.sceneController.screenSize;
        if (Vec2.areEqual(screenSize, this._lastScreenSize)) { return; }
        this._lastScreenSize = screenSize;

        const courseSize = this.course.size;
        const scale = Math.min(screenSize.x / courseSize.x, screenSize.y / courseSize.y);
        const scaledSize = Vec2.mul(courseSize, scale);
        const offset = Vec2.mul(0.5, Vec2.sub(screenSize, scaledSize));
        console.log(scaledSize, offset);
        
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
    }
}
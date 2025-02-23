import { Vec2 } from "planck";
import { Component } from "../components/component";
import { TinyCanvas } from "../utils/tinyCanvas";
import { Course } from "./course";
import { pixelToSim } from "../env";
import { spriteInfos, spriteSheet } from "../spriteSheet";

export class CourseView extends Component {
    readonly canvas = new TinyCanvas();
    private _matrix = new DOMMatrix();
    private _lastScreenSize = Vec2.zero();

    constructor() {
        super()
        this.element = this.canvas.element.addClass("course");
    }

    /** シミュレーション座標から画面への変換行列を取得します。 */
    get matrix() { return this._matrix; }

    render(course: Course, screenSize: Vec2) {
        if (Vec2.areEqual(screenSize, this._lastScreenSize)) { return; }
        this._lastScreenSize = screenSize;

        const courseSize = course.size;
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
        this._matrix = mat;

        const pixelScale = pixelToSim * mat.a;

        this.canvas.size = screenSize;

        const ctx = this.canvas.ctx;
        ctx.imageSmoothingEnabled = false;
        ctx.setLineDash([]);
        ctx.lineJoin = "round";
        const path = new Path2D();
        course.outerWalls.forEach(wall => wall.forEach((pt, idx) => idx == 0 ? path.moveTo(pt.x, pt.y) : path.lineTo(pt.x, pt.y)));
        path.closePath();

        // 背景を芝生で塗りつぶします。
        {
            ctx.resetTransform();
            ctx.scale(pixelScale, pixelScale);
            const pattern = ctx.createPattern(spriteSheet.crop(spriteInfos.grass).canvas, "repeat")!;
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, this.canvas.canvas.width / pixelScale + 10, this.canvas.canvas.height / pixelScale + 10);
        }

        this.canvas.ctx.setTransform(mat);

        // コースをアスファルトテクスチャで塗りつぶします。
        {
            ctx.save();
            ctx.clip(path);
            ctx.resetTransform();
            ctx.scale(pixelScale, pixelScale);
            const pattern = ctx.createPattern(spriteSheet.crop(spriteInfos.asphalt).canvas, "repeat")!;

            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, this.canvas.canvas.width / pixelScale + 10, this.canvas.canvas.height / pixelScale + 10);
            ctx.restore();
        }

        // ゴール
        {
            const checkPoints = course.checkPoints;
            if (checkPoints.length > 0) {
                ctx.save();
                ctx.clip(path);
                const blockSize = 0.04;

                const drawLine = (xOffset: number) => {
                    ctx.beginPath();
                    ctx.moveTo(checkPoints[0][0].x + xOffset, checkPoints[0][0].y);
                    ctx.lineTo(checkPoints[0][1].x + xOffset, checkPoints[0][1].y);
                    ctx.stroke();
                }

                ctx.strokeStyle = "black";
                ctx.lineWidth = blockSize * 4;
                drawLine(0);

                ctx.strokeStyle = "white";
                ctx.lineWidth = blockSize;
                ctx.setLineDash([blockSize, blockSize]);
                drawLine(-blockSize * 1.5);
                drawLine(+blockSize * 0.5);
                ctx.lineDashOffset = blockSize;
                drawLine(-blockSize * 0.5);
                drawLine(+blockSize * 1.5);

                ctx.restore();
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
    }
}
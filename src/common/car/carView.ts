import { Component } from "../components/component";
import { pixelToSim } from "../env";
import { Vec2 } from "../geometries/vec2";
import { spriteInfos, spriteSheet } from "../spriteSheet";
import { radToDeg } from "../utils/mathUtils";
import { randomName } from "../utils/nameGen";
import { Car } from "./car";

class TireView extends Component {
    constructor(readonly offset: Vec2) {
        super();
        this.element = $(`<div class="tire">`);
    }
}

export class CarView extends Component {
    readonly flTire: TireView;
    readonly frTire: TireView;
    readonly rlTire: TireView;
    readonly rrTire: TireView;

    readonly nameView = $(`<div class="name-plate">`);

    constructor(color?: number, private readonly name?: string) {
        super();
        this.element = $(`<div class="car">`);

        const initTire = (x: number, y: number) => {
            const tire = new TireView(new Vec2(x, y));
            this.element.append(
                tire.element.css({
                    left: x,
                    top: y,
                })
            );
            return tire;
        }
        this.flTire = initTire(0, 3);
        this.frTire = initTire(11, 3);
        this.rlTire = initTire(0, 10);
        this.rrTire = initTire(11, 10);

        const body = $(spriteSheet.crop(spriteInfos.car).canvas).addClass("body");
        if (color != null) {
            body[0].style.filter = `hue-rotate(${color * 360}deg)`;
        }
        this.element.append(body);

        if (name != null) {
            this.nameView.text(name);
        }
    }

    update(car: Car, courseMatrix: DOMMatrix) {

        // 位置角度
        const mat = new DOMMatrix();
        mat.multiplySelf(courseMatrix);
        const pos = car.body.getPosition();
        mat.translateSelf(pos.x, pos.y);
        mat.scaleSelf(pixelToSim, pixelToSim, 1);
        mat.rotateSelf(0, 0, car.body.getAngle() * radToDeg);
        mat.scaleSelf(1, -1, 1); // 上下反対
        mat.translateSelf(-13 / 2, -16 / 2, 0);
        this.element[0].style.transform = mat.toString();

        // 前輪
        const angle = car.getTireAngle * radToDeg;
        this.flTire.element[0].style.transform = this.frTire.element[0].style.transform = `rotate(${-angle}deg)`;

        // 名前
        if (this.name != null) {
            const pos2 = courseMatrix.transformPoint(new DOMPoint(pos.x, pos.y + 8 * pixelToSim));
            this.nameView[0].style.transform = `translate(${pos2.x}px, ${pos2.y}px) translate(-50%, -20px)`;
        }
    }

    destroy() {
        this.element.remove();
        this.nameView.remove();
    }
}
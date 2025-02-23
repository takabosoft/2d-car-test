import { Component } from "../components/component";
import { pixelToSim } from "../env";
import { Vec2 } from "../geometries/vec2";
import { spriteInfos, spriteSheet } from "../spriteSheet";
import { radToDeg } from "../utils/mathUtils";
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

    constructor(isRandomColor = false) {
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
        if (isRandomColor) {
            body[0].style.filter = `hue-rotate(${Math.random() * 360}deg)`;
        }
        this.element.append(body);
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
    }
}

import { Ticker } from "../../../common/animation/ticker";
import { Car } from "../../../common/car/car";
import { CarView } from "../../../common/car/carView";
import { ControlState } from "../../../common/car/controlState";
import { CourseView } from "../../../common/courses/courseView";
import { RobotDriver } from "../../../common/drivers/robotDriver";
import { GameWorld } from "../../../common/gameWorld";
import { degToRad } from "../../../common/utils/mathUtils";
import { Scene } from "../scene";
import { SceneController } from "../sceneController";

export class GeneticGameScene extends Scene {
    private readonly gameWorld = new GameWorld()
    private readonly courseView = new CourseView();
    //private readonly humanDriver = new HumanDriver();

    private readonly robotDriver = new RobotDriver({
        rayCastMinDistance: 0.1,
        rayCastMaxDistance: 0.3,
        rayCastSpeedRatio: 1,
        steeringMinRatio: 0,
        steeringMaxRatio: 1,
        rayCastDirectionOffsetRad: 30 * degToRad,
    });
    private readonly car = new Car(this.gameWorld.world, this.robotDriver.controlState);
    private readonly carView = new CarView();
    private readonly ticker = new Ticker(frameStep => this.onTicker(frameStep));
    //private readonly textEl = $(`<div class="lap-info">`);

    constructor(sceneController: SceneController) {
        super(sceneController, "genetic-game-scene");
        this.element.append(
            this.courseView.element,
            this.carView.element,
            //this.textEl,
            //$(`<div class="operation-info">`).text("[W]アクセル\n[A][D]ハンドル\n[S]ブレーキ\n[X]バック"),
        )
        this.car.reset(this.gameWorld.course.startPos, Math.PI / 2);
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
        //this.humanDriver.onKeyDown(e);
    }

    override onKeyUp(e: KeyboardEvent): void {
        //this.humanDriver.onKeyUp(e);
    }

    private layout() {
        const screenSize = this.sceneController.screenSize;
        this.courseView.render(this.gameWorld.course, screenSize);
        this.updateCarView();
    }

    private updateCarView() {
        this.carView.update(this.car, this.courseView.matrix);
    }

    private onTicker(deltaSec: number) {
        this.robotDriver.compute(this.car);
        this.car.update();
        this.gameWorld.step(deltaSec);
        this.updateCarView();
        //this.updateTextInfo();
    }

    /*private updateTextInfo() {
        const lapTime = this.car.startSec == null ? formatLapTime() : formatLapTime(this.gameWorld.totalSec - this.car.startSec);
        this.textEl.text(`Lap: ${lapTime}　　　Last: ${formatLapTime(this.car.lastLapTime)}　　　Best: ${formatLapTime(this.car.bestLapTime)}`);
    }*/
}
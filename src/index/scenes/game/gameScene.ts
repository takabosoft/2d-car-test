import { Scene } from "../scene";
import { SceneController } from "../sceneController";
import { Car } from "../../../common/car/car";
import { HumanDriver } from "../../../common/drivers/humanDriver";
import { CarView } from "../../../common/car/carView";
import { Ticker } from "../../../common/animation/ticker";
import { CourseView } from "../../../common/courses/courseView";
import { GameWorld } from "../../../common/gameWorld";
import { formatLapTime } from "../../../common/utils/lapTimeFormatter";

export class GameScene extends Scene {
    private readonly gameWorld = new GameWorld()
    private readonly courseView = new CourseView();
    private readonly humanDriver = new HumanDriver();
    private readonly car = new Car(this.gameWorld.world, this.humanDriver.controlState);
    private readonly carView = new CarView();
    private readonly ticker = new Ticker(frameStep => this.onTicker(frameStep));
    private readonly textEl = $(`<div class="lap-info">`);

    constructor(sceneController: SceneController) {
        super(sceneController, "game-scene");
        this.element.append(
            this.courseView.element,
            this.carView.element,
            this.textEl,
            $(`<div class="operation-info">`).text("[W]アクセル\n[A][D]ハンドル\n[S]ブレーキ\n[X]バック"),
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
        this.humanDriver.onKeyDown(e);
    }

    override onKeyUp(e: KeyboardEvent): void {
        this.humanDriver.onKeyUp(e);
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
        this.car.update();
        this.gameWorld.step(deltaSec);
        this.updateCarView();
        this.updateTextInfo();
    }

    private updateTextInfo() {
        const lapTime = this.car.startSec == null ? formatLapTime() : formatLapTime(this.gameWorld.totalSec - this.car.startSec);
        this.textEl.text(`Lap: ${lapTime}　　　Last: ${formatLapTime(this.car.lastLapTime)}　　　Best: ${formatLapTime(this.car.bestLapTime)}`);
    }
}
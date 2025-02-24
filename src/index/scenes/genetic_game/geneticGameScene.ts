
import { Ticker } from "../../../common/animation/ticker";
import { CourseView } from "../../../common/courses/courseView";
import { createRandomGene, testGene } from "../../../common/drivers/robotGene";
import { GameWorld } from "../../../common/gameWorld";
import { Scene } from "../scene";
import { SceneController } from "../sceneController";
import { Robot } from "./robot";

const maxRobot = 20;

export class GeneticGameScene extends Scene {
    private readonly gameWorld = new GameWorld()
    private readonly courseView = new CourseView();
    private robots: Robot[] = [];
    private readonly ticker = new Ticker(frameStep => this.onTicker(frameStep));
    //private readonly textEl = $(`<div class="lap-info">`);

    constructor(sceneController: SceneController) {
        super(sceneController, "genetic-game-scene");
        this.element.append(
            this.courseView.element,            
            //this.textEl,
            //$(`<div class="operation-info">`).text("[W]アクセル\n[A][D]ハンドル\n[S]ブレーキ\n[X]バック"),
        )

        for (let i = 0; i < maxRobot; i++) {
            const robot = new Robot(this.gameWorld.world, createRandomGene());
            this.element.append(
                robot.carView.element,
                robot.carView.nameView,
            );
            robot.car.reset(this.gameWorld.course.startPos, Math.PI / 2);
            this.robots.push(robot);
        }

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
        this.robots.forEach(robot => robot.carView.update(robot.car, this.courseView.matrix));
    }

    private onTicker(deltaSec: number) {
        this.robots.forEach(robot => {
            robot.robotDriver.compute(robot.car);
            robot.car.update();
        });
        
        this.gameWorld.step(deltaSec);
        this.updateCarView();
        //this.updateTextInfo();
    }

    /*private updateTextInfo() {
        const lapTime = this.car.startSec == null ? formatLapTime() : formatLapTime(this.gameWorld.totalSec - this.car.startSec);
        this.textEl.text(`Lap: ${lapTime}　　　Last: ${formatLapTime(this.car.lastLapTime)}　　　Best: ${formatLapTime(this.car.bestLapTime)}`);
    }*/
}
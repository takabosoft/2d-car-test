
import { Ticker } from "../../../common/animation/ticker";
import { CourseId } from "../../../common/courses/course";
import { CourseView } from "../../../common/courses/courseView";
import { createRandomGene, crossover, RobotGene } from "../../../common/drivers/robotGene";
import { GameWorld } from "../../../common/gameWorld";
import { Scene } from "../scene";
import { SceneController } from "../sceneController";
import { TitleScene } from "../title/titleScene";
import { LiveTimingView } from "./liveTimingView";
import { Robot } from "./robot";

const maxRobot = 20;

export class GeneticGameScene extends Scene {
    private readonly gameWorld: GameWorld;
    private readonly courseView = new CourseView();
    private robots: Robot[] = [];
    private readonly ticker = new Ticker(frameStep => this.onTicker(frameStep));
    private readonly liveTimingView = new LiveTimingView();
    private readonly textEl = $(`<div>`);
    private readonly infoEl = $(`<div class="info">`).append(
        this.textEl,
        this.liveTimingView.element,
    );
    private generation = 1;

    constructor(sceneController: SceneController, courseId: CourseId) {
        super(sceneController, "genetic-game-scene");

        this.gameWorld = new GameWorld(courseId);

        this.element.append(
            this.courseView.element,            
            this.infoEl,
            $(`<button class="back-btn">`).text("戻る").on("click", () => this.sceneController.changeScene(new TitleScene(this.sceneController))),
        )

        this.createRobots();
        this.layout();
        this.updateTextInfo();
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
        this.liveTimingView.update(this.robots, this.gameWorld.totalSec);

        // ベストタイムが出ていて10秒以上何も起きない or 30秒何もおきない or 1分経過 で次世代へ
        if (
            (this.liveTimingView.lastUpdateSec + 10 < this.gameWorld.totalSec && this.robots.some(r => r.car.bestLapTime != null)) ||
            (this.liveTimingView.lastUpdateSec + 30 < this.gameWorld.totalSec) ||
            (this.gameWorld.totalSec > 60)
        ) {
            this.nextGeneration();
        }
    }

    private updateTextInfo() {
        this.textEl.text(`第${this.generation}世代`);
    }

    /** 次の世代へ移行 */
    private nextGeneration() {
        console.log("次の世代へ移行します。");

        this.ticker.stop();
        this.generation++;
        const sorted = [...this.robots].sort((r1, r2) => (r1.car.bestLapTime ?? Number.MAX_VALUE) - (r2.car.bestLapTime ?? Number.MAX_VALUE));

        const genes: RobotGene[] = [];
        for (let i = 0; i < maxRobot; i++) {
            const robotA = sorted[0]; // 一番早いロボットは必ず選択する
            const robotB = sorted[1 + Math.floor(Math.random() * 3)]; // もう片方は少しランダムにする
            console.log(`${i}: ${robotA.robotDriver.gene.name} x ${robotB.robotDriver.gene.name}`);
            genes.push(crossover(robotA.robotDriver.gene, robotB.robotDriver.gene));
        }

        this.robots.forEach(r => r.destroy());
        this.robots = [];

        this.createRobots(genes);
        this.updateTextInfo();
        this.gameWorld.resetTotalSec();
        this.ticker.start();
    }

    private createRobots(genes?: RobotGene[]) {
        for (let i = 0; i < maxRobot; i++) {
            const robot = new Robot(this.gameWorld.world, genes ? genes[i] : createRandomGene());
            this.element.append(
                robot.carView.element,
                robot.carView.nameView,
            );
            robot.car.reset(this.gameWorld.course.startPos, Math.PI / 2);
            this.robots.push(robot);
        }
        this.updateCarView();
    }
}
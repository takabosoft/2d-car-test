import { Vec2 } from "planck";
import { Course, Course01, Course02 } from "../../../common/courses/course";
import { CourseView } from "../../../common/courses/courseView";
import { Scene } from "../scene";
import { SceneController } from "../sceneController";
import { GameScene } from "../game/gameScene";
import { GeneticGameScene } from "../genetic_game/geneticGameScene";
import { soundManager } from "../../../common/sounds/soundManager";

export class TitleScene extends Scene {
    constructor(sceneController: SceneController) {
        super(sceneController, "title-scene");

        this.element.append(
            $(`<div class="content">`).append(
                $(`<h1>`).text("2D物理エンジンレースカー進化シミュレーター"),
                $(`<div class="copyright">Copyright (C) 2025 <a href="https://takabosoft.com/" target="_blank">Takabo Soft</a></div>`),
                this.buildCoursePanel(new Course01(undefined)),
                this.buildCoursePanel(new Course02(undefined)),
                $(`<div class="description">よくある「遺伝的アルゴリズムを用いてロボットレースカーが速くなっていくのを眺めるだけ」のゲームです。
                        （ちょっと虫感が強くなってしまいました！）
                        ロボットは前方の障害物の距離がいくつのときにどれだけハンドルを切るか...といったようなパラメータを遺伝子として組み替えながら次世代へ繋いでいきます。
                        アクセルはベタ踏みです。
        
                        人間が操作できるモードも用意いたしました。
                        
                        動作環境：Chrome/Edge + 大きめのモニター
                        ソースコード：<a href="https://github.com/takabosoft/2d-evolution-racer" target="_blank">https://github.com/takabosoft/2d-evolution-racer</a>
                        2D物理エンジン：<a href="https://github.com/piqnt/planck.js">planck.js Copyright (c) Erin Catto, Ali Shakiba</a>
                    </div>
                    
                    <div class="description"><input type="checkbox" id="sound"/><label for="sound">効果音を鳴らす（※音量注意）</label></div>`),
            )
        );

        this.element.find("#sound").on("change", e => {
            soundManager.enable = $(e.target).prop("checked") as boolean;
            if (soundManager.enable) {
                soundManager.playButtonTap();
            }
        });
    }

    private buildCoursePanel(course: Course): JQuery {
        const view = new CourseView();
        view.render(course, new Vec2(400, 240));
        return $(`<div class="course-panel">`).append(
            view.canvas.canvas,
            $(`<div class="info">`).append(
                $(`<div class="title">`).text(course.name),
                $(`<button class="play-button">`).text("遺伝的アルゴリズムの様子を見る").on("click", e => {
                    soundManager.playButtonTap();
                    this.sceneController.changeScene(new GeneticGameScene(this.sceneController, course.courseId));
                }),
                $(`<button class="play-button">`).text("自分で操作する").on("click", e => {
                    soundManager.playButtonTap();
                    this.sceneController.changeScene(new GameScene(this.sceneController, course.courseId));
                }),
            )
        )
    }
}
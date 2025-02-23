import { Component } from "../../common/components/component";
import { SceneController } from "./sceneController";

export class Scene extends Component {
    constructor(readonly sceneController: SceneController, addClass: string) {
        super();
        this.element = $(`<div class="scene">`).addClass(addClass);
    }

    /** 画面が切り替わり終わったときに呼ばれます。 */
    onStartScene(): void {

    }

    /** 画面が消えるときに呼ばれます。 */
    onEndScene(): void {

    }

    /** 画面サイズが変わったときに呼ばれます。 */
    onResize(): void {

    }

    onKeyDown(e: KeyboardEvent) {}
    onKeyUp(e: KeyboardEvent) {}
}

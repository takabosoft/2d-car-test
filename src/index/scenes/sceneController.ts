/**
 * ## View階層
 * - SceneController
 *   - scene
 */

import { Component } from "../../common/components/component";
import { Scene } from "./scene";

export class SceneController extends Component {
    private _curScene?: Scene;

    constructor() {
        super();
        this.element = $(`<div class="scene-ctrl">`)
    }

    /** シーンを変更します。 */
    changeScene(newScene: Scene): void {
        //console.log("changeScene:", newScene);
        this._curScene?.onEndScene();
        this.element.empty().append(newScene.element);
        this._curScene = newScene;
        newScene.onStartScene();
    }
}

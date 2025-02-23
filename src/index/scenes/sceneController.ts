/**
 * ## View階層
 * - SceneController
 *   - scene
 */

import { Vec2 } from "planck/with-testbed";
import { Component } from "../../common/components/component";
import { Scene } from "./scene";

export class SceneController extends Component {
    private _curScene?: Scene;

    constructor() {
        super();
        this.element = $(`<div class="scene-ctrl">`);

        const observer = new ResizeObserver(() => this._curScene?.onResize());
        observer.observe(this.element[0]);
    }

    get screenSize(): Vec2 { return new Vec2(this.element.outerWidth()!, this.element.outerHeight()!); }

    /** シーンを変更します。 */
    changeScene(newScene: Scene): void {
        //console.log("changeScene:", newScene);
        this._curScene?.onEndScene();
        this.element.empty().append(newScene.element);
        this._curScene = newScene;
        newScene.onStartScene();
    }
}

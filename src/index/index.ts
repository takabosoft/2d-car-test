/**
 * Development Build: npx webpack -w
 * Development Server: npx live-server docs
 * Development Server(HTTPS): npx live-server docs --https=ssl/https.js
 * Release Build: npx webpack --mode=production
 * URL: http://localhost:8080/
 */

import { SceneController } from "./scenes/sceneController";
import { spriteSheet } from "../common/spriteSheet";
import { TitleScene } from "./scenes/title/titleScene";

$(() => new PageController().start());

class PageController {
    readonly sceneController = new SceneController();

    async start() {
        $(document.body).append(this.sceneController.element);
        await spriteSheet.load();
        this.sceneController.changeScene(new TitleScene(this.sceneController));
    }
}

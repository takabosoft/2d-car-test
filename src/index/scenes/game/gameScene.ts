import { Scene } from "../scene";

export class GameScene extends Scene {
    constructor() {
        super("game-scene");
    }

    override onStartScene(): void {
        console.log("start");
    }

    override onEndScene(): void {
        
    }
}
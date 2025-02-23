import { ControlState } from "../car/controlState";

export class HumanDriver {
    readonly controlState = new ControlState();
    private readonly keyState = new Set<string>();

    private get calcSteeringRatio() {
        return 0 + (this.keyState.has("a") ? -1 : 0) + (this.keyState.has("d") ? +1 : 0);
    }

    onKeyDown(e: KeyboardEvent): void {
        console.log(e.key);
        switch (e.key) {
            case "w": this.controlState.accel = true; break;
            case "s": this.controlState.brake = true; break;
            case "x": this.controlState.back = true; break;
            case "a":
            case "d":
                this.keyState.add(e.key);
                this.controlState.steeringRatio = this.calcSteeringRatio;
                break;
        }
    }

    onKeyUp(e: KeyboardEvent): void {
        switch (e.key) {
            case "w": this.controlState.accel = false; break;
            case "s": this.controlState.brake = false; break;
            case "x": this.controlState.back = false; break;
            case "a":
            case "d":
                this.keyState.delete(e.key);
                this.controlState.steeringRatio = this.calcSteeringRatio;
                break;
        }
    }
}
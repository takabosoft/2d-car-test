import { ControlState } from "../car/controlState";

export class HumanDriver {
    readonly controlState = new ControlState();
    private readonly keyState = new Set<string>();

    private get calcSteeringRatio() {
        return 0 + (this.keyState.has("A") ? -1 : 0) + (this.keyState.has("D") ? +1 : 0);
    }

    onKeyDown(key: string): void {
        switch (key) {
            case "W": this.controlState.accel = true; break;
            case "S": this.controlState.brake = true; break;
            case "X": this.controlState.back = true; break;
            case "A":
            case "D":
                this.keyState.add(key);
                this.controlState.steeringRatio = this.calcSteeringRatio;
                break;
        }
    }

    onKeyUp(key: string): void {
        switch (key) {
            case "W": this.controlState.accel = false; break;
            case "S": this.controlState.brake = false; break;
            case "X": this.controlState.back = false; break;
            case "A":
            case "D":
                this.keyState.delete(key);
                this.controlState.steeringRatio = this.calcSteeringRatio;
                break;
        }
    }
}
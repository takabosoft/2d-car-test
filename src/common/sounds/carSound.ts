import { soundManager } from "./soundManager";

export class CarSound {
    readonly oscillator: OscillatorNode;
    readonly panner: StereoPannerNode;

    constructor(gain = 0.2) {
        const ctx = soundManager.audioContext;
        this.oscillator = ctx.createOscillator();
        this.oscillator.type = "square";
        this.oscillator.frequency.value = 40;

        this.panner = ctx.createStereoPanner();

        const gainNode = ctx.createGain();
        gainNode.gain.value = gain;

        this.oscillator.connect(this.panner).connect(gainNode).connect(ctx.destination);

        this.oscillator.onended = () => {
            this.oscillator.disconnect();
            this.panner.disconnect();
            gainNode.disconnect();
        };
        this.oscillator.start();
    }

    update(pan: number, frequency: number) {
        this.panner.pan.value = pan;
        this.oscillator.frequency.value = frequency;
    }

    destroy() {
        this.oscillator.stop();
    }
}
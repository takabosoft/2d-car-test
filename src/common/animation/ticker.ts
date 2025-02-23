import { AnimationFrameRequester } from "./animationFrameRequester";

export class Ticker {
    private readonly req = new AnimationFrameRequester();

    constructor(readonly onFrame: (frameStep: number) => void) {

    }

    start() {
        this.stop();

        let lastTimeMS: number | undefined = undefined;
        
        const frame = (timeMS: DOMHighResTimeStamp) => {
            if (lastTimeMS != null) {
                let frameStep = (timeMS - lastTimeMS) / (1000 / 60);
                this.onFrame(frameStep);
            }
            lastTimeMS = timeMS;
            this.req.request(frame);
        };

        this.req.request(frame);
    }

    stop() {
        this.req.cancel();
    }
}
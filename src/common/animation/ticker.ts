import { AnimationFrameRequester } from "./animationFrameRequester";

export class Ticker {
    private readonly req = new AnimationFrameRequester();
    private isStart = false;

    constructor(readonly onFrame: (deltaSec: number) => void) {

    }

    start() {
        this.stop();
        this.isStart = true;

        let lastTimeMS: number | undefined = undefined;
        
        const frame = (timeMS: DOMHighResTimeStamp) => {
            if (lastTimeMS != null) {
                let deltaSec = (timeMS - lastTimeMS) / 1000;
                this.onFrame(deltaSec);
                if (!this.isStart) {
                    return;
                }
            }
            lastTimeMS = timeMS;
            this.req.request(frame);
        };

        this.req.request(frame);
    }

    stop() {
        this.isStart = false;
        this.req.cancel();
    }
}
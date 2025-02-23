export class AnimationFrameRequester {
    private handle?: number;

    constructor() {}

    request(callback: FrameRequestCallback): void {
        this.cancel();
        this.handle = window.requestAnimationFrame(time => {
            this.handle = undefined;
            callback(time);
        });
    }

    cancel(): void {
        if (this.handle != null) {
            window.cancelAnimationFrame(this.handle);
            this.handle = undefined;
        }
    }
}
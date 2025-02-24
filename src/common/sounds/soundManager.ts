class SoundManager {
    readonly audioContext = new AudioContext({ latencyHint: "interactive" });

    enable = false;

    constructor() {
        document.addEventListener("pointerdown", () => this.audioContext.resume(), true);
    }

    /** ボタンタップ音の再生 */
    playButtonTap() {
        if (!this.enable) { return; }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        // 音の設定
        oscillator.type = "sine";  // サイン波
        oscillator.frequency.setValueAtTime(1300, this.audioContext.currentTime);

        // ボリュームの設定
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        // 接続
        oscillator.connect(gainNode).connect(this.audioContext.destination);

        // 再生
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
        oscillator.onended = () => {
            oscillator.disconnect();
            gainNode.disconnect();
        }
    }
}

export const soundManager = new SoundManager();
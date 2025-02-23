export function formatLapTime(sec?: number): string {
    if (sec == null) { return "--'00.000"; }

    // 分と秒を計算
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    const milliseconds = Math.floor((sec % 1) * 1000);

    // フォーマット：分 ' 秒.ミリ秒
    return `${minutes}'${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}
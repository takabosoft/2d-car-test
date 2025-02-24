export function rndRange(v1: number, v2: number): number {
    const a = Math.random();
    return v1 * (1 - a) + v2 * a;
}
export function easeInOutQuintic(t: number): number {
    const ts = t * t;
    const tc = ts * t;
    return (6 * tc * ts + -15 * ts * ts + 10 * tc);
}

export function lerpNumber(a: number, b: number, d: number): number {
    return a * (1 - d) + b * d;
}

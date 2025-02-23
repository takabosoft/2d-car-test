import { Vec2 } from "planck/with-testbed";

export const degToRad = Math.PI / 180;
export const radToDeg = 180 / Math.PI;

export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
}

export function rotateVec2(vec: Vec2, angleRad: number) {
    return new Vec2(
        vec.x * Math.cos(angleRad) - vec.y * Math.sin(angleRad),
        vec.x * Math.sin(angleRad) + vec.y * Math.cos(angleRad));
}

export class Vec2 {
    constructor(readonly x: number, readonly y: number) {

    }

    scale(s: number): Vec2 { return new Vec2(this.x * s, this.y * s); }
    //minus(v: Vec2): Vec2 { return new Vec2(this.x - v.x, this.y - v.y); }

    /*static fromPointerEvent(e: PointerEvent, baseElement: JQuery): Vec2 {
        const baseOffset = baseElement.offset()!;
        return new Vec2(e.pageX - baseOffset.left, e.pageY - baseOffset.top);
    }*/
}
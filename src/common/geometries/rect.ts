import { Vec2 } from "./vec2";

export class Rect {
    constructor(readonly x: number, readonly y: number, readonly width: number, readonly height: number) { }

    get left() { return this.x; }
    get top() { return this.y; }
    get right() { return this.x + this.width; }
    get bottom() { return this.y + this.height; }
    get center() { return new Vec2((this.left + this.right) / 2, (this.top + this.bottom) / 2); }
    get size() { return new Vec2(this.width, this.height); }
    get isEmpty() { return this.width <= 0 || this.height <= 0; }

    offset(offset: Vec2): Rect {
        return new Rect(this.x + offset.x, this.y + offset.y, this.width, this.height);
    }

    scale(s: number): Rect {
        return new Rect(this.x * s, this.y * s, this.width * s, this.height * s);
    }

    deflate(params: { left?: number, top?: number, right?: number, bottom?: number, all?: number }): Rect {
        const def = params.all ?? 0;
        return Rect.fromLeftTopRightBottom(
            this.left + (params.left ?? def),
            this.top + (params.top ?? def),
            this.right - (params.right ?? def),
            this.bottom - (params.bottom ?? def),
        )
    }

    private objectPosition(objectSize: Vec2): Rect {
        return new Rect((this.width - objectSize.x) / 2, (this.top + this.bottom - objectSize.y) / 2, objectSize.x, objectSize.y);
    }

    objectFitContain(objectSize: Vec2): Rect {
        if (this.isEmpty) { return Rect.zero; }
        const scale = Math.min(this.width / objectSize.x, this.height / objectSize.y);
        const scaledSize = objectSize.scale(scale);
        return this.objectPosition(scaledSize);
    }

    /**
     * 他の矩形と重なっている部分（交差部分）を返します。
     * @param other 交差を確認する矩形
     * @returns 交差部分の矩形。交差がない場合は幅または高さが0の矩形を返します。
     */
    intersect(other: Rect): Rect {
        const left = Math.max(this.left, other.left);
        const top = Math.max(this.top, other.top);
        const right = Math.min(this.right, other.right);
        const bottom = Math.min(this.bottom, other.bottom);
        
        const width = Math.max(0, right - left);
        const height = Math.max(0, bottom - top);
        
        return new Rect(left, top, width, height);
    }

    /**
     * 他の矩形と自身を含む最小の矩形（包含矩形）を返します。
     * @param other 包含する他の矩形
     * @returns 2つの矩形を完全に含む最小の矩形
     */
    union(other: Rect): Rect {
        // どちらかが空の矩形の場合は特別処理
        if (this.isEmpty) { return other; }
        if (other.isEmpty) { return this; }
        
        const left = Math.min(this.left, other.left);
        const top = Math.min(this.top, other.top);
        const right = Math.max(this.right, other.right);
        const bottom = Math.max(this.bottom, other.bottom);
        
        const width = right - left;
        const height = bottom - top;
        
        return new Rect(left, top, width, height);
    }

    toString(): string { return `{ x: ${this.x}, y: ${this.y}, width: ${this.width}, height: ${this.height}}`; }

    static fromSize(size: Vec2): Rect {
        return new Rect(0, 0, size.x, size.y);
    }

    static fromLeftTopRightBottom(left: number, top: number, right: number, bottom: number) {
        return new Rect(left, top, right - left, bottom - top);
    }

    static fromOuterBounds(e: JQuery): Rect {
        return new Rect(0, 0, e.outerWidth() ?? 0, e.outerHeight() ?? 0);
    }

    /** 空の矩形インスタンスです。 */
    static readonly zero = new Rect(0, 0, 0, 0);
}
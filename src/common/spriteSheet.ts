import { Rect } from "./geometries/rect";
import { Vec2 } from "./geometries/vec2";
import { ImagePreloader } from "./utils/imagePreloader";
import { TinyCanvas } from "./utils/tinyCanvas";

export const spriteInfos = {
    car: new Rect(2, 2, 13, 16),
    asphalt: new Rect(18, 2, 23, 23),
    grass: new Rect(44, 2, 23, 23),
} as const;

class SpriteSheet {
    private readonly canvas = new TinyCanvas();
    async load() {
        const img = new ImagePreloader("./sprite_sheet.png?rev=0");
        await img.load();
        this.canvas.size = new Vec2(img.img[0].naturalWidth, img.img[0].naturalHeight);
        this.canvas.clear();
        this.canvas.ctx.drawImage(img.img[0], 0, 0);
    }

    crop(rc: Rect): TinyCanvas {
        const newCanvas = new TinyCanvas();
        newCanvas.size = rc.size;
        newCanvas.clear();
        newCanvas.ctx.drawImage(this.canvas.canvas, rc.left, rc.top, rc.width, rc.height, 0, 0, rc.width, rc.height);
        return newCanvas;
    }
}

export const spriteSheet = new SpriteSheet();
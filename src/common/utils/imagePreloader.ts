function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
}

async function urlToBase64(url: string): Promise<string> {
    const res = await fetch(url);
    if (!res.ok) {
        throw "error";
    }
    const blob = await res.blob();
    return await blobToBase64(blob);
}

export class ImagePreloader {
    private _img?: JQuery<HTMLImageElement>;

    constructor(private readonly url: string) { }

    load(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            const err = () => reject(`${this.url}の読み込みに失敗しました。`);
            try {
                const img = document.createElement("img");
                img.onload = () => {
                    img.width = img.naturalWidth;
                    img.height = img.naturalHeight;
                    this._img = $(img);
                    resolve();
                };
                img.onerror = () => err();
                img.src = await urlToBase64(this.url);

            } catch (e) {
                err();
            }
        });
    }

    /** 失敗は無い予定 */
    get img() {
        if (this._img == null) { throw "画像読み込みエラー"; }
        return this._img!;
    }
}
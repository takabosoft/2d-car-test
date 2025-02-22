/**
 * http://localhost:8080/course_tool.html
 */

import { parsePath } from "path-data-parser";

declare namespace ImageTracer {
    // オプションの型定義
    interface Options {
        scale?: number;
        colorsampling?: number;
        numberofcolors?: number;
        strokewidth?: number;
        linefilter?: boolean;
        pathomit?: number;
        roundcoords?: number;
        pal?: { r: number; g: number; b: number; a: number }[];
        layering?: boolean;
        blurradius?: number;
        blurdelta?: number;
    }

    /**
     * 画像を SVG に変換
     * @param imageURL 変換する画像のURL
     * @param callback 変換後のSVG文字列を受け取る関数
     * @param options 変換オプション（省略可能）
     */
    function imageToSVG(
        imageURL: string,
        callback: (svgString: string) => void,
        options?: Options
    ): void;
}

$(() => {
    console.log("course_tool");

    $("#courseFile").on("change", e => {
        const files = (e.target as HTMLInputElement).files;
        if (files != null && files.length > 0) {
            const reader = new FileReader();
            reader.onload = e => {
                const base64str = e.target!.result as string;
                ($("#img")[0] as HTMLImageElement).src = base64str;
                ImageTracer.imageToSVG(
                    base64str, 
                    svg => {
                        //console.log("svg", svg);
                        const svgEl = $(svg);
                        $("#res").empty().append(svgEl);
                        procSvg(svgEl);
                    }, 
                    {
                        linefilter: true,  // 直線化フィルターを有効化
                        pathomit: 300,      // 小さなパスを省略（ノイズを減らす）
                        roundcoords: 0,    // 座標を整数化（滑らかさを減らす）
                    }
                )
            };
            reader.readAsDataURL(files[0]);
        }
    });
});

function procSvg(svg: JQuery) {
    let result: string = "";

    svg.find("path").each((i, path) => {
        const pathEl = $(path);
        if (pathEl.attr("opacity") == "0") { return; }

        
        let points: [number, number][] = [];

        const min = 5;
        const addPoint = (xy: [number, number]) => {
            points.push(xy);
        };
        const pathFinish = () => {
            if (points.length > 0) {
                result += "\npath: " + JSON.stringify(points);
                points = [];
            }
        }

        const segments = parsePath(pathEl.attr("d") + "");
        for (const seg of segments) {
            switch (seg.key) {
                case "M":
                    pathFinish();
                    break;
                case "L":
                    addPoint([seg.data[0], seg.data[1]])
                    break;
                case "Q":
                    addPoint([seg.data[2], seg.data[3]])
                    break;
                case "Z":
                    if (points.length > 0) {
                        addPoint(points[0]);
                    }
                    pathFinish();
                    break;
                default:
                    console.error("不明なパス要素");
                    break;
            }
        }


    })

    $("#textarea").val(result)
}
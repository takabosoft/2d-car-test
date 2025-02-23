/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/path-data-parser/lib/absolutize.js":
/*!*********************************************************!*\
  !*** ./node_modules/path-data-parser/lib/absolutize.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   absolutize: () => (/* binding */ absolutize)\n/* harmony export */ });\n// Translate relative commands to absolute commands\nfunction absolutize(segments) {\n    let cx = 0, cy = 0;\n    let subx = 0, suby = 0;\n    const out = [];\n    for (const { key, data } of segments) {\n        switch (key) {\n            case 'M':\n                out.push({ key: 'M', data: [...data] });\n                [cx, cy] = data;\n                [subx, suby] = data;\n                break;\n            case 'm':\n                cx += data[0];\n                cy += data[1];\n                out.push({ key: 'M', data: [cx, cy] });\n                subx = cx;\n                suby = cy;\n                break;\n            case 'L':\n                out.push({ key: 'L', data: [...data] });\n                [cx, cy] = data;\n                break;\n            case 'l':\n                cx += data[0];\n                cy += data[1];\n                out.push({ key: 'L', data: [cx, cy] });\n                break;\n            case 'C':\n                out.push({ key: 'C', data: [...data] });\n                cx = data[4];\n                cy = data[5];\n                break;\n            case 'c': {\n                const newdata = data.map((d, i) => (i % 2) ? (d + cy) : (d + cx));\n                out.push({ key: 'C', data: newdata });\n                cx = newdata[4];\n                cy = newdata[5];\n                break;\n            }\n            case 'Q':\n                out.push({ key: 'Q', data: [...data] });\n                cx = data[2];\n                cy = data[3];\n                break;\n            case 'q': {\n                const newdata = data.map((d, i) => (i % 2) ? (d + cy) : (d + cx));\n                out.push({ key: 'Q', data: newdata });\n                cx = newdata[2];\n                cy = newdata[3];\n                break;\n            }\n            case 'A':\n                out.push({ key: 'A', data: [...data] });\n                cx = data[5];\n                cy = data[6];\n                break;\n            case 'a':\n                cx += data[5];\n                cy += data[6];\n                out.push({ key: 'A', data: [data[0], data[1], data[2], data[3], data[4], cx, cy] });\n                break;\n            case 'H':\n                out.push({ key: 'H', data: [...data] });\n                cx = data[0];\n                break;\n            case 'h':\n                cx += data[0];\n                out.push({ key: 'H', data: [cx] });\n                break;\n            case 'V':\n                out.push({ key: 'V', data: [...data] });\n                cy = data[0];\n                break;\n            case 'v':\n                cy += data[0];\n                out.push({ key: 'V', data: [cy] });\n                break;\n            case 'S':\n                out.push({ key: 'S', data: [...data] });\n                cx = data[2];\n                cy = data[3];\n                break;\n            case 's': {\n                const newdata = data.map((d, i) => (i % 2) ? (d + cy) : (d + cx));\n                out.push({ key: 'S', data: newdata });\n                cx = newdata[2];\n                cy = newdata[3];\n                break;\n            }\n            case 'T':\n                out.push({ key: 'T', data: [...data] });\n                cx = data[0];\n                cy = data[1];\n                break;\n            case 't':\n                cx += data[0];\n                cy += data[1];\n                out.push({ key: 'T', data: [cx, cy] });\n                break;\n            case 'Z':\n            case 'z':\n                out.push({ key: 'Z', data: [] });\n                cx = subx;\n                cy = suby;\n                break;\n        }\n    }\n    return out;\n}\n\n\n//# sourceURL=webpack://2d-car-test/./node_modules/path-data-parser/lib/absolutize.js?");

/***/ }),

/***/ "./node_modules/path-data-parser/lib/index.js":
/*!****************************************************!*\
  !*** ./node_modules/path-data-parser/lib/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   absolutize: () => (/* reexport safe */ _absolutize_js__WEBPACK_IMPORTED_MODULE_1__.absolutize),\n/* harmony export */   normalize: () => (/* reexport safe */ _normalize_js__WEBPACK_IMPORTED_MODULE_2__.normalize),\n/* harmony export */   parsePath: () => (/* reexport safe */ _parser_js__WEBPACK_IMPORTED_MODULE_0__.parsePath),\n/* harmony export */   serialize: () => (/* reexport safe */ _parser_js__WEBPACK_IMPORTED_MODULE_0__.serialize)\n/* harmony export */ });\n/* harmony import */ var _parser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parser.js */ \"./node_modules/path-data-parser/lib/parser.js\");\n/* harmony import */ var _absolutize_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./absolutize.js */ \"./node_modules/path-data-parser/lib/absolutize.js\");\n/* harmony import */ var _normalize_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./normalize.js */ \"./node_modules/path-data-parser/lib/normalize.js\");\n\n\n\n\n\n//# sourceURL=webpack://2d-car-test/./node_modules/path-data-parser/lib/index.js?");

/***/ }),

/***/ "./node_modules/path-data-parser/lib/normalize.js":
/*!********************************************************!*\
  !*** ./node_modules/path-data-parser/lib/normalize.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   normalize: () => (/* binding */ normalize)\n/* harmony export */ });\n// Normalize path to include only M, L, C, and Z commands\nfunction normalize(segments) {\n    const out = [];\n    let lastType = '';\n    let cx = 0, cy = 0;\n    let subx = 0, suby = 0;\n    let lcx = 0, lcy = 0;\n    for (const { key, data } of segments) {\n        switch (key) {\n            case 'M':\n                out.push({ key: 'M', data: [...data] });\n                [cx, cy] = data;\n                [subx, suby] = data;\n                break;\n            case 'C':\n                out.push({ key: 'C', data: [...data] });\n                cx = data[4];\n                cy = data[5];\n                lcx = data[2];\n                lcy = data[3];\n                break;\n            case 'L':\n                out.push({ key: 'L', data: [...data] });\n                [cx, cy] = data;\n                break;\n            case 'H':\n                cx = data[0];\n                out.push({ key: 'L', data: [cx, cy] });\n                break;\n            case 'V':\n                cy = data[0];\n                out.push({ key: 'L', data: [cx, cy] });\n                break;\n            case 'S': {\n                let cx1 = 0, cy1 = 0;\n                if (lastType === 'C' || lastType === 'S') {\n                    cx1 = cx + (cx - lcx);\n                    cy1 = cy + (cy - lcy);\n                }\n                else {\n                    cx1 = cx;\n                    cy1 = cy;\n                }\n                out.push({ key: 'C', data: [cx1, cy1, ...data] });\n                lcx = data[0];\n                lcy = data[1];\n                cx = data[2];\n                cy = data[3];\n                break;\n            }\n            case 'T': {\n                const [x, y] = data;\n                let x1 = 0, y1 = 0;\n                if (lastType === 'Q' || lastType === 'T') {\n                    x1 = cx + (cx - lcx);\n                    y1 = cy + (cy - lcy);\n                }\n                else {\n                    x1 = cx;\n                    y1 = cy;\n                }\n                const cx1 = cx + 2 * (x1 - cx) / 3;\n                const cy1 = cy + 2 * (y1 - cy) / 3;\n                const cx2 = x + 2 * (x1 - x) / 3;\n                const cy2 = y + 2 * (y1 - y) / 3;\n                out.push({ key: 'C', data: [cx1, cy1, cx2, cy2, x, y] });\n                lcx = x1;\n                lcy = y1;\n                cx = x;\n                cy = y;\n                break;\n            }\n            case 'Q': {\n                const [x1, y1, x, y] = data;\n                const cx1 = cx + 2 * (x1 - cx) / 3;\n                const cy1 = cy + 2 * (y1 - cy) / 3;\n                const cx2 = x + 2 * (x1 - x) / 3;\n                const cy2 = y + 2 * (y1 - y) / 3;\n                out.push({ key: 'C', data: [cx1, cy1, cx2, cy2, x, y] });\n                lcx = x1;\n                lcy = y1;\n                cx = x;\n                cy = y;\n                break;\n            }\n            case 'A': {\n                const r1 = Math.abs(data[0]);\n                const r2 = Math.abs(data[1]);\n                const angle = data[2];\n                const largeArcFlag = data[3];\n                const sweepFlag = data[4];\n                const x = data[5];\n                const y = data[6];\n                if (r1 === 0 || r2 === 0) {\n                    out.push({ key: 'C', data: [cx, cy, x, y, x, y] });\n                    cx = x;\n                    cy = y;\n                }\n                else {\n                    if (cx !== x || cy !== y) {\n                        const curves = arcToCubicCurves(cx, cy, x, y, r1, r2, angle, largeArcFlag, sweepFlag);\n                        curves.forEach(function (curve) {\n                            out.push({ key: 'C', data: curve });\n                        });\n                        cx = x;\n                        cy = y;\n                    }\n                }\n                break;\n            }\n            case 'Z':\n                out.push({ key: 'Z', data: [] });\n                cx = subx;\n                cy = suby;\n                break;\n        }\n        lastType = key;\n    }\n    return out;\n}\nfunction degToRad(degrees) {\n    return (Math.PI * degrees) / 180;\n}\nfunction rotate(x, y, angleRad) {\n    const X = x * Math.cos(angleRad) - y * Math.sin(angleRad);\n    const Y = x * Math.sin(angleRad) + y * Math.cos(angleRad);\n    return [X, Y];\n}\nfunction arcToCubicCurves(x1, y1, x2, y2, r1, r2, angle, largeArcFlag, sweepFlag, recursive) {\n    const angleRad = degToRad(angle);\n    let params = [];\n    let f1 = 0, f2 = 0, cx = 0, cy = 0;\n    if (recursive) {\n        [f1, f2, cx, cy] = recursive;\n    }\n    else {\n        [x1, y1] = rotate(x1, y1, -angleRad);\n        [x2, y2] = rotate(x2, y2, -angleRad);\n        const x = (x1 - x2) / 2;\n        const y = (y1 - y2) / 2;\n        let h = (x * x) / (r1 * r1) + (y * y) / (r2 * r2);\n        if (h > 1) {\n            h = Math.sqrt(h);\n            r1 = h * r1;\n            r2 = h * r2;\n        }\n        const sign = (largeArcFlag === sweepFlag) ? -1 : 1;\n        const r1Pow = r1 * r1;\n        const r2Pow = r2 * r2;\n        const left = r1Pow * r2Pow - r1Pow * y * y - r2Pow * x * x;\n        const right = r1Pow * y * y + r2Pow * x * x;\n        const k = sign * Math.sqrt(Math.abs(left / right));\n        cx = k * r1 * y / r2 + (x1 + x2) / 2;\n        cy = k * -r2 * x / r1 + (y1 + y2) / 2;\n        f1 = Math.asin(parseFloat(((y1 - cy) / r2).toFixed(9)));\n        f2 = Math.asin(parseFloat(((y2 - cy) / r2).toFixed(9)));\n        if (x1 < cx) {\n            f1 = Math.PI - f1;\n        }\n        if (x2 < cx) {\n            f2 = Math.PI - f2;\n        }\n        if (f1 < 0) {\n            f1 = Math.PI * 2 + f1;\n        }\n        if (f2 < 0) {\n            f2 = Math.PI * 2 + f2;\n        }\n        if (sweepFlag && f1 > f2) {\n            f1 = f1 - Math.PI * 2;\n        }\n        if (!sweepFlag && f2 > f1) {\n            f2 = f2 - Math.PI * 2;\n        }\n    }\n    let df = f2 - f1;\n    if (Math.abs(df) > (Math.PI * 120 / 180)) {\n        const f2old = f2;\n        const x2old = x2;\n        const y2old = y2;\n        if (sweepFlag && f2 > f1) {\n            f2 = f1 + (Math.PI * 120 / 180) * (1);\n        }\n        else {\n            f2 = f1 + (Math.PI * 120 / 180) * (-1);\n        }\n        x2 = cx + r1 * Math.cos(f2);\n        y2 = cy + r2 * Math.sin(f2);\n        params = arcToCubicCurves(x2, y2, x2old, y2old, r1, r2, angle, 0, sweepFlag, [f2, f2old, cx, cy]);\n    }\n    df = f2 - f1;\n    const c1 = Math.cos(f1);\n    const s1 = Math.sin(f1);\n    const c2 = Math.cos(f2);\n    const s2 = Math.sin(f2);\n    const t = Math.tan(df / 4);\n    const hx = 4 / 3 * r1 * t;\n    const hy = 4 / 3 * r2 * t;\n    const m1 = [x1, y1];\n    const m2 = [x1 + hx * s1, y1 - hy * c1];\n    const m3 = [x2 + hx * s2, y2 - hy * c2];\n    const m4 = [x2, y2];\n    m2[0] = 2 * m1[0] - m2[0];\n    m2[1] = 2 * m1[1] - m2[1];\n    if (recursive) {\n        return [m2, m3, m4].concat(params);\n    }\n    else {\n        params = [m2, m3, m4].concat(params);\n        const curves = [];\n        for (let i = 0; i < params.length; i += 3) {\n            const r1 = rotate(params[i][0], params[i][1], angleRad);\n            const r2 = rotate(params[i + 1][0], params[i + 1][1], angleRad);\n            const r3 = rotate(params[i + 2][0], params[i + 2][1], angleRad);\n            curves.push([r1[0], r1[1], r2[0], r2[1], r3[0], r3[1]]);\n        }\n        return curves;\n    }\n}\n\n\n//# sourceURL=webpack://2d-car-test/./node_modules/path-data-parser/lib/normalize.js?");

/***/ }),

/***/ "./node_modules/path-data-parser/lib/parser.js":
/*!*****************************************************!*\
  !*** ./node_modules/path-data-parser/lib/parser.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   parsePath: () => (/* binding */ parsePath),\n/* harmony export */   serialize: () => (/* binding */ serialize)\n/* harmony export */ });\nconst COMMAND = 0;\nconst NUMBER = 1;\nconst EOD = 2;\nconst PARAMS = { A: 7, a: 7, C: 6, c: 6, H: 1, h: 1, L: 2, l: 2, M: 2, m: 2, Q: 4, q: 4, S: 4, s: 4, T: 2, t: 2, V: 1, v: 1, Z: 0, z: 0 };\nfunction tokenize(d) {\n    const tokens = new Array();\n    while (d !== '') {\n        if (d.match(/^([ \\t\\r\\n,]+)/)) {\n            d = d.substr(RegExp.$1.length);\n        }\n        else if (d.match(/^([aAcChHlLmMqQsStTvVzZ])/)) {\n            tokens[tokens.length] = { type: COMMAND, text: RegExp.$1 };\n            d = d.substr(RegExp.$1.length);\n        }\n        else if (d.match(/^(([-+]?[0-9]+(\\.[0-9]*)?|[-+]?\\.[0-9]+)([eE][-+]?[0-9]+)?)/)) {\n            tokens[tokens.length] = { type: NUMBER, text: `${parseFloat(RegExp.$1)}` };\n            d = d.substr(RegExp.$1.length);\n        }\n        else {\n            return [];\n        }\n    }\n    tokens[tokens.length] = { type: EOD, text: '' };\n    return tokens;\n}\nfunction isType(token, type) {\n    return token.type === type;\n}\nfunction parsePath(d) {\n    const segments = [];\n    const tokens = tokenize(d);\n    let mode = 'BOD';\n    let index = 0;\n    let token = tokens[index];\n    while (!isType(token, EOD)) {\n        let paramsCount = 0;\n        const params = [];\n        if (mode === 'BOD') {\n            if (token.text === 'M' || token.text === 'm') {\n                index++;\n                paramsCount = PARAMS[token.text];\n                mode = token.text;\n            }\n            else {\n                return parsePath('M0,0' + d);\n            }\n        }\n        else if (isType(token, NUMBER)) {\n            paramsCount = PARAMS[mode];\n        }\n        else {\n            index++;\n            paramsCount = PARAMS[token.text];\n            mode = token.text;\n        }\n        if ((index + paramsCount) < tokens.length) {\n            for (let i = index; i < index + paramsCount; i++) {\n                const numbeToken = tokens[i];\n                if (isType(numbeToken, NUMBER)) {\n                    params[params.length] = +numbeToken.text;\n                }\n                else {\n                    throw new Error('Param not a number: ' + mode + ',' + numbeToken.text);\n                }\n            }\n            if (typeof PARAMS[mode] === 'number') {\n                const segment = { key: mode, data: params };\n                segments.push(segment);\n                index += paramsCount;\n                token = tokens[index];\n                if (mode === 'M')\n                    mode = 'L';\n                if (mode === 'm')\n                    mode = 'l';\n            }\n            else {\n                throw new Error('Bad segment: ' + mode);\n            }\n        }\n        else {\n            throw new Error('Path data ended short');\n        }\n    }\n    return segments;\n}\nfunction serialize(segments) {\n    const tokens = [];\n    for (const { key, data } of segments) {\n        tokens.push(key);\n        switch (key) {\n            case 'C':\n            case 'c':\n                tokens.push(data[0], `${data[1]},`, data[2], `${data[3]},`, data[4], data[5]);\n                break;\n            case 'S':\n            case 's':\n            case 'Q':\n            case 'q':\n                tokens.push(data[0], `${data[1]},`, data[2], data[3]);\n                break;\n            default:\n                tokens.push(...data);\n                break;\n        }\n    }\n    return tokens.join(' ');\n}\n\n\n//# sourceURL=webpack://2d-car-test/./node_modules/path-data-parser/lib/parser.js?");

/***/ }),

/***/ "./src/course_tool/course_tool.ts":
/*!****************************************!*\
  !*** ./src/course_tool/course_tool.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n/**\n * http://localhost:8080/course_tool.html\n */\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst path_data_parser_1 = __webpack_require__(/*! path-data-parser */ \"./node_modules/path-data-parser/lib/index.js\");\n$(() => {\n    console.log(\"course_tool\");\n    $(\"#courseFile\").on(\"change\", e => {\n        const files = e.target.files;\n        if (files != null && files.length > 0) {\n            const reader = new FileReader();\n            reader.onload = e => {\n                const base64str = e.target.result;\n                $(\"#img\")[0].src = base64str;\n                ImageTracer.imageToSVG(base64str, svg => {\n                    //console.log(\"svg\", svg);\n                    const svgEl = $(svg);\n                    $(\"#res\").empty().append(svgEl);\n                    procSvg(svgEl);\n                }, {\n                    linefilter: true, // 直線化フィルターを有効化\n                    pathomit: 300, // 小さなパスを省略（ノイズを減らす）\n                    roundcoords: 0, // 座標を整数化（滑らかさを減らす）\n                });\n            };\n            reader.readAsDataURL(files[0]);\n        }\n    });\n});\nfunction procSvg(svg) {\n    let result = \"\";\n    svg.find(\"path\").each((i, path) => {\n        const pathEl = $(path);\n        if (pathEl.attr(\"opacity\") == \"0\") {\n            return;\n        }\n        let points = [];\n        const min = 5;\n        const addPoint = (xy) => {\n            points.push(xy);\n        };\n        const pathFinish = () => {\n            if (points.length > 0) {\n                result += \"\\npath: \" + JSON.stringify(points);\n                points = [];\n            }\n        };\n        const segments = (0, path_data_parser_1.parsePath)(pathEl.attr(\"d\") + \"\");\n        for (const seg of segments) {\n            switch (seg.key) {\n                case \"M\":\n                    pathFinish();\n                    break;\n                case \"L\":\n                    addPoint([seg.data[0], seg.data[1]]);\n                    break;\n                case \"Q\":\n                    addPoint([seg.data[2], seg.data[3]]);\n                    break;\n                case \"Z\":\n                    if (points.length > 0) {\n                        addPoint(points[0]);\n                    }\n                    pathFinish();\n                    break;\n                default:\n                    console.error(\"不明なパス要素\");\n                    break;\n            }\n        }\n    });\n    $(\"#textarea\").val(result);\n}\n\n\n//# sourceURL=webpack://2d-car-test/./src/course_tool/course_tool.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/course_tool/course_tool.ts");
/******/ 	
/******/ })()
;
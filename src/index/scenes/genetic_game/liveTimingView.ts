import { Component } from "../../../common/components/component";
import { formatLapTime } from "../../../common/utils/lapTimeFormatter";
import { Robot } from "./robot";

export class LiveTimingView extends Component{
    lapTimeCache = new Map<Robot, number | undefined>();
    lastUpdateSec = 0;

    constructor() {
        super();
        this.element = $(`<div class="live-timing-view">`);
    }

    clearCache() {
        this.lapTimeCache.clear();
    }

    update(robots: Robot[], totalSec: number) {
        // 差分があるか調べます
        if (!robots.some(r => !this.lapTimeCache.has(r) || this.lapTimeCache.get(r) != r.car.bestLapTime)) {
            return;
        }
        this.lastUpdateSec = totalSec;
        this.clearCache();
        robots.forEach(r => this.lapTimeCache.set(r, r.car.bestLapTime));

        
        const frag = document.createDocumentFragment();
        const sorted = [...robots].sort((r1, r2) => (r1.car.bestLapTime ?? Number.MAX_VALUE) - (r2.car.bestLapTime ?? Number.MAX_VALUE));
        sorted.forEach(r1 => {
            const rank = robots.reduce((rank, r2) => (r1.car.bestLapTime ?? Number.MAX_VALUE) > (r2.car.bestLapTime ?? Number.MAX_VALUE) ? rank + 1: rank, 1);
            $(`<div>`).text(rank).appendTo(frag);
            $(`<div>`).text(r1.robotDriver.gene.name).appendTo(frag);
            $(`<div>`).text(formatLapTime(r1.car.bestLapTime)).appendTo(frag);
        });
        this.element.empty().append(frag);
    }
}
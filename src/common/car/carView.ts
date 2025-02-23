import { Component } from "../components/component";
import { spriteInfos, spriteSheet } from "../spriteSheet";

export class CarView extends Component {
    constructor() {
        super();
        this.element = $(`<div class="car">`).append(
            $(spriteSheet.crop(spriteInfos.car).canvas).addClass("body"),
        )
    }
}
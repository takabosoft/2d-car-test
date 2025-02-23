import { Component } from "../../common/components/component";

export class Scene extends Component {
    constructor(addClass: string) {
        super();
        this.element = $(`<div class="scene">`).addClass(addClass);
    }

    /** 画面が切り替わり終わったときに呼ばれます。 */
    onStartScene(): void {

    }

    /** 画面が消えるときに呼ばれます。 */
    onEndScene(): void {

    }
}

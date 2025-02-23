import { Edge, Vec2, World } from "planck/with-testbed";
import { FilterCategory } from "../env";

export class CheckPoint {
    constructor(world: World, checkPoint: [Vec2, Vec2], readonly index: number) {
        const body = world.createBody({})
        body.createFixture({
            shape: new Edge(checkPoint[0], checkPoint[1]),
            isSensor: true,
            filterCategoryBits: FilterCategory.Wall,
            userData: this,
        })
    }
}
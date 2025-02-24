import { World } from "planck";
import { RobotDriver } from "../../../common/drivers/robotDriver";
import { Car } from "../../../common/car/car";
import { CarView } from "../../../common/car/carView";
import { RobotGene } from "../../../common/drivers/robotGene";

export class Robot {
    readonly robotDriver: RobotDriver;
    readonly car: Car;
    readonly carView: CarView;

    constructor(world: World, gene: RobotGene) {
        this.robotDriver = new RobotDriver(gene);
        this.car = new Car(world, this.robotDriver.controlState);
        this.carView = new CarView(this.robotDriver.gene.color, this.robotDriver.gene.name);
    }

    destroy() {
        this.car.destroy();
        this.carView.destroy();
    }
}
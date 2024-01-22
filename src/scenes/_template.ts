import { Application, Container } from "pixi.js";
import { _Scene } from "../components/_createScene";

export class _Template {
    /* 変えない変数 */
    public name: string;
    public scene: _Scene;
    public app: Application | Container;
    public container: Container;

    /* 随時追加 */

    constructor(app: Application | Container) {
        this.name = "template";
        this.app = app;
    }

    public init() {
        if (this.app instanceof Application) {
            this.app.stage.addChild(this.container);
        } else {
            this.app.addChild(this.container);
        }
    }

    public render(delta: number) {
        this.scene.renderer((delta: number) => {
        }, delta);
      }
}
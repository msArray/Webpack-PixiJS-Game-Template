import { Container, Application } from 'pixi.js';

export class _Scene {
    private app: Application;
    public container: Container;

    constructor(app: Application) {
        this.app = app;
        this.container = new Container();
        this.app.stage.addChild(this.container);
        return this;
    }

    public renderer(rende: (delta: number) => void, delta: number) {
        this.app.renderer.render(this.container);
        rende(delta);
    }
}

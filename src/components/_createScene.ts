import { Container, Application, IRenderableObject, Renderer } from 'pixi.js';

export class _Scene {
    public app: Application | Container;

    constructor(app: Application | Container) {
        this.app = app;

        this.init();

        return this;
    }

    public init() {
        return this;
    }

    public renderer() {
        return this;
    }
}

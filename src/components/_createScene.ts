import { Container, Application, IRenderableObject, Renderer } from 'pixi.js';

export class _Scene {
    private app: Application | Container;
    public container: Container;

    constructor(app: Application | Container) {
        this.app = app;
        this.container = new Container();

        if (this.app instanceof Application){
            this.app.stage.addChild(this.container);
        }else{
            this.app.addChild(this.container);
        }
        return this;
    }

    public renderer(rende: (delta: number) => void, delta: number) {
        if (this.app instanceof Application){
            this.app.renderer.render(this.container);
        }else{
            this.app.render((this.container as any));
        }
        rende(delta);
    }
}

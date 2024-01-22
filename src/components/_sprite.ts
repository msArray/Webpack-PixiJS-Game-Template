import { Application, Texture, Sprite, TextureSource, Container } from "pixi.js";
import { _quality, _mouse } from "../index";

export class _Sprite {
    private app: Application | Container;
    public textureSource: TextureSource;
    public texture: Texture;
    public sprite: Sprite;
    public size: number;

    constructor(app: Application | Container, textureSource: TextureSource) {
        this.app = app;
        this.textureSource = textureSource;
        this.texture = Texture.from(this.textureSource);
        this.sprite = new Sprite(this.texture);
        this.sprite.anchor.set(0.5);
        this.size = 1;
        this.sprite.scale.set(this.size * _quality / 100, this.size * _quality / 100);
        if(this.app instanceof Application) {
            this.app.stage.addChild(this.sprite);
        }else{
            this.app.addChild(this.sprite);
        }
    }

    public renderer(delta: number) {
    }


    public setPosition(x: number, y: number) {
        this.sprite.x = x;
        this.sprite.y = y;

        return this;
    }
}
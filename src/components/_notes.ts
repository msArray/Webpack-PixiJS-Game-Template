import { Application, Texture, Sprite } from "pixi.js";
import { _quality, _mouse } from "../index";
import { tweURL } from "../utils/utils";

export class _Note {
    private app: Application;
    private twemojiCode: string;
    private textureURL: string;
    private texture: Texture;
    private sprite: Sprite;
    private size: number;

    constructor(app: Application) {
        this.app = app;
        this.twemojiCode = "1f535";
        this.textureURL = tweURL(this.twemojiCode);
        this.texture = Texture.from(this.textureURL);
        this.sprite = new Sprite(this.texture);
        this.sprite.anchor.set(0.5);
        this.size = 1;
        this.sprite.scale.set(this.size * _quality / 100, this.size * _quality / 100);
        this.app.stage.addChild(this.sprite);
    }

    public renderer(delta: number) {
        this.twemojiCode = (_mouse.isClick ? "1f534" : "1f535");
        this.textureURL = tweURL(this.twemojiCode);
        this.texture = Texture.from(this.textureURL);
        this.sprite.texture = this.texture;
        //console.log(this.mouse);
        this.sprite.x = _mouse.x;
        this.sprite.y = _mouse.y;
    }


    public setPosition(x: number, y: number) {
        this.sprite.x = x;
        this.sprite.y = y;

        return this;
    }
}
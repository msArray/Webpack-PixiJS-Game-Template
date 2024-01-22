import { Application, Texture, Sprite, Container, TextureSource } from "pixi.js";
import { _quality } from "../index";

export class _Button {
    private app: Application | Container;
    private isScene: boolean = false;
    public textureE: TextureSource;
    public texture: Texture;
    public sprite: Sprite;
    public size: number;


    /* State */

    public isClick: boolean = false;
    public isHover: boolean = false;

    // Events
    private onClick?: () => void;
    private onHover?: () => void;

    constructor(app: Application | Container, textureE: TextureSource) {
        this.app = app;
        this.textureE = textureE;
        this.texture = Texture.from(this.textureE); // テクスチャ読み込み
        this.sprite = new Sprite(this.texture); // sprite作成
        this.sprite.anchor.set(0.5); // 中心点を中心に
        this.sprite.interactive = true; // interactiveを有効に
        this.size = 1; // サイズ(倍率)
        this.sprite.scale.set(this.size * _quality / 100, this.size * _quality / 100);
        this.sprite.alpha = 0;
        if (this.app instanceof Application) {
            this.app.stage.addChild(this.sprite);
        } else {
            this.app.addChild(this.sprite);
        }

        this.Actions();
    }

    public renderer(delta: number) {
        this.sprite.alpha = 1;
        this.isScene = true;
    }

    private Actions() {
        this.sprite.on("pointerdown", () => {
            if(!this.isScene) return;
            this.isClick = true;
            this.onClick();
        });


        this.sprite.on("pointerup", () => {
            if(!this.isScene) return;
            this.isClick = false;
        });

        this.sprite.on("mouseover", () => {
            if(!this.isScene) return;
            this.isHover = true;
            this.onHover();
        });

        this.sprite.on("mouseout", () => {
            if(!this.isScene) return;
            this.isHover = false;
        });
    }

    public setPosition(x: number, y: number) {
        this.sprite.x = x;
        this.sprite.y = y;

        return this;
    }

    /* Event Set */
    public setOnClick(callback: () => void) {
        this.onClick = callback;

        return this;
    }

    public setOnMouseOver(callback: () => void) {
        this.onHover = callback;

        return this;
    }
}
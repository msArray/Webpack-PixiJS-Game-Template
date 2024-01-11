import { Application, Texture, Sprite } from "pixi.js";
import { _quality } from "../index";

export class _Button {
    private app: Application;
    private textureURL: string;
    private texture: Texture;
    private sprite: Sprite;
    private size: number;


    /* State */

    public isClick: boolean = false;
    public isHover: boolean = false;

    // Events
    private onClick?: () => void;
    private onHover?: () => void;

    constructor(app: Application, textureURL: string) {
        this.app = app;
        this.textureURL = textureURL;
        this.texture = Texture.from(this.textureURL); // テクスチャ読み込み
        this.sprite = new Sprite(this.texture); // sprite作成
        this.sprite.anchor.set(0.5); // 中心点を中心に
        this.sprite.interactive = true; // interactiveを有効に
        this.size = 1; // サイズ(倍率)
        this.sprite.scale.set(this.size * _quality / 100, this.size * _quality / 100);
        this.app.stage.addChild(this.sprite);

        this.sprite.on("pointerdown", () => {
            this.isClick = true;
            this.onClick();
        });

        this.sprite.on("pointerup", () => {
            this.isClick = false;
        });

        this.sprite.on("mouseover", () => {
            this.isHover = true;
            this.onHover();
        });

        this.sprite.on("mouseout", () => {
            this.isHover = false;
        });
    }

    public renderer(delta: number) {
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
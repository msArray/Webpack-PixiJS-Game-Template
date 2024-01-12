// PixiJSを読み込み
import { Application } from 'pixi.js';
import { _Note } from "./components/_notes";
import { _Button } from "./components/_button";
import { _MouseEffect, _ClickEffect } from "./components/_mouseEffect";
import { _Scene } from "./components/_createScene";
import { tweURL } from './utils/utils';

// 基本設定
const AspectRadio = { vertical: 9, horizontal: 16 }; // ゲームのアスペクト比 vertical 縦:horizontal 横
const _quality = 400;

class Game {
    // 初期変数
    public app: Application;
    public mouse: {
        x: number,
        y: number,
        isClick: boolean,
        onClick?: (callback: () => void) => void,
    } = {
            x: 0,
            y: 0,
            isClick: false,
        };

    // スプライト
    private Ball: _Note;
    private button: _Button;
    private mouseEffect: _MouseEffect;
    private clickEffect: _ClickEffect[] = [];

    // シーン
    private testscene: _Scene;

    constructor() {
        this.__init();
        this._load();
        this.app.ticker.add((delta: number) => {
            this._main(delta);
        })
    }

    /* 初期化 */
    private __init() {
        // ステージを作る
        this.app = new Application({
            width: _quality * AspectRadio.horizontal,
            height: _quality * AspectRadio.vertical,
            backgroundColor: 0xffffff
        })
        document.body.appendChild((this.app.view as HTMLCanvasElement));
        this._mouse();
        this._resizer();
        window.addEventListener("resize", () => {
            this._resizer();
        });
    }

    private _resizer() {
        if (window.innerHeight / AspectRadio.vertical > window.innerWidth / AspectRadio.horizontal) {
            (this.app.view as HTMLCanvasElement).style.scale = `${window.innerWidth / (_quality * AspectRadio.horizontal)}`;
        } else {
            (this.app.view as HTMLCanvasElement).style.scale = `${window.innerHeight / (_quality * AspectRadio.vertical)}`;
        }
    }

    public _mouse() {
        window.addEventListener("mousemove", (event: MouseEvent) => {
            /* Y座標 */
            this.mouse.y = event.clientY - ((window.innerHeight - (this.app.view.height * (this.app.view as any).style.scale)) / 2); // キャンバスの上からのマウスのY座標を取得
            this.mouse.y = this.mouse.y / (this.app.view as any).style.scale; // キャンバスの拡大率を使い、キャンバスの座標に変換
            this.mouse.y = (this.mouse.y < 0 ? 0 : this.mouse.y); // 下限値 0
            this.mouse.y = (this.mouse.y > this.app.view.height ? this.app.view.height : this.mouse.y); // 上限値をキャンバスの高さに
            /* X座標 */
            this.mouse.x = event.clientX - ((window.innerWidth - (this.app.view.width * (this.app.view as any).style.scale)) / 2); // キャンバスの左からのマウスのX座標を取得
            this.mouse.x = this.mouse.x / (this.app.view as any).style.scale; // キャンバスの拡大率を使い、キャンバスの座標に変換
            this.mouse.x = (this.mouse.x < 0 ? 0 : this.mouse.x); // 下限値 0
            this.mouse.x = (this.mouse.x > this.app.view.width ? this.app.view.width : this.mouse.x); // 上限値をキャンバスの横幅に
        })

        window.addEventListener("touchmove", (event: TouchEvent) => {
            /* Y座標 */
            this.mouse.y = event.touches[0].pageY - ((window.innerHeight - (this.app.view.height * (this.app.view as any).style.scale)) / 2); // キャンバスの上からのマウスのY座標を取得
            this.mouse.y = this.mouse.y / (this.app.view as any).style.scale; // キャンバスの拡大率を使い、キャンバスの座標に変換
            this.mouse.y = (this.mouse.y < 0 ? 0 : this.mouse.y); // 下限値 0
            this.mouse.y = (this.mouse.y > this.app.view.height ? this.app.view.height : this.mouse.y); // 上限値をキャンバスの高さに
            /* X座標 */
            this.mouse.x = event.touches[0].pageX - ((window.innerWidth - (this.app.view.width * (this.app.view as any).style.scale)) / 2); // キャンバスの左からのマウスのX座標を取得
            this.mouse.x = this.mouse.x / (this.app.view as any).style.scale; // キャンバスの拡大率を使い、キャンバスの座標に変換
            this.mouse.x = (this.mouse.x < 0 ? 0 : this.mouse.x); // 下限値 0
            this.mouse.x = (this.mouse.x > this.app.view.width ? this.app.view.width : this.mouse.x); // 上限値をキャンバスの横幅に
        })

        window.addEventListener("mousedown", () => {
            this.mouse.isClick = true;
        })

        window.addEventListener("mouseup", () => {
            this.mouse.isClick = false;
        })

        window.addEventListener("touchstart", () => {
            this.mouse.isClick = true;
        })

        window.addEventListener("touchend", () => {
            this.mouse.isClick = false;
        })

        this.mouse.onClick = (callback) => {
            window.addEventListener("click", callback);
        }
    }

    private _load() {
        this.testscene = new _Scene(this.app);
        this.button = new _Button(this.testscene.container, tweURL("1f7e9"));
        this.button
            .setPosition(_quality * AspectRadio.horizontal / 2, _quality * AspectRadio.vertical / 2)
            .setOnClick(() => console.log("clicked!"))
            .setOnMouseOver(() => console.log("hovered!"));

        this.mouseEffect = new _MouseEffect(this.testscene.container);
        this.mouse.onClick(() => {
            this.clickEffect.push(new _ClickEffect(this.testscene.container, this.mouse.x, this.mouse.y));
        })
    }

    private _main(delta: number) {
        if(new URL(window.location.href).searchParams.get("debug") == "test") this._scene_testscene(delta);
    }

    // シーンごとの処理

    private _scene_testscene(delta: number) {

        this.testscene.renderer((delta: number) => {
            this.button.renderer(delta);
            this.mouseEffect.renderer(delta);
            this.clickEffect.forEach((effect, index) => {
                effect.renderer(delta);
                if (effect.size > 0.5 * _quality) {
                    this.clickEffect.splice(index, 1);
                    effect.Effect.destroy();
                }
            })
        }, delta)

    }

}

const _0x47616d65 = new Game();
const _mouse = _0x47616d65.mouse;
export {
    _quality,
    _mouse,
}

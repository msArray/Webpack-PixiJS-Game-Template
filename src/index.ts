// PixiJSを読み込み
import { Application } from "pixi.js";
import { _Button } from "./components/_button";
import { _MouseEffect, _ClickEffect } from "./components/_mouseEffect";
import { _Scene } from "./components/_createScene";

// Scenes
import { _TitleScene } from "./scenes/_titleScene";

// 基本設定
const _AspectRadio = { vertical: 9, horizontal: 16 }; // ゲームのアスペクト比 vertical 縦:horizontal 横
const _quality = 400;

class Game {
  // 初期変数
  public app: Application = new Application({
    width: _quality * _AspectRadio.horizontal,
    height: _quality * _AspectRadio.vertical,
    backgroundColor: 0xffffff,
  });;
  public mouse: {
    x: number;
    y: number;
    isClick: boolean;
    onClick?: (callback: (event?: MouseEvent | TouchEvent) => void) => void;
  } = {
      x: this.app.view.width / 2,
      y: this.app.view.height / 2,
      isClick: false,
    };

  private calc: {
    x: (actPoint: number) => number;
    y: (actPoint: number) => number;
  } = {
      x: (actPoint: number) => {
        var _x: number =
          actPoint -
          (window.innerWidth -
            this.app.view.width * (this.app.view as any).style.scale) /
          2; // キャンバスの左からのマウスのX座標を取得
        _x = _x / (this.app.view as any).style.scale; // キャンバスの拡大率を使い、キャンバスの座標に変換
        _x = _x < 0 ? 0 : _x; // 下限値 0
        _x = _x > this.app.view.width ? this.app.view.width : _x; // 上限値をキャンバスの横幅に
        return _x;
      },
      y: (actPoint: number) => {
        var _y: number =
          actPoint -
          (window.innerHeight -
            this.app.view.height * (this.app.view as any).style.scale) /
          2; // キャンバスの上からのマウスのY座標を取得
        _y = _y / (this.app.view as any).style.scale; // キャンバスの拡大率を使い、キャンバスの座標に変換
        _y = _y < 0 ? 0 : _y; // 下限値 0
        _y = _y > this.app.view.height ? this.app.view.height : _y;
        return _y;
      },
    };

  // スプライト
  private mouseEffect: _MouseEffect;
  private clickEffect: _ClickEffect[] = [];

  // シーン
  private titleScene: _TitleScene;

  constructor() {
    this.__init();
    this._load();
    this.app.ticker.add((delta: number) => {
      this._main(delta);
    });
  }

  /* 初期化 */
  private __init() {
    // ステージを作る
    document.body.appendChild(this.app.view as HTMLCanvasElement);
    this._mouse();
    this._resizer();
    window.addEventListener("resize", () => {
      this._resizer();
    });
    document.oncontextmenu = function () { return false; }
  }

  private _resizer() {
    if (
      window.innerHeight / _AspectRadio.vertical >
      window.innerWidth / _AspectRadio.horizontal
    ) {
      (this.app.view as HTMLCanvasElement).style.scale = `${window.innerWidth / (_quality * _AspectRadio.horizontal)
        }`;
    } else {
      (this.app.view as HTMLCanvasElement).style.scale = `${window.innerHeight / (_quality * _AspectRadio.vertical)
        }`;
    }
  }

  public _mouse() {
    window.addEventListener("mousemove", (event: MouseEvent) => {
      this.mouse.y = this.calc.y(event.clientY);
      this.mouse.x = this.calc.x(event.clientX);
    });

    window.addEventListener("touchmove", (event: TouchEvent) => {
      this.mouse.y = this.calc.y(event.touches[0].pageY);
      this.mouse.x = this.calc.x(event.touches[0].pageX);
    });

    window.addEventListener("mousedown", () => {
      this.mouse.isClick = true;
    });

    window.addEventListener("mouseup", () => {
      this.mouse.isClick = false;
    });

    window.addEventListener("touchstart", () => {
      this.mouse.isClick = true;
    });

    window.addEventListener("touchend", () => {
      this.mouse.isClick = false;
    });

    this.mouse.onClick = (callback) => {
      window.addEventListener("click", callback);
      window.addEventListener("touchstart", callback);
    };
  }

  private _load() {
    /* Load Start */

    this._mouseEffect_init();
    this._titleScene_init();

    /* Load End */
  }

  private _main(delta: number) {
    //if (new URL(window.location.href).searchParams.get("debug") == "test")
    this._mouseEffect_render(delta);
    this._titleScene_render(delta);
  }

  /* マウスエフェクト */
  private _mouseEffect_init() {
    this.mouseEffect = new _MouseEffect(this.app);
    this.mouse.onClick((event: MouseEvent | TouchEvent) => {
      if (event instanceof MouseEvent) {
        this.clickEffect.push(
          new _ClickEffect(
            this.app,
            this.calc.x(event.clientX),
            this.calc.y(event.clientY)
          )
        );
      }
      if (event instanceof TouchEvent) {
        console.log(event);
        this.clickEffect.push(
          new _ClickEffect(
            this.app,
            this.calc.x(event.touches[0].pageX),
            this.calc.y(event.touches[0].pageY)
          )
        );
      }
    });
  }

  private _mouseEffect_render(delta: number) {
    this.mouseEffect.renderer(delta);
    this.clickEffect.forEach((effect, index) => {
      effect.renderer(delta);
      if (effect.size > 1.414) {
        this.clickEffect.splice(index, 1);
        effect.EffectSprite.destroy();
      }
    });
  }

  // シーンごとの処理

  private _titleScene_init() {
    this.titleScene = new _TitleScene(this.app);
  }

  private _titleScene_render(delta: number) {
    this.titleScene.render(delta);
  }
}

const _0x47616d65 = new Game();
const _mouse = _0x47616d65.mouse;
export { _quality, _mouse, _AspectRadio, _0x47616d65 };
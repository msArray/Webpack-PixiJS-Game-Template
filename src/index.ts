// PixiJSを読み込み
import { Application } from "pixi.js";
import { _Note } from "./components/_notes";
import { _Button } from "./components/_button";
import { _MouseEffect, _ClickEffect } from "./components/_mouseEffect";
import { _Scene } from "./components/_createScene";
import { tweURL } from "./utils/utils";

// 基本設定
const AspectRadio = { vertical: 9, horizontal: 16 }; // ゲームのアスペクト比 vertical 縦:horizontal 横
const _quality = 400;

class Game {
  // 初期変数
  public app: Application;
  public mouse: {
    x: number;
    y: number;
    isClick: boolean;
    onClick?: (callback: (event?: MouseEvent | TouchEvent) => void) => void;
  } = {
    x: 0,
    y: 0,
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
    });
  }

  /* 初期化 */
  private __init() {
    // ステージを作る
    this.app = new Application({
      width: _quality * AspectRadio.horizontal,
      height: _quality * AspectRadio.vertical,
      backgroundColor: 0xffffff,
    });
    document.body.appendChild(this.app.view as HTMLCanvasElement);
    this._mouse();
    this._resizer();
    window.addEventListener("resize", () => {
      this._resizer();
    });
  }

  private _resizer() {
    if (
      window.innerHeight / AspectRadio.vertical >
      window.innerWidth / AspectRadio.horizontal
    ) {
      (this.app.view as HTMLCanvasElement).style.scale = `${
        window.innerWidth / (_quality * AspectRadio.horizontal)
      }`;
    } else {
      (this.app.view as HTMLCanvasElement).style.scale = `${
        window.innerHeight / (_quality * AspectRadio.vertical)
      }`;
    }
  }

  public _mouse() {
    window.addEventListener("mousemove", (event: MouseEvent) => {
      /* Y座標 */
      /*
      this.mouse.y =
        event.clientY -
        (window.innerHeight -
          this.app.view.height * (this.app.view as any).style.scale) /
          2; // キャンバスの上からのマウスのY座標を取得
      this.mouse.y = this.mouse.y / (this.app.view as any).style.scale; // キャンバスの拡大率を使い、キャンバスの座標に変換
      this.mouse.y = this.mouse.y < 0 ? 0 : this.mouse.y; // 下限値 0
      this.mouse.y =
        this.mouse.y > this.app.view.height
          ? this.app.view.height
          : this.mouse.y; // 上限値をキャンバスの高さに
          */
      this.mouse.y = this.calc.y(event.clientY);
      this.mouse.x = this.calc.x(event.clientX);
      /* X座標 */
      /*
      this.mouse.x =
        event.clientX -
        (window.innerWidth -
          this.app.view.width * (this.app.view as any).style.scale) /
          2; // キャンバスの左からのマウスのX座標を取得
      this.mouse.x = this.mouse.x / (this.app.view as any).style.scale; // キャンバスの拡大率を使い、キャンバスの座標に変換
      this.mouse.x = this.mouse.x < 0 ? 0 : this.mouse.x; // 下限値 0
      this.mouse.x =
        this.mouse.x > this.app.view.width ? this.app.view.width : this.mouse.x; // 上限値をキャンバスの横幅に
        */
    });

    window.addEventListener("touchmove", (event: TouchEvent) => {
      /* Y座標 */
      /*
      this.mouse.y =
        event.touches[0].pageY -
        (window.innerHeight -
          this.app.view.height * (this.app.view as any).style.scale) /
          2; // キャンバスの上からのマウスのY座標を取得
      this.mouse.y = this.mouse.y / (this.app.view as any).style.scale; // キャンバスの拡大率を使い、キャンバスの座標に変換
      this.mouse.y = this.mouse.y < 0 ? 0 : this.mouse.y; // 下限値 0
      this.mouse.y =
        this.mouse.y > this.app.view.height
          ? this.app.view.height
          : this.mouse.y; // 上限値をキャンバスの高さに
        */
      this.mouse.y = this.calc.y(event.touches[0].pageY);
      this.mouse.x = this.calc.x(event.touches[0].pageX);
      /* X座標 */
      /*
      this.mouse.x =
        event.touches[0].pageX -
        (window.innerWidth -
          this.app.view.width * (this.app.view as any).style.scale) /
          2; // キャンバスの左からのマウスのX座標を取得
      this.mouse.x = this.mouse.x / (this.app.view as any).style.scale; // キャンバスの拡大率を使い、キャンバスの座標に変換
      this.mouse.x = this.mouse.x < 0 ? 0 : this.mouse.x; // 下限値 0
      this.mouse.x =
        this.mouse.x > this.app.view.width ? this.app.view.width : this.mouse.x; // 上限値をキャンバスの横幅に
        */
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

  private calcPoint() {
    this.calc;
  }

  private _load() {
    this.testscene = new _Scene(this.app);
    this.button = new _Button(this.testscene.container, tweURL("1f7e9"));
    this.button
      .setPosition(
        (_quality * AspectRadio.horizontal) / 2,
        (_quality * AspectRadio.vertical) / 2
      )
      .setOnClick(() => console.log("clicked!"))
      .setOnMouseOver(() => console.log("hovered!"));

    this.mouseEffect = new _MouseEffect(this.testscene.container);
    this.mouse.onClick((event: MouseEvent | TouchEvent) => {
      if (event instanceof MouseEvent) {
        this.clickEffect.push(
          new _ClickEffect(
            this.testscene.container,
            this.calc.x(event.clientX),
            this.calc.y(event.clientY)
          )
        );
      }
      if (event instanceof TouchEvent) {
        console.log(event);
        this.clickEffect.push(
          new _ClickEffect(
            this.testscene.container,
            this.calc.x(event.touches[0].pageX),
            this.calc.y(event.touches[0].pageY)
          )
        );
      }
    });
  }

  private _main(delta: number) {
    if (new URL(window.location.href).searchParams.get("debug") == "test")
      this._scene_testscene(delta);
  }

  // シーンごとの処理

  private _scene_testscene(delta: number) {
    this.testscene.renderer((delta: number) => {
      this.button.renderer(delta);
      this.mouseEffect.renderer(delta);
      this.clickEffect.forEach((effect, index) => {
        effect.renderer(delta);
        if (effect.size > 1.414) {
          this.clickEffect.splice(index, 1);
          effect.EffectSprite.destroy();
        }
      });
    }, delta);
  }
}

const _0x47616d65 = new Game();
const _mouse = _0x47616d65.mouse;
export { _quality, _mouse };

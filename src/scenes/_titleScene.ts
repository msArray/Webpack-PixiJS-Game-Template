import { Application, Container, Text } from "pixi.js";
import { _Scene } from "../components/_createScene";
import { _quality, _AspectRadio } from "../index";
import { _Sprite } from "../components/_sprite";

export class _TitleScene extends _Scene {
    /* 変えない変数 */
    public name: string;

    /* 随時追加 */
    public _tapOnStartMsg: _Sprite;
    public _tapOnStartMsgText: Text;
    private _tapOnStartMsgTextScaleChanges: number = 0;

    constructor(app: Application | Container) {
        super(app);
        this.name = "title";
    }

    public init() {
        this._tapOnStartMsg = new _Sprite(this.app, this.gradient());
        this._tapOnStartMsg.setPosition(_quality * _AspectRadio.horizontal / 2, _quality * _AspectRadio.vertical * 3 / 4);
        this._tapOnStartMsgText = new Text("タッチでスタート", {
            fontFamily: 'Arial',
            fontSize: _quality,
            fill: 0x000000,
            align: 'center',
        })
        if (this.app instanceof Application) {
            this.app.stage.addChild(this._tapOnStartMsgText);
        } else {
            this.app.addChild(this._tapOnStartMsgText);
        }

        this._tapOnStartMsgText.scale.set(0.2, 0.2);
        this._tapOnStartMsgText.anchor.set(0.5);
        this._tapOnStartMsgText.position.set(_quality * _AspectRadio.horizontal / 2, _quality * _AspectRadio.vertical * 3 / 4);
        return this;
    }

    public render(delta: number) {
        this._tapOnStartMsgTextScaleChanges += delta * Math.PI / 60;
        this._tapOnStartMsgText.scale.set(0.25 + Math.sin(this._tapOnStartMsgTextScaleChanges) * 0.025, 0.25 + Math.sin(this._tapOnStartMsgTextScaleChanges) * 0.025);
    }

    private gradient() {
        const c = document.createElement("canvas");
        c.height = _quality / 10;
        c.width = _quality * _AspectRadio.horizontal / 3;
        const ctx = c.getContext("2d");
        const grd = ctx!.createLinearGradient(
            0,
            _quality / 10,
            _quality * _AspectRadio.horizontal / 3,
            _quality / 10,
        );
        ctx!.beginPath();
        grd.addColorStop(0, "rgba(0, 0, 0,0)");
        grd.addColorStop(0.3, "rgba(0, 0, 0,0.02)");
        grd.addColorStop(0.5, "rgba(0, 0, 0,0.05)");
        grd.addColorStop(0.7, "rgba(0, 0, 0,0.02)");
        grd.addColorStop(1, "rgba(0, 0, 0,0)");
        ctx!.fillStyle = grd;
        ctx!.roundRect(0, 0, _quality * _AspectRadio.horizontal / 3, _quality / 10, 10);
        ctx!.fill();
        /*
        grd.addColorStop(0.2, "rgba(3, 186, 252,0.0)");
        grd.addColorStop(0.3, "rgba(3, 186, 252,0.1)");
        grd.addColorStop(0.5, "rgba(3, 186, 252,0.2)");
        grd.addColorStop(0.7, "rgba(3, 186, 252,0.1)");
        grd.addColorStop(0.8, "rgba(3, 186, 252,0.0)");
        ctx.fillStyle = grd;
        ctx.arc(_quality / 2, _quality / 2, _quality / 2, 0, Math.PI * 2, false);
        ctx.fill();
        //ctx.fillRect(0, 0, _quality, _quality);
        */
        return c;
    }
}
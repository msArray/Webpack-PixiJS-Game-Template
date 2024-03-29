import {
  Application,
  Graphics,
  Point,
  Container,
  Texture,
  Sprite,
} from "pixi.js";
import { _quality, _mouse, _0x47616d65 } from "../index";

export class _ClickEffect {
  private app: Application | Container;
  private x: number = 0;
  private y: number = 0;
  public size: number = 0;
  public sizeAmplify: number = 0.08;
  public EffectSprite: Sprite;

  constructor(app: Application | Container, x: number, y: number) {
    this.app = app;
    this.x = x;
    this.y = y;
    this.EffectSprite = new Sprite(this.gradient());
    this.EffectSprite.alpha = 0;
    this.EffectSprite.anchor.set(0.5);
    this.EffectSprite.x = this.x;
    this.EffectSprite.y = this.y;
    if (this.app instanceof Application) {
      this.app.stage.addChild(this.EffectSprite);
    } else {
      this.app.addChild(this.EffectSprite);
    }
  }

  public renderer(delta: number) {
    this.EffectSprite.alpha = 1;
    this.size += this.sizeAmplify * delta;
    if (this.sizeAmplify >= 1 / 100) this.sizeAmplify /= 1.05;
    this.EffectSprite.scale.set(this.size);
  }

  private gradient() {
    const c = document.createElement("canvas");
    c.height = _quality;
    c.width = _quality;
    const ctx = c.getContext("2d");
    const grd = ctx.createRadialGradient(
      _quality / 2,
      _quality / 2,
      0,
      _quality / 2,
      _quality / 2,
      _quality / 2
    );
    ctx.beginPath();
    grd.addColorStop(0, "rgba(3, 186, 252,0.3)");
    grd.addColorStop(0.3, "rgba(3, 186, 252,0.2)");
    grd.addColorStop(0.5, "rgba(3, 186, 252,0.4)");
    grd.addColorStop(0.7, "rgba(3, 186, 252,0.2)");
    grd.addColorStop(1, "rgba(3, 186, 252,0.0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, _quality, _quality);
    /* Effect v2
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
    return Texture.from(c);
  }
}

export class _MouseEffect {
  private app: Application | Container;
  private bezierPointsMaxLength: number = 20;
  private bezierPoints: { x: number; y: number }[] = [];
  private Bezier: Graphics;

  constructor(app: Application | Container) {
    this.app = app;
    this.Bezier = new Graphics();

    if (this.app instanceof Application) {
      this.app.stage.addChild(this.Bezier);
    } else {
      this.app.addChild(this.Bezier);
    }
  }

  public renderer(delta: number) {
    this.bezierPoints.push({ x: _mouse.x, y: _mouse.y });
    if (this.bezierPoints.length > 10) this.drawBesier();
    if (this.bezierPoints.length > this.bezierPointsMaxLength)
      this.bezierPoints = this.bezierPoints.slice(1);
  }

  private drawBesier() {
    this.Bezier.clear();
    this.Bezier.moveTo(this.bezierPoints[0].x, this.bezierPoints[0].y);
    for (let t = 0; t < 1; t += 0.01) {
      const currentPoint = this.calculateBezierPoint(this.bezierPoints, t);
      this.Bezier.lineStyle(10, 0x03bafc, t * 0.8);
      this.Bezier.lineTo(currentPoint.x, currentPoint.y);
    }
    this.Bezier.endFill();
  }

  private calculateBezierPoint(points: { x: number; y: number }[], t: number) {
    const n = points.length - 1;
    let x = 0;
    let y = 0;

    for (let i = 0; i <= n; i++) {
      const binomialCoefficient = this.binomial(n, i);
      const term =
        binomialCoefficient * Math.pow(1 - t, n - i) * Math.pow(t, i);
      x += term * points[i].x;
      y += term * points[i].y;
    }

    return new Point(x, y);
  }

  private binomial(n: number, k: number) {
    if (k < 0 || k > n) {
      return 0;
    }

    let result = 1;
    for (let i = 1; i <= k; i++) {
      result *= (n - i + 1) / i;
    }

    return result;
  }
}
import { Application, Graphics, Point, Container } from "pixi.js";
import { _quality, _mouse } from "../index";

export class _ClickEffect {
    private app: Application | Container;
    private x: number = 0;
    private y: number = 0;
    public size: number = 0;
    public sizeAmplify: number = 0.1;
    public Effect: Graphics;

    constructor(app: Application | Container, x: number, y: number) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.Effect = new Graphics();
        if (this.app instanceof Application) {
            this.app.stage.addChild(this.Effect);
        } else {
            this.app.addChild(this.Effect);
        }
    }

    public renderer(delta: number) {
        this.size += this.sizeAmplify * delta * _quality;
        if (this.sizeAmplify >= 0.01) this.sizeAmplify /= 1.1;
        this.draw();
    }

    private draw() {
        this.Effect.clear();
        this.Effect.lineStyle(10, 0x000000, 1);
        this.Effect.drawCircle(this.x, this.y, this.size);
        this.Effect.endFill();
    }
}

export class _MouseEffect {
    private app: Application | Container;
    private bezierPointsMaxLength: number = 50;
    private bezierPoints: { x: number, y: number }[] = [{ x: 0, y: 0 }];
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
        if (this.bezierPoints.length > 10) this.drawBesier();
        this.bezierPoints.push({ x: _mouse.x, y: _mouse.y });
        if (this.bezierPoints.length > this.bezierPointsMaxLength) this.bezierPoints = this.bezierPoints.slice(1);
    }

    private drawBesier() {
        this.Bezier.clear();
        this.Bezier.lineStyle(10, 0x000000, 1);
        this.Bezier.moveTo(this.bezierPoints[0].x, this.bezierPoints[0].y);
        for (let t = 0; t < 1; t += 0.01) {
            const currentPoint = this.calculateBezierPoint(this.bezierPoints, t);
            this.Bezier.lineTo(currentPoint.x, currentPoint.y);
        }
        this.Bezier.endFill();
    }

    private calculateBezierPoint(points: { x: number, y: number }[], t: number) {
        const n = points.length - 1;
        let x = 0;
        let y = 0;

        for (let i = 0; i <= n; i++) {
            const binomialCoefficient = this.binomial(n, i);
            const term = binomialCoefficient * Math.pow((1 - t), (n - i)) * Math.pow(t, i);
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
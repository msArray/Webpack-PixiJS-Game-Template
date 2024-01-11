import { Application, Graphics, Point } from "pixi.js";
import { _quality, _mouse } from "../index";

export class _MouseEffect {
    private app: Application;
    private bezierPointsMaxLength: number = 50;
    private bezierPoints: { x: number, y: number }[] = [{ x: 0, y: 0 }];
    private Bezier: Graphics;


    constructor(app: Application) {
        this.app = app;
        this.Bezier = new Graphics();
        this.app.stage.addChild(this.Bezier);
    }

    renderer(delta: number) {
        if (this.bezierPoints.length > 10) this.drawBesier();
        this.bezierPoints.push({ x: _mouse.x, y: _mouse.y });
        if (this.bezierPoints.length > this.bezierPointsMaxLength) this.bezierPoints = this.bezierPoints.slice(1);
    }

    private drawBesier() {
        this.Bezier.clear();
        this.Bezier.lineStyle(10, 0x000000, 1);
        this.Bezier.moveTo(this.bezierPoints[0].x, this.bezierPoints[0].y);
        for (let t = 0; t <= 1; t += 0.01) {
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
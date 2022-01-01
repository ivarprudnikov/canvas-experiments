import {FieldType} from "./fieldType.js";
import {Util} from "../util.js";
import {ForceVector} from "./forceVector.js";

export function ForceFieldPath({force, points}) {
    this.type = FieldType.PATH;
    this.force = force;
    this.points = points;
    this.pathColor = '#e882ff';
    this.borderColor = 'rgba(255,191,0,0.16)';

    this.obj = new Path2D();
    for (let i = 0; i < this.points.length; i++) {
        if (i === 0) this.obj.moveTo(this.points[i].x, this.points[i].y);
        else this.obj.lineTo(this.points[i].x, this.points[i].y);
    }
    this.obj.closePath();

    this.dots = [];
    for (let i = 1; i <= this.points.length; i++) {
        const A = this.points[i - 1];
        const B = this.points[i%this.points.length];
        const dX = B.x - A.x;
        const dY = B.y - A.y;
        const AB = Math.sqrt(dX**2 + dY**2);
        let segments = AB >> 4;
        const X1 = dX / segments;
        const Y1 = dY / segments;

        let x = A.x;
        let y = A.y;
        while (segments > 0) {
            this.dots.push({x,y});
            x+=X1;
            y+=Y1;
            segments--;
        }
    }

    this.renderOn = (canvas2D) => {
        canvas2D.lineWidth = this.force;
        canvas2D.strokeStyle = this.borderColor;
        canvas2D.stroke(this.obj);
        canvas2D.lineWidth = 1;
        canvas2D.strokeStyle = this.pathColor;
        canvas2D.stroke(this.obj);

        for (const {x,y} of this.dots) {
            canvas2D.beginPath();
            canvas2D.arc(x, y, 5, 0, 2 * Math.PI);
            canvas2D.strokeStyle = this.pathColor;
            canvas2D.stroke();
        }
    }

    this.getForceAtPosWithin = (pos, within) => {
        if (pos.x == null || pos.y == null) return;
        const distances = this.dots.map((dot, idx) => ([
            Util.distanceBetween(dot, pos),
            idx
        ]));
        const [A, B, C, ...rest] = distances.sort((a,b) => a[0] - b[0]);
        if (A[0] > (this.force + within)) return;
        if (A[0] < 0.1) return;
        const angleA = Util.angleRadFromTo(pos, this.dots[A[1]]);
        const angleB = Util.angleRadFromTo(pos, this.dots[B[1]]);
        const angleC = Util.angleRadFromTo(pos, this.dots[C[1]]);
        const forceA = this.force/A[0];
        const forceB = this.force/B[0];
        const forceC = this.force/C[0];
        return new ForceVector((angleA + angleB + angleC)/3, (forceA + forceB + forceC)/3);
    }
}

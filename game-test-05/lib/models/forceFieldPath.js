import {FieldType} from "./fieldType.js";

export function ForceFieldPath({force, points}) {
    this.type = FieldType.PATH;
    this.force = force;
    this.points = points;
    this.pathColor = '#e882ff';
    this.borderColor = '#ffc200';

    const obj = new Path2D();
    for (let i = 0; i < this.points.length; i++) {
        if (i === 0) obj.moveTo(this.points[i].x, this.points[i].y);
        else obj.lineTo(this.points[i].x, this.points[i].y);
    }
    obj.closePath();
    this.obj = obj;

    this.renderOn = (canvas2D) => {
        canvas2D.lineWidth = this.force;
        canvas2D.strokeStyle = this.borderColor;
        canvas2D.stroke(this.obj);
        canvas2D.lineWidth = 1;
        canvas2D.strokeStyle = this.pathColor;
        canvas2D.stroke(this.obj);
    }

    this.getForceAtPosWithin = (pos, within) => {}
}

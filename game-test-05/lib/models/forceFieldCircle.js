import {FieldType} from "./fieldType.js";
import {Util} from "../util.js";
import {ForceVector} from "./forceVector.js";

export function ForceFieldCircle({x, y, force, radius}) {
    this.type = FieldType.CIRCLE;
    this.force = force;
    this.radius = radius;
    this.borderColor = '#ffc200';
    this.pos = {
        x: x,
        y: y
    };
    this.renderOn = (canvas2D) => {
        canvas2D.beginPath();
        canvas2D.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        canvas2D.strokeStyle = this.borderColor;
        canvas2D.stroke();
    }
    this.getBallForceVector = (ball) => {
        const distanceToFieldCenter = Util.distanceBetween(this.pos, ball.pos);
        if (distanceToFieldCenter < (this.radius + ball.radius) && distanceToFieldCenter > 2) {
            const angle = Util.angleRadFromTo(ball.pos, this.pos);
            const force = this.force/distanceToFieldCenter;
            return new ForceVector(angle, force);
        }
    }
}

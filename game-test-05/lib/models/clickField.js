import {FieldType} from "./fieldType.js";
import {Util} from "../util.js";
import {ForceVector} from "./forceVector.js";

const TTL_DEFAULT = 50;

export function ClickField({x, y, radius}) {
    this.type = FieldType.CIRCLE;
    this.radius = radius;
    this.force = radius;
    this.backgroundColor = '#ff0000';
    this.borderColor = '#ff0000';
    this.ttl = TTL_DEFAULT;
    this.pos = {
        x: x,
        y: y
    };
    this.renderOn = (canvas2D) => {

        canvas2D.globalAlpha = Math.max(this.ttl / TTL_DEFAULT, 0.2);

        canvas2D.beginPath();
        canvas2D.arc(this.pos.x, this.pos.y, 3, 0, 2 * Math.PI);
        canvas2D.fillStyle = this.backgroundColor;
        canvas2D.fill();

        canvas2D.beginPath();
        canvas2D.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        canvas2D.strokeStyle = this.borderColor;
        canvas2D.stroke();

        canvas2D.globalAlpha = 1;

        this.ttl--;
    }

    this.getForceAtPosWithin = (pos, within = 0) => {
        const distanceToFieldCenter = Util.distanceBetween(this.pos, pos);
        if (distanceToFieldCenter > (this.radius + within)) return;
        if (distanceToFieldCenter < 0.1) return; // avoid peculiar behavior
        const angle = Util.angleRadFromTo(pos, this.pos);
        const force = this.force/distanceToFieldCenter;
        return new ForceVector(angle, force);
    }
}

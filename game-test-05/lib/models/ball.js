import {Util} from "../util.js";

export function Ball() {
    this.backgroundColor = '#91ff91';
    this.debugEnabled = true;
    this.directionAngle = 135;
    this.directionSpeed = 3;
    this.velocity = 5;
    this.velocityChangeSpeed = 1;
    this.bounceFriction = 3;
    this.radius = 40;
    this.pos = {
        x: 240,
        y: 240
    };
    this.renderOn = (canvas2D) => {
        canvas2D.beginPath();
        canvas2D.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        canvas2D.fillStyle = this.backgroundColor;
        canvas2D.fill();

        if (this.debugEnabled) {
            canvas2D.beginPath();
            canvas2D.strokeStyle = 'orange';
            canvas2D.moveTo(this.pos.x, this.pos.y);
            const directionRadians = Util.degreesToRadians(this.directionAngle);
            canvas2D.lineTo(Util.newXAtAngleAndDistance(this.pos.x, directionRadians, this.velocity * 20),
                Util.newYAtAngleAndDistance(this.pos.y, directionRadians, this.velocity * 20));
            canvas2D.closePath();
            canvas2D.stroke();
        }
    }
}

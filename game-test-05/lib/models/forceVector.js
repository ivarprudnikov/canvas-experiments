import {Util} from "../util.js";

export /**
 * Allows combining forces and determining the final direction and strength
 * @param radians
 * @param strength (same as velocity)
 * @constructor
 */
function ForceVector(radians, strength) {
    this.radians = radians;
    this.strength = strength;
    this.add = (vector) => {
        if (!vector) return this;
        return this.add(vector.radians, vector.strength);
    }
    this.add = (newRad, newStrength) => {
        if (newRad == null || newStrength == null) return this;
        const x1 = Util.newXAtAngleAndDistance(0, this.radians, this.strength);
        const y1 = Util.newYAtAngleAndDistance(0, this.radians, this.strength);
        const x2 = Util.newXAtAngleAndDistance(x1, newRad, newStrength);
        const y2 = Util.newYAtAngleAndDistance(y1, newRad, newStrength);
        this.radians = Util.angleRadFromTo({x:0,y:0}, {x:x2,y:y2});
        this.strength = Util.distanceBetween({x:0,y:0}, {x:x2,y:y2});
        return this;
    }
    this.renderOn = (canvas2D, pos) => {
        canvas2D.beginPath();
        canvas2D.strokeStyle = 'orange';
        canvas2D.moveTo(pos.x, pos.y);
        canvas2D.lineTo(Util.newXAtAngleAndDistance(pos.x, this.radians, this.strength * 20),
            Util.newYAtAngleAndDistance(pos.y, this.radians, this.strength * 20));
        canvas2D.closePath();
        canvas2D.stroke();
    }
}

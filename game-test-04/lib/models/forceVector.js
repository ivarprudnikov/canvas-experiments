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
    this.add = (newRad, newStrength) => {
        const x1 = Util.newXAtAngleAndDistance(0, this.radians, this.strength);
        const y1 = Util.newYAtAngleAndDistance(0, this.radians, this.strength);
        const x2 = Util.newXAtAngleAndDistance(x1, newRad, newStrength);
        const y2 = Util.newYAtAngleAndDistance(y1, newRad, newStrength);
        this.radians = Util.angleRadFromTo({x:0,y:0}, {x:x2,y:y2});
        this.strength = Util.distanceBetween({x:0,y:0}, {x:x2,y:y2});
        return this;
    }
}

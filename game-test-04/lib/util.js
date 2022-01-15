export const Util = {
    normalizeDegrees: deg => deg < 0 ? deg % 360 + 360 : deg % 360,
    distanceBetween: (point1, point2) => Math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2),
    angleRadFromTo: (point1, point2) => Math.atan2(point2.y - point1.y, point2.x - point1.x),
    radiansToDegrees: rad => rad * 180 / Math.PI,
    degreesToRadians: deg => deg * Math.PI / 180,
    degreesMirrorVertical: deg => {
        if (deg > 0 && deg < 90) {
            return 90 + (90 - deg);
        } else if (deg > 90 && deg < 180) {
            return 90 - (deg - 90);
        } else if (deg > 180 && deg < 270) {
            return 270 + (270 - deg);
        } else if (deg > 270 && deg < 360) {
            return 270 - (deg - 270);
        } else if (deg === 0) {
            return 180;
        } else if (deg === 180) {
            return 0;
        }
        return deg;
    },
    degreesMirrorHorizontal: deg => {
        if (deg > 0 && deg < 90) {
            return 360 - deg;
        } else if (deg > 90 && deg < 180) {
            return 180 + (180 - deg);
        } else if (deg > 180 && deg < 270) {
            return 180 - (deg - 180);
        } else if (deg > 270 && deg < 360) {
            return 360 - deg;
        } else if (deg === 90) {
            return 270;
        } else if (deg === 270) {
            return 90;
        }
        return deg;
    },
    newXAtAngleAndDistance: (x, radians, distance) => x + distance * Math.cos(radians),
    newYAtAngleAndDistance: (y, radians, distance) => y + distance * Math.sin(radians)
};

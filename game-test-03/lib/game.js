import {printState, trace} from "./trace.js";

const Util = {
    distanceBetween: (point1, point2) => Math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2),
    angleRadFromTo: (point1, point2) => Math.atan2(point2.y - point1.y, point2.x - point1.x),
    radiansToDegrees: rad => rad * 180 / Math.PI,
    degreesToRadians: deg => deg * Math.PI / 180,
    newXAtAngleAndDistance: (x, radians, distance) => x + distance * Math.cos(radians),
    newYAtAngleAndDistance: (y, radians, distance) => y + distance * Math.sin(radians)
};

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
    }
}

export function Game(canvas, w, h, State) {
    this.RES = {w: w, h: h};
    this.didChange = true;
    this.canvas = canvas;
    this.state = State;
    this.debugEnabled = true;

    this.update = function () {
        this.clear();
        this.drawFields();
        this.applyEffects();
        this.moveBall();
        this.drawBall();
        this.drawClicks();
        printState(this.state)
    }

    this.clear = function () {
        this.canvas.clearRect(0, 0, this.RES.w, this.RES.h);
        this.canvas.fillStyle = this.state.level.colors.background;
        this.canvas.fillRect(0, 0, this.RES.w, this.RES.h);
    }

    this.drawBall = function () {
        this.canvas.beginPath();
        this.canvas.arc(State.ball.pos.x, State.ball.pos.y, State.ball.radius, 0, 2 * Math.PI);
        this.canvas.fillStyle = this.state.level.colors.ball;
        this.canvas.fill();

        if (this.debugEnabled) {
            this.canvas.beginPath();
            this.canvas.strokeStyle = 'orange';
            this.canvas.moveTo(State.ball.pos.x, State.ball.pos.y);
            const directionRadians = Util.degreesToRadians(State.ball.directionAngle);
            this.canvas.lineTo(Util.newXAtAngleAndDistance(State.ball.pos.x, directionRadians, State.ball.velocity * 20),
                Util.newYAtAngleAndDistance(State.ball.pos.y, directionRadians, State.ball.velocity * 20));
            this.canvas.closePath();
            this.canvas.stroke();
        }
    }

    this.drawFields = function () {
        State.fields.forEach(field => {
            this.canvas.beginPath();
            this.canvas.arc(field.pos.x, field.pos.y, field.radius, 0, 2 * Math.PI);
            this.canvas.strokeStyle = this.state.level.colors.ball;
            this.canvas.stroke();
        })
    }

    this.applyEffects = function () {
        if (this.state.input.left) {
            trace('left');
            State.ball.directionAngle -= State.ball.directionSpeed;
        }
        if (this.state.input.right) {
            trace('right');
            State.ball.directionAngle += State.ball.directionSpeed;
        }
        if (this.state.input.up) {
            trace('up');
            State.ball.velocity += State.ball.velocityChangeSpeed;
        }
        if (this.state.input.down) {
            trace('down');
            State.ball.velocity -= State.ball.velocityChangeSpeed;
        }

        let externalForce = null;
        for(const field of State.fields) {
            const distanceToFieldCenter = Util.distanceBetween(field.pos, State.ball.pos);
            if (distanceToFieldCenter < (field.radius + State.ball.radius) && distanceToFieldCenter > 10) {
                trace('force');
                const angle = Util.angleRadFromTo(State.ball.pos, field.pos);
                const force = field.force/distanceToFieldCenter;
                if (!externalForce) {
                    externalForce = new ForceVector(angle, force);
                } else {
                    externalForce.add(angle, force);
                }
            }
        }
        if (externalForce) {
            externalForce.add(Util.degreesToRadians(State.ball.directionAngle), State.ball.velocity);
            State.ball.directionAngle = Util.radiansToDegrees(externalForce.radians);
            State.ball.velocity = externalForce.strength;
        }
    }

    this.moveBall = function() {
        const angle = Util.degreesToRadians(State.ball.directionAngle);
        State.ball.pos.x = Util.newXAtAngleAndDistance(State.ball.pos.x, angle, State.ball.velocity)
        State.ball.pos.y = Util.newYAtAngleAndDistance(State.ball.pos.y, angle, State.ball.velocity)
    }

    this.drawClicks = function () {
        for (const click of State.clicks) {
            this.canvas.beginPath();
            this.canvas.arc(click[0], click[1], 5, 0, 2 * Math.PI);
            this.canvas.fillStyle = 'red';
            this.canvas.fill();

            this.canvas.beginPath();
            this.canvas.arc(click[0], click[1], 25, 0, 2 * Math.PI);
            this.canvas.strokeStyle = 'red';
            this.canvas.stroke();
        }
    }
}

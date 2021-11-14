import {trace} from "./trace.js";

export function Game(canvas, w, h, State) {
    this.RES = {w: w, h: h, hh: h * .5};
    this.didChange = true;
    this.canvas = canvas;
    this.state = State;
    this.debugEnabled = true;

    this.update = function () {
        if (this.didChange) {
            this.clear();
            this.drawBall();
            this.drawFields();
        }
        this.applyEffects();
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

        this.canvas.beginPath();
        this.canvas.strokeStyle = this.state.level.colors.ball;
        this.canvas.moveTo(State.ball.pos.x, State.ball.pos.y);
        this.canvas.lineTo(this.newXAtAngleAndDistance(State.ball.pos.x, State.ball.direction, 30),
            this.newYAtAngleAndDistance(State.ball.pos.y, State.ball.direction, 30));
        this.canvas.closePath();
        this.canvas.stroke();
    }

    this.drawFields = function () {
        State.fields.forEach(field => {
            this.canvas.beginPath();
            this.canvas.arc(field.pos.x, field.pos.y, field.radius, 0, 2 * Math.PI);
            this.canvas.strokeStyle = this.state.level.colors.ball;
            this.canvas.stroke();
        })
    }

    this.distanceBetween = (point1, point2) => Math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2);
    this.angleRadFromTo = (point1, point2) => {
        const result = Math.atan2(point2.y - point1.y, point2.x - point1.x);

        if (this.debugEnabled) {
            this.canvas.beginPath();
            this.canvas.strokeStyle = 'green';
            this.canvas.moveTo(point1.x, point1.y);
            this.canvas.lineTo(point2.x, point2.y);
            this.canvas.closePath();
            this.canvas.stroke();
        }

        return result;
    }
    this.radiansToDegrees = rad => rad * 180 / Math.PI;
    this.angleFromTo = (point1, point2) => this.radiansToDegrees(this.angleRadFromTo(point1, point2));
    this.newXAtAngleAndDistance = (x, angle, distance) => x + distance * Math.cos(angle);
    this.newYAtAngleAndDistance = (y, angle, distance) => y + distance * Math.sin(angle);
    this.newPosFromTowards = (point1, point2, distance) => {
        const angle = this.angleFromTo(point1, point2);
        const result = {
            x: this.newXAtAngleAndDistance(point1.x, angle, distance),
            y: this.newYAtAngleAndDistance(point1.y, angle, distance)
        }

        if (this.debugEnabled) {
            this.canvas.beginPath();
            this.canvas.strokeStyle = 'red';
            this.canvas.moveTo(point1.x, point1.y);
            this.canvas.lineTo(result.x, result.y);
            this.canvas.closePath();
            this.canvas.stroke();
        }

        return result;
    }

    this.applyEffects = function () {
        let hasEffect = false;

        State.fields.forEach(field => {
            const distanceToFieldCenter = this.distanceBetween(field.pos, State.ball.pos);
            if (distanceToFieldCenter < (field.radius + State.ball.radius) && distanceToFieldCenter > 10) {
                trace('force');
                State.ball.pos = this.newPosFromTowards(State.ball.pos, field.pos, 2);
                hasEffect = true;
            }
        });

        if (this.state.input.left) {
            hasEffect = true;
            trace('left');
            State.ball.pos.x -= State.ball.speed;
        }
        if (this.state.input.right) {
            hasEffect = true;
            trace('right');
            State.ball.pos.x += State.ball.speed;
        }
        if (this.state.input.up) {
            hasEffect = true;
            trace('up');
            State.ball.pos.y -= State.ball.speed;
        }
        if (this.state.input.down) {
            hasEffect = true;
            trace('down');
            State.ball.pos.y += State.ball.speed;
        }

        this.didChange = hasEffect;
    }
}

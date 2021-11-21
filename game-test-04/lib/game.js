import {printState, trace} from "./trace.js";
import {Util} from "./util.js";
import {ForceVector} from "./models/forceVector.js";

export function Game(canvas, w, h, State) {
    this.gameWidth = w;
    this.gameHeight = h;
    this.didChange = true;
    this.canvas = canvas;
    this.state = State;
    this.debugEnabled = true;

    this.update = () => {
        this.clear();
        this.applyUserInput();
        this.applyExternalForces();
        this.ensureBallInBounds();
        this.draw();
        printState(this.state)
    }

    this.clear = () => {
        this.canvas.clearRect(0, 0, this.gameWidth, this.gameHeight);
        this.canvas.fillStyle = this.state.level.colors.background;
        this.canvas.fillRect(0, 0, this.gameWidth, this.gameHeight);
    }

    this.draw = () => {
        State.fields.forEach(field => field.renderOn(this.canvas))
        State.ball.renderOn(this.canvas);
        this.drawClicks();
    }

    this.drawClicks = () => {
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

    this.applyUserInput = () => {
        let directionAngle = State.ball.directionAngle;
        if (this.state.input.left) {
            directionAngle -= State.ball.directionSpeed;
            trace(`left ${directionAngle}`);
        }
        if (this.state.input.right) {
            directionAngle += State.ball.directionSpeed;
            trace(`right ${directionAngle}`);
        }
        State.ball.directionAngle = Util.normalizeDegrees(directionAngle);

        if (this.state.input.up) {
            trace('up');
            State.ball.velocity += State.ball.velocityChangeSpeed;
        }
        if (this.state.input.down) {
            trace('down');
            State.ball.velocity -= State.ball.velocityChangeSpeed;
        }
    }

    this.applyExternalForces = () => {
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
            State.ball.directionAngle = Util.normalizeDegrees(Util.radiansToDegrees(externalForce.radians));
            State.ball.velocity = externalForce.strength;
        }
    }

    this.ensureBallInBounds = () => {
        const angle = Util.degreesToRadians(State.ball.directionAngle);
        let newX = Util.newXAtAngleAndDistance(State.ball.pos.x, angle, State.ball.velocity);
        let newY = Util.newYAtAngleAndDistance(State.ball.pos.y, angle, State.ball.velocity);

        //             |
        //             |
        //             |      o x1 - ball is flying to bottom left
        //             |
        //   x2_v1 o   |   o X2_v2 <-- mirror final position AND angle to simulate the bounce
        //             |
        //             |
        //             +---------------------

        if (newX < 0 || newX > this.gameWidth) {
            newX = newX < 0 ? -newX : this.gameWidth - (newX - this.gameWidth);
            State.ball.directionAngle = Util.degreesMirrorVertical(State.ball.directionAngle);
        }
        if (newY < 0 || newY > this.gameHeight) {
            newY = newY < 0 ? -newY : (this.gameHeight - (newY - this.gameHeight));
            State.ball.directionAngle = Util.degreesMirrorHorizontal(State.ball.directionAngle);
        }

        State.ball.pos.x = newX;
        State.ball.pos.y = newY;
    }
}

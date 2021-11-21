import {printState, trace} from "./trace.js";
import {Util} from "./util.js";
import {ForceVector} from "./models/forceVector.js";
import {FieldType} from "./models/fieldType.js";

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
        State.clicks = State.clicks.filter(it => it.ttl > 0);
    }

    this.draw = () => {
        State.fields.forEach(field => field.renderOn(this.canvas));
        State.ball.renderOn(this.canvas);
        State.clicks.forEach(click => click.renderOn(this.canvas));
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
        const forceBetweenFieldAndBall = (field, ball) => {
            // TODO move this to the field
            if (field.type === FieldType.CIRCLE) {
                const distanceToFieldCenter = Util.distanceBetween(field.pos, ball.pos);
                if (distanceToFieldCenter < (field.radius + ball.radius) && distanceToFieldCenter > 2) {
                    const angle = Util.angleRadFromTo(ball.pos, field.pos);
                    const force = field.force/distanceToFieldCenter;
                    return new ForceVector(angle, force);
                }
            }
        }
        let force;
        for(const field of State.fields) {
            force = forceBetweenFieldAndBall(field, State.ball);
            if (!externalForce) externalForce = force;
            else externalForce.add(force);
        }
        for(const click of State.clicks) {
            force = forceBetweenFieldAndBall(click, State.ball);
            if (!externalForce) externalForce = force;
            else externalForce.add(force);
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

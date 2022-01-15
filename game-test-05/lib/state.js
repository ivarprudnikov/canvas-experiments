import {trace} from "./trace.js";
import {Ball} from "./models/ball.js";
import {ForceFieldCircle} from "./models/forceFieldCircle.js";
import {ClickField} from "./models/clickField.js";
import {ForceFieldPath} from "./models/forceFieldPath.js";

export const State = {
    input: {
        right: false,
        up: false,
        left: false,
        down: false,
        quit: false,
        mousePosition: {}
    },
    level: {
        colors: {
            background: '#111111'
        }
    },
    ball: new Ball(),
    fields: [
        new ForceFieldCircle({x: 150, y: 150, force: 100, radius: 150}),
        new ForceFieldPath({force: 100, offset: 30, points: [{x: 300, y: 400}, {x: 600, y: 500}, {x: 400, y: 700}]})
    ],
    clicks: []
}

const KEY = {
    D: 68,
    W: 87,
    A: 65,
    S: 83,
    RIGHT: 39,
    UP: 38,
    LEFT: 37,
    DOWN: 40,
    Q: 81
};

export function press(evt) {
    const code = evt.keyCode;
    switch (code) {
        case KEY.RIGHT:
        case KEY.D:
            State.input.right = true;
            break;

        case KEY.UP:
        case KEY.W:
            State.input.up = true;
            break;

        case KEY.LEFT:
        case KEY.A:
            State.input.left = true;
            break;

        case KEY.DOWN:
        case KEY.S:
            State.input.down = true;
            break;

        case KEY.Q:
            State.input.quit = true;
            break;
    }
}

export function release(evt) {
    const code = evt.keyCode;
    switch (code) {
        case KEY.RIGHT:
        case KEY.D:
            State.input.right = false;
            break;

        case KEY.UP:
        case KEY.W:
            State.input.up = false;
            break;

        case KEY.LEFT:
        case KEY.A:
            State.input.left = false;
            break;

        case KEY.DOWN:
        case KEY.S:
            State.input.down = false;
            break;

        case KEY.Q:
            break;

        default:
            trace('unrecognized key code: ' + code);
            break;
    }
}

const mouseToPosition = (mouseEvent, canvas) => ({
    x: mouseEvent.offsetX * canvas.width / canvas.clientWidth,
    y: mouseEvent.offsetY * canvas.height / canvas.clientHeight
});

export const sumForcesAtPointWithin = (pos, within = 0) => {
    let sum = null;
    for (const field of [...State.fields, ...State.clicks]) {
        const force = field.getForceAtPosWithin(pos, within);
        if (!sum) sum = force;
        else sum.add(force);
    }
    return sum;
}

export function clickOnCanvas(evt, canvas) {
    const pos = mouseToPosition(evt, canvas)
    State.clicks.push(new ClickField({...pos, radius: 100}));
}

export function hoverOnCanvas(evt, canvas) {
    State.input.mousePosition = mouseToPosition(evt, canvas);
}

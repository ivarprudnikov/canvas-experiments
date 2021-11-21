import {trace} from "./trace.js";

export const State = {
    input: {
        right: false,
        up: false,
        left: false,
        down: false,
        quit: false
    },
    level: {
        colors: {
            background:'#000000',
            ball:'#FFFFFF'
        }
    },
    ball: {
        directionAngle: 135,
        directionSpeed: 3,
        velocity: 5,
        velocityChangeSpeed: 1,
        radius: 40,
        pos: {
            x: 240,
            y: 240
        }
    },
    fields: [
        {
            force: 10,
            radius: 150,
            pos: {
                x: 150,
                y: 150
            }
        },
        {
            force: 20,
            radius: 200,
            pos: {
                x: 500,
                y: 500
            }
        },
        {
            force: 40,
            radius: 500,
            pos: {
                x: 320,
                y: 320
            }
        }
    ],
    clicks: []
}

const KEY = {
    D: 68,
    W: 87,
    A: 65,
    S:83,
    RIGHT:39,
    UP:38,
    LEFT:37,
    DOWN:40,
    Q:81
};

export function press(evt) {
    const code = evt.keyCode;
    switch(code) {
        case KEY.RIGHT:
        case KEY.D: State.input.right = true; break;

        case KEY.UP:
        case KEY.W: State.input.up = true; break;

        case KEY.LEFT:
        case KEY.A: State.input.left = true; break;

        case KEY.DOWN:
        case KEY.S: State.input.down = true; break;

        case KEY.Q: State.input.quit = true; break;
    }
}

export function release(evt) {
    const code = evt.keyCode;
    switch(code) {
        case KEY.RIGHT:
        case KEY.D: State.input.right = false; break;

        case KEY.UP:
        case KEY.W: State.input.up = false; break;

        case KEY.LEFT:
        case KEY.A: State.input.left = false; break;

        case KEY.DOWN:
        case KEY.S: State.input.down = false; break;

        case KEY.Q: break;

        default: trace('unrecognized key code: ' +code); break;
    }
}

export function clickOnCanvas(evt, canvas) {
    console.log(evt)
    const W = canvas.width  / canvas.clientWidth, H = canvas.height / canvas.clientHeight;
    console.log(evt.offsetX, W, evt.offsetY, H)
    State.clicks.push([evt.offsetX * W, evt.offsetY * H])
}

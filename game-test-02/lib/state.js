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
        direction: 0,
        speed: 3,
        radius: 10,
        pos: {
            x: 240,
            y: 240
        }
    },
    fields: [
        {
            radius: 150,
            pos: {
                x: 150,
                y: 150
            }
        }
    ]
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

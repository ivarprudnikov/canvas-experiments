import {trace} from "./trace.js";
import {clickOnCanvas, press, release, State} from "./state.js";
import {Game} from "./game.js";

let GameInstance, C2D, W, H;
const fps = 24;
const mspf = 1000 / fps;
let updateInterval;

function main() {
    const c = document.getElementById('canvas');
    if (c.getContext) {
        initializeCanvas(c);
        GameInstance = new Game(C2D, W, H, State);
        updateInterval = window.setInterval(() => {
            if (State.input.quit) {
                State.input.quit = false;
                window.clearInterval(updateInterval);
                trace('raycaster halted.');
            } else {
                GameInstance.update()
            }
        }, mspf);
        c.addEventListener('click', (e) => clickOnCanvas(e, c))
    } else {
        trace('sorry.. you\'ll need a browser that supports the canvas tag,');
        trace('like Safari or Firefox 1.5+ to see this demo.');
    }
}

function initializeCanvas(c) {
    C2D = c.getContext('2d');
    C2D.lineWidth = 1;
    C2D.globalAlpha = 1;
    C2D.globalCompositeOperation = 'source-over';
    W = c.width;
    H = c.height;
    trace('canvas initialized');
}

window.addEventListener('load', main)
document.addEventListener('keydown', press)
document.addEventListener('keyup', release)



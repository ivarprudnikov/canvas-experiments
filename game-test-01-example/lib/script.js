import {trace} from "./trace.js";
import {RayCaster} from "./raycaster.js";
import {State, press, release} from "./state.js";

let C2D, W, H, RC;
const fps = 24;
const mspf = 1000 / fps;
let updateInterval;

function main() {
    const c = document.getElementById('canvas');
    if (c.getContext) {
        initializeCanvas(c);
        RC = new RayCaster(C2D, W, H, 4, State);
        if (initializeLevel()) {
            trace('map loaded successfully.');
            trace("now casting...");
            trace("  \'a\' - turn left");
            trace("  \'d\' - turn right");
            trace("  \'w\' - step forward");
            trace("  \'s\' - step backward");
            trace("  \'q\' - stop casting");
            updateInterval = window.setInterval(() => {
                if (State.input.quit) {
                    State.input.quit = false;
                    window.clearInterval(updateInterval);
                    trace('raycaster halted.');
                } else {
                    RC.update();
                }
            }, mspf);
        } else {
            trace("map failed to load");
        }
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

function initializeLevel() {
    var mapCells_x = 16;
    var mapCells_y = 16;
    var M = '' +
        '################' +
        '#  @@@@@       #' +
        '#  @   @ % # % #' +
        '#  @       #   #' +
        '#  @  @@       #' +
        '#    &         #' +
        '#   &   P      #' +
        '#  &      &&   #' +
        '#              #' +
        '#  ##  #@%#@%  #' +
        '#  #        #  #' +
        '#  ###      #  #' +
        '#  #        #  #' +
        '#  ######## #  #' +
        '#              #' +
        '################';

    trace('submitting map...');
    return RC.loadMap(M, mapCells_x, mapCells_y);
}

window.addEventListener('load', main)
document.addEventListener('keydown', press)
document.addEventListener('keyup', release)



const MAX_LINES = 12;
const begin = '<ul><li>';
const middle = '</li><li>';
const end = '</li></ul>';

export function trace(msg) {
    const output_window = document.getElementById("trace");
    const lines = output_window.innerHTML.toLowerCase();
    let lineList;

    if (lines.length > 0) {
        lineList = lines.substring(begin.length, lines.length - end.length).split(middle);
        while (lineList.length >= MAX_LINES) { lineList.shift(); }
        lineList.push(msg);
    }
    else {
        lineList = [ msg ];
    }

    output_window.innerHTML = begin +lineList.join(middle) +end;
}

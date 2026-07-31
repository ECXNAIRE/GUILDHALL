import { camera } from "./camera.js";
import { worldCanvas } from "./canvas.js";


export function drawBoardDecoration(ctx) {
    const left = (-camera.x) / camera.zoom;
    const top = (-camera.y) / camera.zoom;

    const right = left + worldCanvas.width / camera.zoom;
    const bottom = top + worldCanvas.height / camera.zoom;
    for (const pin of pinholes) {
        if (
            pin.x < left ||
            pin.x > right ||
            pin.y < top ||
            pin.y > bottom
        ) continue;

        ctx.beginPath();
        ctx.arc(pin.x, pin.y, pin.r, 0, Math.PI * 2);
        ctx.fill();
    }

}


const pinholes = []

for (let i = 0; i < 500; i++) {
    pinholes.push({
        x: (seededRandom(i) - 0.5) * 10000,
        y: (seededRandom(i + 1000) - 0.5) * 10000,
        r: 0.8 + seededRandom(i + 2000) * 1.2,
    })
}


function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}
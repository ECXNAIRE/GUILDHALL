import { worldCanvas } from "./canvas.js";
import { state } from "./state.js";
import { camera } from "./camera.js";


console.log("Pan file loaded");

export function pointerdown(e) {
    worldCanvas.setPointerCapture(e.pointerId);
    state.isPanning = true;
    
    console.log("pointer down");

    state.lastMouseX = e.clientX;
    state.lastMouseY = e.clientY;
}



export function pointermove(e) {
    if(!state.isPanning) return

    const dx = e.clientX - state.lastMouseX
    const dy = e.clientY - state.lastMouseY

    camera.x += dx
    camera.y += dy
    console.log(camera.x, camera.y);

    state.lastMouseX = e.clientX
    state.lastMouseY = e.clientY
}


export function pointerup(e) {
    worldCanvas.releasePointerCapture(e.pointerId);
    state.isPanning = false
}
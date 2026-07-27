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
    worldCanvas.style.cursor = "grab"
    if(!state.isPanning) return

    worldCanvas.style.cursor = "grabbing"

    const dx = e.clientX - state.lastMouseX
    const dy = e.clientY - state.lastMouseY

    camera.x += dx
    camera.y += dy

    state.lastMouseX = e.clientX
    state.lastMouseY = e.clientY
}


export function pointerup(e) {
    worldCanvas.releasePointerCapture(e.pointerId);
    state.isPanning = false
}
import { worldCanvas } from "./canvas.js";
import { state } from "./state.js";
import { camera } from "./camera.js";

export function pointerdown(e) {
    worldCanvas.setPointerCapture(e.pointerId);

    const rect = worldCanvas.getBoundingClientRect();

    const canvasX = (e.clientX - rect.left) * (worldCanvas.width / rect.width);
    const canvasY = (e.clientY - rect.top) * (worldCanvas.height / rect.height);


    const mouseX = (canvasX - camera.x) / camera.zoom;
    const mouseY = (canvasY - camera.y) / camera.zoom;

    state.selectedQuest = null

    for(let i = state.quests.length - 1; i >= 0; i--) {
        const quest = state.quests[i]

        if(isPointInQuest(mouseX, mouseY, quest)) {
            state.selectedQuest = quest
            console.log(state.selectedQuest)
            return
        }
    }



    state.isPanning = true;

    console.log("pointer down");

    state.lastMouseX = e.clientX;
    state.lastMouseY = e.clientY;
}



export function pointermove(e) {
    worldCanvas.style.cursor = "grab"


    const rect = worldCanvas.getBoundingClientRect();

    const canvasX = (e.clientX - rect.left) * (worldCanvas.width / rect.width);
    const canvasY = (e.clientY - rect.top) * (worldCanvas.height / rect.height);


    const mouseX = (canvasX - camera.x) / camera.zoom;
    const mouseY = (canvasY - camera.y) / camera.zoom;
    state.hoveredQuest = null;

    for (const quest of state.quests) {
        if (isPointInQuest(mouseX, mouseY, quest)) {
            state.hoveredQuest = quest
            break
        }
    }
    if (!state.isPanning) return

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


function isPointInQuest(mouseX, mouseY, quest) {
    const dx = mouseX - quest.x
    const dy = mouseY - quest.y

    const cos = Math.cos(-quest.rotation);
    const sin = Math.sin(-quest.rotation);


    const localX = dx * cos - dy * sin
    const localY = dx * sin + dy * cos


    return (
        localX >= -quest.width / 2 &&
        localX <= quest.width / 2 &&
        localY >= -quest.height / 2 &&
        localY <= quest.height / 2
    )
}
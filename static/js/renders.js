import { camera } from "./camera.js";
import { uiCanvas, worldCanvas, uiCtx, worldCtx } from "./canvas.js";
import { addQuestFrame } from "./drawFrame.js";
import { state } from "./state.js";
import { drawQuestCard } from "./drawQuest.js"
import { drawBoardDecoration } from "./boardDecoration.js";

export function renderWorld(worldCtx, worldCanvas) {

    worldCtx.clearRect(
        0,
        0,
        worldCanvas.width,
        worldCanvas.height
    );

    
    worldCtx.save();
    worldCtx.translate(camera.x, camera.y);
    worldCtx.scale(camera.zoom, camera.zoom);


    drawBoardDecoration(worldCtx)

    for (const quest of state.quests) {
        if (quest !== state.hoveredQuest) {
            drawQuestCard(worldCtx, quest)
        }
    }


    if (state.hoveredQuest) {
        drawQuestCard(worldCtx, state.hoveredQuest);
    }
    worldCtx.restore();

}


export function renderUI(uiCtx, uiCanvas) {

    uiCtx.clearRect(
        0,
        0,
        uiCanvas.width,
        uiCanvas.height
    );

    if (addQuestFrame.complete) {
        uiCtx.drawImage(
            addQuestFrame,
            0,
            -10,
            uiCanvas.width,
            uiCanvas.height
        );

    }



}




export function render() {
    renderWorld(worldCtx, worldCanvas)
    renderUI(uiCtx, uiCanvas)



    requestAnimationFrame(render)
}
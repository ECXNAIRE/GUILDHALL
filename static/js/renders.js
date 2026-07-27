import { camera } from "./camera.js";
import { uiCanvas, worldCanvas, uiCtx, worldCtx } from "./canvas.js";
import { addQuestFrame } from "./drawFrame.js";
import { state } from "./state.js";
import { drawQuestCard } from "./drawQuest.js"

export function renderWorld(worldCtx, worldCanvas) {

    worldCtx.clearRect(
        0,
        0,
        worldCanvas.width,
        worldCanvas.height
    );

    worldCtx.save();
    worldCtx.translate(camera.x, camera.y);

    state.quests.forEach(quest => {
        drawQuestCard(worldCtx, quest)
    })

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
        const width = 1000
        const height = width * (addQuestFrame.height / addQuestFrame.width);
        uiCtx.drawImage(
            addQuestFrame,
            0,
            -10,
            width,
            height
        );

    }



}




export function render() {
    renderWorld(worldCtx, worldCanvas)
    renderUI(uiCtx, uiCanvas)



    requestAnimationFrame(render)
}
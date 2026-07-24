import { camera } from "./camera.js";
import { uiCanvas } from "./canvas.js";
import { addQuestFrame } from "./drawFrame.js";



const width = 1000
const height = width * (addQuestFrame.height / addQuestFrame.width);

export function renderWorld(worldCtx, worldCanvas) {

    worldCtx.clearRect(
        0,
        0,
        worldCanvas.width,
        worldCanvas.height
    );

    worldCtx.save();

    worldCtx.translate(camera.x, camera.y);

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
            width,
            height
        );

    }



}
import { worldCanvas, uiCanvas, worldCtx, uiCtx } from "./canvas.js";
import { renderUI, renderWorld } from "./renders.js";




function render() {
    renderWorld(worldCtx, worldCanvas)
    renderUI(uiCtx, uiCanvas)



    requestAnimationFrame(render)
}

render()
import { worldCanvas, uiCanvas, worldCtx, uiCtx } from "./canvas.js";
import { renderUI, renderWorld } from "./renders.js";


document.querySelectorAll('.options').forEach(button => {
    button.addEventListener("click", () => {
        
        document
        .querySelector(".options.active")
        ?.classList.remove("active")

        button.classList.add("active")
    })
})

function render() {
    renderWorld(worldCtx, worldCanvas)
    renderUI(uiCtx, uiCanvas)



    requestAnimationFrame(render)
}
render()
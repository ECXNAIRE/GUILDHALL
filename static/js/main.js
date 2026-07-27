import { worldCanvas, uiCanvas, worldCtx, uiCtx } from "./canvas.js";
import { renderUI, renderWorld, render } from "./renders.js";
import { state } from "./state.js";
import { loadQuest } from "./loadQuest.js";
import { pointerdown, pointermove, pointerup, pointerdblclick } from "./pointerEvents.js";
import { camera } from "./camera.js";

document.querySelectorAll('.options').forEach(button => {
    button.addEventListener("click", () => {
        state.selectedGuild = button.dataset.guild

        loadQuest(state.selectedGuild)

        document
            .querySelector(".options.active")
            ?.classList.remove("active")

        button.classList.add("active")
    })
})




loadQuest(state.selectedGuild)
render()


worldCanvas.addEventListener("pointerdown", pointerdown)
worldCanvas.addEventListener("pointermove", pointermove)
window.addEventListener("pointerup", pointerup)
window.addEventListener("dblclick", pointerdblclick)
worldCanvas.addEventListener("wheel", (e) => {
    e.preventDefault();

    const rect = worldCanvas.getBoundingClientRect()


    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top


    const oldZoom = camera.zoom
    const zoomSpeed = 0.1;

    if (e.deltaY < 0) {
        camera.zoom += zoomSpeed;
    } else {
        camera.zoom -= zoomSpeed;
    }

    camera.zoom = Math.max(0.3, Math.min(camera.zoom, 3));
    camera.x = mouseX - (mouseX - camera.x) * (camera.zoom / oldZoom);
    camera.y = mouseY - (mouseY - camera.y) * (camera.zoom / oldZoom);
});

import { worldCanvas, uiCanvas, worldCtx, uiCtx } from "./canvas.js";
import { renderUI, renderWorld, render } from "./renders.js";
import { state } from "./state.js";
import { loadQuest } from "./loadQuest.js";

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


render()
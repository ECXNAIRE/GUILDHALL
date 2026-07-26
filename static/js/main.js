import { worldCanvas, uiCanvas, worldCtx, uiCtx } from "./canvas.js";
import { renderUI, renderWorld, render } from "./renders.js";
import { state } from "./state.js";


document.querySelectorAll('.options').forEach(button => {
    button.addEventListener("click", () => {
        state.selectedGuild = button.dataset.guild
        console.log(state.selectedGuild)
        
        document
        .querySelector(".options.active")
        ?.classList.remove("active")

        button.classList.add("active")
    })
})


render()
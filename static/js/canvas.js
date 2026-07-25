export const uiCanvas = document.getElementById("uiCanvas")
export const uiCtx = uiCanvas.getContext("2d")

export const worldCanvas = document.getElementById('worldCanvas')
export const worldCtx = worldCanvas.getContext("2d")

function resize(){

    const uiRect = uiCanvas.getBoundingClientRect();
    uiCanvas.width = uiRect.width;
    uiCanvas.height = uiRect.height;

    const worldRect = worldCanvas.getBoundingClientRect();
    worldCanvas.width = worldRect.width;
    worldCanvas.height = worldRect.height;


}

window.addEventListener("resize",resize);

resize();
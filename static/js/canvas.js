export const uiCanvas = document.getElementById("uiCanvas")
export const uiCtx = uiCanvas.getContext("2d")

export const worldCanvas = document.getElementById('worldCanvas')
export const worldCtx = worldCanvas.getContext("2d")

function resize(){

    const rect = worldCanvas.getBoundingClientRect();

    worldCanvas.width = rect.width;
    worldCanvas.height = rect.height;

    uiCanvas.width = rect.width;
    uiCanvas.height = rect.height;

}

window.addEventListener("resize",resize);

resize();
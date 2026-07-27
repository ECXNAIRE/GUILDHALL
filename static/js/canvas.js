export const uiCanvas = document.getElementById("uiCanvas")
export const uiCtx = uiCanvas.getContext("2d")

export const worldCanvas = document.getElementById('worldCanvas')
export const worldCtx = worldCanvas.getContext("2d")
const dpr = window.devicePixelRatio || 1;
function resize() {

    const uiRect = uiCanvas.getBoundingClientRect();
    uiCanvas.width = uiRect.width;
    uiCanvas.height = uiRect.height;


    const worldRect = worldCanvas.getBoundingClientRect();
    worldCanvas.width = worldRect.width * dpr;
    worldCanvas.height = worldRect.height * dpr;

    worldCanvas.style.width = worldRect.width + "px";
    worldCanvas.style.height = worldRect.height + "px";



}

window.addEventListener("resize", resize);

resize();
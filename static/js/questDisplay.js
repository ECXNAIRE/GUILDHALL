import { state } from "./state.js"

const displayPopup = document.getElementById("questDisplayPopup")
const overlay = document.getElementById("overlay")


export function displayQuest(quest) {
    if (state.selectedQuest) {
        displayPopup.style.display = "block"
        overlay.style.display = "block"
    }

}
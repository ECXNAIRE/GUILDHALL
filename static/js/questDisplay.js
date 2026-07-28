import { state } from "./state.js"

const displayPopup = document.getElementById("questDisplayPopup")
const overlay = document.getElementById("overlay")
const titleDisplay = document.getElementById("titleDisplay")
const descriptionDisplay = document.getElementById("descriptionDisplay")
const difficultyDisplayid = document.getElementById("difficultyDisplayid")
const tagBoxDisplay = document.getElementById("tagBoxDisplay")
const createdOn = document.getElementById("createdOn")
const createdBy = document.getElementById("createdBy")

export function displayQuest(quest) {
    if (state.selectedQuest) {
        titleDisplay.textContent = state.selectedQuest.title
        descriptionDisplay.textContent = state.selectedQuest.description
        difficultyDisplayid.textContent = state.selectedQuest.difficulty
        createdBy.textContent = `Posted by: ${state.selectedQuest.creator}`
        createdOn.textContent = `Posted on: ${state.selectedQuest.created_at}`
        tagBoxDisplay.innerHTML = "";
        state.selectedQuest.tags.forEach(tag => {
            const tagDiv = document.createElement("div");
            tagDiv.classList.add("tagDisplay");
            tagDiv.textContent = tag;

            tagBoxDisplay.appendChild(tagDiv);

        });


        displayPopup.style.display = "block"
        overlay.style.display = "block"
    }

}
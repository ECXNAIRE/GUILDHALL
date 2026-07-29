import { state } from "./state.js";

const suggestionBox = document.getElementById("tag-suggestions");
const selectedBox = document.getElementById("selectedTags")
const tagSearch = document.getElementById("tagSearch")
const addQuestBtn = document.getElementById("addQuest")
const questPopup = document.getElementById("questPopup")
const overlay = document.getElementById("overlay")
const displayPopup = document.getElementById("questDisplayPopup")


const allTags = [
    "Python",
    "JavaScript",
    "Frontend",
    "Backend",
    "React",
    "Flask",
    "Django",
    "HTML",
    "CSS",
    "AI",
    "Machine Learning",
    "Database",
    "DevOps",
    "Mobile Dev"
]

let selectedTags = []

function renderSuggestions() {
    suggestionBox.innerHTML = ""

    const search = tagSearch.value.toLocaleLowerCase()


    allTags.filter(tag => tag.toLocaleLowerCase().includes(search) && !selectedTags.includes(tag)).forEach(tag => {
        const div = document.createElement("div")
        div.className = "suggestion"
        div.textContent = tag

        div.onclick = () => {
            selectedTags.push(tag);
            renderSelectedTags();
            renderSuggestions()

        }

        suggestionBox.appendChild(div)
    })

}

renderSuggestions()



function renderSelectedTags() {
    selectedBox.innerHTML = ""
    selectedTags.forEach(tag => {
        const chip = document.createElement("div")
        chip.className = "tag"
        chip.textContent = tag

        chip.onclick = () => {
            selectedTags = selectedTags.filter(t => t !== tag)

            renderSelectedTags()
            renderSuggestions()
        }
        selectedBox.appendChild(chip)
    });
}


tagSearch.addEventListener("input", renderSuggestions)





addQuestBtn.addEventListener("click", () => {
    questPopup.style.display = "block"
    overlay.style.display = "block"
})

overlay.addEventListener("click", () => {
    questPopup.style.display = "none";
    overlay.style.display = "none";
    displayPopup.style.display = "none"

});



//DIFFICULTY LEVEL 
document.querySelectorAll(".difficultyBtn").forEach(button => {
    button.addEventListener("click", () => {
        state.difficultyLevel = button.dataset.difficulty
        document.querySelector(".difficultyBtn.active").classList.remove("active")

        button.classList.add("active")
    })
})





document.getElementById("confirmBtn").addEventListener("click", async() => {
    const titleValue = document.getElementById("titleTextArea").value
    const descriptionValue = document.getElementById("descriptionTextArea").value
    const userID = document.getElementById("userID").textContent


    const response = await fetch("/createQuest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: titleValue,
            description: descriptionValue,
            tags: selectedTags,
            difficulty: state.difficultyLevel,
            guild: state.selectedGuild,
            userID: userID
        })
    })

    const data = await response.json()
    console.log(data)
})




const questDisplayPopup = document.getElementById("questDisplayPopup")
const pledgePopup = document.getElementById("pledgePopup")
document.getElementById("acceptBtn").addEventListener("click", () => {
    questDisplayPopup.style.display = "none"
    pledgePopup.style.display = "block"
})







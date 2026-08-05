import { state } from "./state.js";
import { allTags } from "./allTags.js";


const skillsSearch = document.getElementById("skillsSearch")
const suggestionBox = document.getElementById("skills-suggestions")
const selectedBox = document.getElementById("selectedskills")

const allSkills = allTags

export let selectedSkills = []
renderSelectedSkills()
renderSuggestions()

export function renderSuggestions() {
    suggestionBox.innerHTML = ""

    const search = skillsSearch.value.toLocaleLowerCase()


    allSkills.filter(skill => skill.toLocaleLowerCase().includes(search) && !selectedSkills.includes(skill)).forEach(skill => {
        const div = document.createElement("div")

        div.className = "suggestions"
        div.textContent = skill

        div.onclick = () => {
            selectedSkills.push(skill)
            renderSuggestions()
            renderSelectedSkills()
        }

        suggestionBox.appendChild(div)
    })

}

renderSuggestions()


export function renderSelectedSkills() {
    selectedBox.innerHTML = ""

    selectedSkills.forEach(skill => {
        const chip = document.createElement("div")
        chip.className = "skill"
        chip.textContent = skill
        chip.onclick = () => {
            selectedSkills = selectedSkills.filter(t => t !== skill)

            renderSelectedSkills()
            renderSuggestions()
        }

        selectedBox.appendChild(chip)
    })
}

skillsSearch.addEventListener("input", renderSuggestions)



/// PROFILE DATAA

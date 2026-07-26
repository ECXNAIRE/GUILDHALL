const suggestionBox = document.getElementById("tag-suggestions");
const selectedBox = document.getElementById("selectedTags")


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
    allTags.forEach(tag => {
        const div = document.createElement("div")

        div.className = "suggestion";
        div.textContent = tag

        div.onclick = () => {
            if(selectedTags.includes(tag)) return
            selectedTags.push(tag)
            renderSelectedTags()
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
        selectedBox.appendChild(chip)
    });
}
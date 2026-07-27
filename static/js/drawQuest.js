


export function questLayout(quests) {
    quests.sort((a, b) =>
        new Date(a.created_at) - new Date(b.created_at)
    );

    const latest = quests.length - 1

    quests.forEach((quest, i) => {
        if (i === latest) {
            quest.x = 0
            quest.y = 0
            quest.rotation = 0
            return
        }

        const seed = new Date(quest.created_at).getTime()

        const angle = seededRandom(seed) * Math.PI * 2

        const distance = 250 + seededRandom( seed + 1) * 500

        quest.x = Math.cos(angle) * distance
        quest.y = Math.sin(angle) * distance

        quest.rotation = (seededRandom(seed + 2) - 0.5) * 0.3
    })

    return quests
}




function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}
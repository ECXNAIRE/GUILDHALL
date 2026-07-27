import { roughLine } from "./strokeEditor.js";


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

        const distance = 250 + seededRandom(seed + 1) * 500

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




export function drawQuestCard(ctx, quest) {
    const width = 320 //FOR NOW ITS FIXED
    const height = 220
    const seed = new Date(quest.created_at).getTime();

    ctx.save()

    ctx.translate(quest.x, quest.y)
    ctx.rotate(quest.rotation)

    ctx.fillStyle = "#F4E7BE"
    ctx.fillRect(-width / 2, -height / 2, width, height)
    ctx.lineWidth = 2
    ctx.strokeStyle = "#5E3B1A"
    roughLine(ctx, -width / 2, -height / 2, width / 2, -height / 2, seed, 1.5);
    roughLine(ctx, width / 2, -height / 2, width / 2, height / 2, seed + 1, 1.5);
    roughLine(ctx, width / 2, height / 2, -width / 2, height / 2, seed + 2, 1.5);
    roughLine(ctx, -width / 2, height / 2, -width / 2, -height / 2, seed + 3, 1.5);


    ctx.fillStyle = "#5E3B1A";
    ctx.font = "bold 20px font1";
    ctx.fillText(`TITLE: ${quest.title}`, -width / 2 + 15, -height / 2 + 23);


    ctx.fillStyle = "#5E3B1A";
    ctx.font = "14px font1";

    quest.tags.forEach((tag, i) => {
        ctx.fillText(
            "#" + tag,
            -width / 2 + 15,
            -height / 2 + 70 + i * 22
        );
    });


    ctx.font = "bold 14px font1"
    ctx.fillText(
        quest.difficulty,
        -width / 2 + 15,
        height / 2 - 20
    )

    ctx.restore()

}

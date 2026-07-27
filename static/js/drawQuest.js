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
    const width = 380 //FOR NOW ITS FIXED
    const padding = 20
    const seed = new Date(quest.created_at).getTime();

    ctx.font = "bold 20px font1";
    const titleLines = wrapText(ctx, quest.title, width - padding * 2);

    ctx.font = "24px font1";
    const tagLineHeight = 22;
    const titleLineHeight = 30;
    const titleGap = 18;
    const tagGap = 18;
    const bottomPadding = 18;

    const height =
        padding +
        titleLines.length * titleLineHeight +
        titleGap +
        quest.tags.length * tagLineHeight +
        tagGap +
        20 +
        bottomPadding;
    ctx.save()

    ctx.translate(quest.x, quest.y)
    ctx.rotate(quest.rotation)

    ctx.fillStyle = "#F4E7BE"
    ctx.fillRect(-width / 2, -height / 2, width, height)

    ctx.shadowColor = "rgba(0,0,0,0.28)";
    ctx.shadowBlur = 12
    ctx.shadowOffsetX = 4
    ctx.shadowOffsetY = 5
    ctx.fillStyle = "#F4E7BE"
    ctx.fillRect(-width / 2, -height / 2, width, height)


    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;


    ctx.lineWidth = 2
    ctx.strokeStyle = "#5E3B1A";



    roughLine(ctx, -width / 2, -height / 2, width / 2, -height / 2, seed, 1.5);
    roughLine(ctx, width / 2, -height / 2, width / 2, height / 2, seed + 1, 1.5);
    roughLine(ctx, width / 2, height / 2, -width / 2, height / 2, seed + 2, 1.5);
    roughLine(ctx, -width / 2, height / 2, -width / 2, -height / 2, seed + 3, 1.5);



    const pinX = 0
    const pinY = -height / 2 + 10

    ctx.beginPath()
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.arc(pinX + 2, pinY + 2, 8, 0, Math.PI * 2);
    ctx.fill()


    const gradient = ctx.createRadialGradient(
        pinX - 2, pinY - 2, 1,
        pinX, pinY, 8
    )

    gradient.addColorStop(0, "#FFE79A");
    gradient.addColorStop(0.4, "#D8A73B");
    gradient.addColorStop(1, "#8C5B10");

    ctx.beginPath()
    ctx.fillStyle = gradient
    ctx.arc(pinX, pinY, 8, 0, Math.PI * 2)
    ctx.fill()


    ctx.lineWidth = 1.5
    ctx.strokeStyle = "#6F4510";
    ctx.stroke();


    ctx.beginPath()
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.arc(pinX - 2.5, pinY - 2.5, 2.2, 0, Math.PI * 2)
    ctx.fill()



    ctx.fillStyle = "#5E3B1A";
    ctx.font = "bold 24px font1";
    let y = -height / 2 + padding + 20

    titleLines.forEach(line => {
        ctx.fillText(
            line,
            -width / 2 + padding,
            y
        );

        y += titleLineHeight;
    });


    y += 15;

    ctx.fillStyle = "#5E3B1A";
    ctx.font = "16px font1";
    quest.tags.forEach(tag => {
        ctx.fillText(
            "#" + tag,
            -width / 2 + padding,
            y
        );

        y += tagLineHeight;
    });


    y += 15;



    ctx.font = "bold 16px font1";

    ctx.fillText(
        quest.difficulty,
        -width / 2 + padding,
        y
    );
    ctx.restore()

}




function wrapText(ctx, text, maxWidth) {
    const words = text.split(" ")

    const lines = []
    let line = ""

    for (const word of words) {
        const testLine = line + word + " "

        if (ctx.measureText(testLine).width > maxWidth && line !== "") {
            lines.push(line.trim())
            line = word + " "
        } else {
            line = testLine
        }
    }

    if (line) {
        lines.push(line.trim())
    }

    return lines
}

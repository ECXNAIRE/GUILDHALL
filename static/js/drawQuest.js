import { worldCanvas, worldCtx } from "./canvas.js";
import { roughLine } from "./strokeEditor.js";
import { state } from "./state.js";

export function questLayout(quests) {
    quests.sort((a, b) =>
        new Date(a.created_at) - new Date(b.created_at)
    );
    const GAP = 150


    const latest = quests.length - 1

    quests.forEach((quest, i) => {
        if (i === latest) {
            quest.x = 0
            quest.y = 0
            quest.rotation = 0
            return
        }

        if (!quest.width) {
            const size = getQuestSize(worldCtx, quest)

            quest.width = size.width
            quest.height = size.height
        }


        const currentWidth = quest.width;
        const currentHeight = quest.height;

        const seed = new Date(quest.created_at).getTime()

        const ANGLE_STEP = Math.PI / 18
        const RADIUS_STEP = 90

        let maxRadius = 6000
        let startRadius = 250

        let placedSuccessfully = false

        while (!placedSuccessfully) {
            for (
                let radius = startRadius;
                radius <= maxRadius && !placedSuccessfully;
                radius += RADIUS_STEP
            ) {
                const angleOffset = seededRandom(seed) * Math.PI * 2

                for (let angle = 0;
                    angle < Math.PI * 2;
                    angle += ANGLE_STEP
                ) {
                    const finalAngle = angle + angleOffset
                    const x = Math.cos(finalAngle) * radius
                    const y = Math.sin(finalAngle) * radius

                    let overlaps = false

                    for (const placed of quests.slice(0, i)) {
                        if (placed.x === undefined) continue

                        const dx = x - placed.x
                        const dy = y - placed.y

                        const distance = Math.hypot(dx, dy)

                        const minDistance = Math.max(currentWidth, currentHeight) / 2 +
                            Math.max(placed.width, placed.height) / 2 +
                            GAP


                        if (distance < minDistance) {
                            overlaps = true
                            break
                        }
                    }

                    if (!overlaps) {
                        quest.x = x
                        quest.y = y
                        quest.rotation = (seededRandom(seed + 500) - 0.5) * 0.12

                        placedSuccessfully = true
                        break
                    }
                }
            }
            if (!placedSuccessfully) {
                startRadius = maxRadius + RADIUS_STEP
                maxRadius += 1000
            }
        }
    })

    return quests
}




function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}




export function drawQuestCard(ctx, quest) {
    let yOffset = 0


    const {
        width,
        height,
        titleLines,
        descriptionLines
    } = getQuestSize(ctx, quest);

    const seed = new Date(quest.created_at).getTime();
    const padding = 20;
    const titleLineHeight = 30;
    const descriptionLineHeight = 20;
    const tagLineHeight = 22;



    quest.width = width;
    quest.height = height;

    const postedDate = new Date(quest.created_at).toLocaleTimeString(
        "en-GB",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    )



    ctx.save()
    ctx.translate(quest.x, quest.y + yOffset)
    ctx.rotate(quest.rotation)

    let paperColor = "#F4E7BE"

    ctx.shadowColor = "rgba(0,0,0,0.28)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = paperColor
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


    ctx.fillStyle = "rgba(80,60,30,0.08)";

    for (let i = 0; i < 300; i++) {
        const x = -width / 2 + seededRandom(seed + i * 3) * width
        const y = -height / 2 + seededRandom(seed + i * 3 + 1) * height

        ctx.fillRect(x, y, 2, 2);
    }

    ctx.strokeStyle = "rgba(90,70,40,0.06)";
    ctx.lineWidth = 0.5

    for (let i = 0; i < 150; i++) {
        const x = -width / 2 + seededRandom(seed + i * 4) * width
        const y = -height / 2 + seededRandom(seed + i * 4 + 1) * height


        const len = 2 + seededRandom(seed + i * 4 + 2) * 5;
        const angle = seededRandom(seed + i * 4 + 3) * Math.PI * 2;

        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(
            x, Math.cos(angle) * len,
            y + Math.sin(angle) * len
        )

        ctx.stroke()

    }


    ctx.strokeStyle = "rgba(90,70,40,0.05)";
    ctx.lineWidth = 1;

    roughLine(
        ctx,
        -width / 2 + 40,
        -height / 2 + 20,
        width / 2 - 30,
        height / 2 - 40,
        seed + 800,
        4
    );

    roughLine(
        ctx,
        -width / 2 + 70,
        height / 2 - 30,
        width / 2 - 60,
        -height / 2 + 40,
        seed + 801,
        4
    );



    //PIN STARTS HERE DONT CONFUSE
    const pinX = 0
    const pinY = -height / 2 + 10

    ctx.beginPath()
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.arc(pinX + 2, pinY + 2, 8, 0, Math.PI * 2);
    ctx.fill()

    let outerLight, outerMid, outerDark
    let gemLight = null
    let gemDark = null


    switch (quest.difficulty.toLowerCase()) {

        case "low":
            outerLight = "#F6D58A"
            outerMid = "#C58A2C"
            outerDark = "#7A4F16"
            break


        case "medium":
            outerLight = "#FFFFFF"
            outerMid = "#C7CDD2"
            outerDark = "#7A828A"
            break


        case "hard":
            outerLight = "#FFF2A8"
            outerMid = "#E2B43B"
            outerDark = "#8A5A10"
            break


        case "legendary":
            outerLight = "#FF7C88";
            outerMid = "#C61E3A";
            outerDark = "#5E0013";

            gemLight = null
            gemDark = null
            break
    }


    const gradient = ctx.createRadialGradient(
        pinX - 2,
        pinY - 2,
        1,
        pinX,
        pinY,
        8
    );
    gradient.addColorStop(0, outerLight);
    gradient.addColorStop(0.45, outerMid);
    gradient.addColorStop(1, outerDark);



    ctx.beginPath()
    ctx.fillStyle = gradient
    ctx.arc(pinX, pinY, 8, 0, Math.PI * 2)
    ctx.fill()


    ctx.lineWidth = 1.5
    ctx.strokeStyle = outerDark;
    ctx.stroke();


    ctx.beginPath()
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.arc(pinX - 2.5, pinY - 2.5, 2.2, 0, Math.PI * 2)
    ctx.fill()

    ctx.texAlign = "left"
    let y = -height / 2 + padding + 10

    y += 16

    ctx.fillStyle = "rgba(94, 59, 26, 0.5)";
    ctx.font = "bold 12px font1"
    ctx.fillText(`Posted on: ${postedDate}`, -width / 2 + padding, y)


    y += 35

    ctx.fillStyle = "#5E3B1A";
    ctx.font = "bold 24px font1";
    titleLines.forEach(line => {
        ctx.fillText(
            line,
            -width / 2 + padding,
            y
        );

        y += titleLineHeight;
    });


    y += 15

    ctx.font = "15px font1"
    ctx.fillStyle = "rgba(70,55,35,0.9)";

    descriptionLines.forEach(line => {
        ctx.fillText(
            line,
            -width / 2 + padding,
            y
        );

        y += descriptionLineHeight;
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



function wrapTextLimited(ctx, text, maxWidth, maxLines) {
    const words = text.split(" ");

    const lines = [];
    let line = "";

    for (const word of words) {
        const testLine = line + word + " ";

        if (ctx.measureText(testLine).width > maxWidth && line !== "") {
            lines.push(line.trim());
            line = word + " ";

            if (lines.length === maxLines) break;
        } else {
            line = testLine;
        }
    }

    if (lines.length < maxLines && line) {
        lines.push(line.trim());
    }

    if (lines.length === maxLines) {
        lines[maxLines - 1] += "...";
    }

    return lines;
}


function getQuestSize(ctx, quest) {

    const width = 380 //FOR NOW ITS FIXED
    const padding = 20

    ctx.font = "bold 24px font1";
    const titleLines = wrapText(ctx, quest.title, width - padding * 2);

    ctx.font = "15px font1"

    const descriptionLines = wrapTextLimited(
        ctx,
        quest.description,
        width - padding * 2,
        3
    )

    ctx.font = "24px font1";
    const tagLineHeight = 22;
    const titleLineHeight = 30;
    const titleGap = 18;
    const tagGap = 18;
    const bottomPadding = 18;
    const descriptionLineHeight = 20;
    const descriptionGap = 15;


    const height =
        padding +
        titleLines.length * titleLineHeight +
        titleGap +
        descriptionLines.length * descriptionLineHeight +
        descriptionGap +
        quest.tags.length * tagLineHeight +
        tagGap +
        20 +
        bottomPadding +
        25 +
        16



    return { width, height, titleLines, descriptionLines }
}
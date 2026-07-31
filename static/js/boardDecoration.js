import { camera } from "./camera.js";
import { worldCanvas } from "./canvas.js";
import { getVisibleChunks } from "./boardChunks.js";


export function drawBoardDecoration(ctx) {
    const chunks = getVisibleChunks()

    for (const chunk of chunks) {
        drawChunk(ctx, chunk)
    }
}


function drawChunk(ctx, chunk) {

    // PIHOLES

    ctx.fillStyle = "rgba(40,25,10,.28)";

    for (const pin of chunk.pinholes) {

        ctx.beginPath();

        ctx.arc(pin.x, pin.y, pin.r, 0, Math.PI * 2);

        ctx.fill();

    }

    // GRAINS

    ctx.lineWidth = .6;

    for (const grain of chunk.grains) {

        ctx.strokeStyle = `rgba(95,70,35,${grain.opacity})`;

        ctx.beginPath();

        ctx.moveTo(grain.x, grain.y);

        ctx.lineTo(

            grain.x + Math.cos(grain.angle) * grain.length,
            grain.y + Math.sin(grain.angle) * grain.length

        );

        ctx.stroke();

    }

}
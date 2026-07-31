import { camera } from "./camera.js"
import { worldCanvas } from "./canvas.js"


const CHUNK_SIZE = 600
const chunks = new Map()




export function getVisibleChunks() {

    const left = Math.floor((-camera.x / camera.zoom) / CHUNK_SIZE)
    const right = Math.floor((-camera.x / camera.zoom + worldCanvas.width / camera.zoom) / CHUNK_SIZE)
    const top = Math.floor((-camera.y / camera.zoom) / CHUNK_SIZE)
    const bottom = Math.floor((-camera.y / camera.zoom + worldCanvas.height / camera.zoom) / CHUNK_SIZE)


    const visible = []

    for (let cx = left - 1; cx < right + 1; cx++) {
        for (let cy = top - 1; cy <= bottom; cy++) {
            visible.push(getChunk(cx, cy))
        }
    }

    return visible
}

function getChunk(cx, cy) {
    const key = `${cx}, ${cy}`

    if (!chunks.has(key)) {
        chunks.set(key, createChunk(cx, cy))
    }

    return chunks.get(key)
}


function createChunk(cx, cy) {
    const left = cx * CHUNK_SIZE
    const top = cy * CHUNK_SIZE


    const pinholes = []
    const grains = []

    const seed = cx * 928371 + cy * 123781


    for (let i = 0; i < 18; i++) {

        pinholes.push({

            x: left + seededRandom(seed + i) * CHUNK_SIZE,
            y: top + seededRandom(seed + i + 100) * CHUNK_SIZE,
            r: 0.8 + seededRandom(seed + i + 200) * 1.2

        });

    }

    for (let i = 0; i < 160; i++) {

        grains.push({

            x: left + seededRandom(seed + i + 500) * CHUNK_SIZE,
            y: top + seededRandom(seed + i + 900) * CHUNK_SIZE,

            angle: seededRandom(seed + i + 1200) * Math.PI * 2,
            length: 2 + seededRandom(seed + i + 1500) * 5,

            opacity: 0.02 + seededRandom(seed + i + 2000) * 0.5

        });

    }

    return {

        cx,
        cy,
        pinholes,
        grains

    };

}


function seededRandom(seed) {
    let x = Math.sin(seed) * 10000
    return x - Math.floor(x)
}
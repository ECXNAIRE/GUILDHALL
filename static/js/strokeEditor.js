function seededRandom(seed) {
    const x = Math.sin(seed) * 1000
    return x - Math.floor(x)
}



function randomOffset(seed, amount) {
    return (seededRandom(seed) - 0.5) * amount * 2
}


export function roughLine(ctx, x1, y1, x2, y2, seed, sloppiness = 2) {
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath()

        ctx.moveTo(
            x1 + randomOffset(seed + pass * 1000, sloppiness),
            y1 + randomOffset(seed + pass * 1000 + 1, sloppiness)
        )

        const steps = 8

        for (let i = 1; i <= steps; i++) {
            const t = i / steps

            const x =
                x1 + (x2 - x1) * t +
                randomOffset(
                    seed + pass * 1000 + i * 2,
                    sloppiness
                );

            const y =
                y1 + (y2 - y1) * t +
                randomOffset(
                    seed + pass * 1000 + i * 2 + 1,
                    sloppiness
                );



                ctx.lineTo(x, y)
        }

        ctx.stroke()

    }
}
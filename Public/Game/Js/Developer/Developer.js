export default class Developer {
    constructor (tileSize) {
        this.tileSize = tileSize;
        this.lineSize = 0.4;
        this.lineColor = "#44414B";
    }

    drawGrid (ctx, cXnull, cYnull) {
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = this.lineSize;

        // VERTICALES
        ctx.beginPath();
        ctx.moveTo((cXnull * this.tileSize), 0);
        ctx.lineTo((cXnull * this.tileSize), ctx.canvas.height);
        ctx.stroke();

        // HORIZONTALES
        ctx.beginPath();
        ctx.moveTo(0, ((cYnull - 0.5) * this.tileSize));
        ctx.lineTo(ctx.canvas.width, ((cYnull - 0.5) * this.tileSize));
        ctx.stroke();
    }

    drawCollision (ctx, cXnull, cYnull, mapCollision) {
        if (mapCollision[cYnull][cXnull] === 1) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
            ctx.fillRect((cXnull * this.tileSize), ((cYnull - 0.5) * this.tileSize), 32, 32);
        }
    }

    drawVisionNpc (ctx, visionDistance, posNow) {
        let initVisionX = posNow.x - visionDistance;
        let initVisionY = posNow.y - visionDistance;
        let endVisionX = initVisionX + (visionDistance * 2);
        let endVisionY = initVisionY + (visionDistance * 2);

        for (; initVisionY <= endVisionY; initVisionY++) {
            for (let x = initVisionX; x <= endVisionX; x++) {
                ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
                ctx.fillRect((x * this.tileSize), ((initVisionY - 0.5) * this.tileSize), 32, 32);
            }
        }
    }
}
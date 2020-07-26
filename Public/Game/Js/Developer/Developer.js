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
            ctx.fillStyle = "#FF0000";
            ctx.fillRect((cXnull * this.tileSize), ((cYnull - 0.5) * this.tileSize), 32, 32);
        }
    }
}
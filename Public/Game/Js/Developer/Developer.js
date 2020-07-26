export default class Developer {
    constructor (tileSize) {
        this.tileSize = tileSize;
        this.lineSize = 0.4;
        this.lineColor = "#44414B";
    }

    drawGrid (ctx, cXnull, cYnull, width, height) {
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = this.lineSize;

        console.log(cXnull +" - "+ cYnull);

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
        /*
        var columnas = [];
        var filas = [];
        for (i = disX; i < canvas.width; i += disX) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
            columnas.push(i);
        }
        for (i = disY; i < canvas.height; i += disY) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(ctx.canvas.width, i);
            ctx.stroke();
            filas.push(i);
        }
        columnas.push(0);
        filas.push(0);
        for (x = 0; x < columnas.length; x++) {
            for (y = 0; y < filas.length; y++) {
                cuadritos.push([columnas[x], filas[y], disX, disY]);
            }
        }
        */
    }
}
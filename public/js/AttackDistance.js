class AttackDistance {
    constructor (start, end, radius, time) {
        console.log("Start: "+ start.x +"-"+ start.y +"---"+ end.x +"-"+ end.y);
        this.start = {x: (start.x * 32), y: (start.y * 32)};
        this.end = {x: (end.x * 32), y: (end.y * 32)};
        this.radius = radius;
        //this.scale=1;
        this.rotation = 0;
        this.speed = 0;
        this.timer = time;
    }
    
    distance () {
        var dx = this.start.x - this.end.x;
        var dy = this.start.y - this.end.y;
        return (Math.sqrt(dx*dx+dy*dy) - (this.radius*2));
    }
    /*
    distance (circle) {
        if (circle != null) {
            var dx = this.x - circle.x;
            var dy = this.y - circle.y;
            return (Math.sqrt(dx*dx+dy*dy)-(this.radius+circle.radius));
        }
    }
    */
    
    getPos () {
        return {x: Math.round(this.start.x/32), y: Math.round(this.start.y/32)};
    }
    
    getAngle () {
        return (Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x));
    }
    
    move (angle, speed) {
        if (speed != null) {
            this.start.x += Math.cos(angle) * speed;
            this.start.y += Math.sin(angle) * speed;
        }
    }
    
    stroke (ctx) {
        ctx.beginPath();
        ctx.arc(this.start.x, this.start.y, this.radius, 0, Math.PI*2, true);
        ctx.stroke();
    }
    /*
    stroke (ctx, w, h) {
        ctx.beginPath();
        ctx.arc((w * 32), (h * 32), this.radius, 0, Math.PI*2, true);
        ctx.stroke();
    }
    */
    drawImageArea (ctx, img, sx, sy, sw, sh) {
        if (img.width) {
            ctx.save();
            ctx.translate(this.x,this.y);
            //ctx.scale(this.scale,this.scale);
            ctx.rotate(this.rotation*Math.PI/180);
            ctx.drawImage(img, sx, sy, sw, sh, -this.radius, -this.radius, this.radius*2, this.radius*2);
            ctx.restore();
        }
        else
            this.stroke(ctx);
    }
    
/* ------------------------------ *
    FUNCIONES
 * ------------------------------ */

    // Actualiza la posicion del jugador remoto
    posNow (widthMap, heightMap, posWorld) {

        let posIntX = Math.floor(posWorld.x - widthMap),
            posIntY = Math.floor(posWorld.y - heightMap),
            posEndX = Math.floor(posWorld.x + widthMap),
            posEndY = Math.floor(posWorld.y + heightMap);

        if ((posIntX >= this.start.x || this.start.x <= posEndX) && (posIntY >= this.start.y || this.start.y <= posEndY)) {
            for(let y = 0, intY = posIntY; intY <= posEndY; intY++, y++) {
                for(let x = 0, intX = posIntX; intX <= posEndX; intX++, x++) {

                    if (this.start.x == intX && this.start.y == intY) {
                        return {x: x, y: y};
                    }
                }
            }
        }

        return false;
    }
    
}
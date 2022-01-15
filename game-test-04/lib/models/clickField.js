const TTL_DEFAULT = 50;

export function ClickField({x, y, radius}) {
    this.radius = radius;
    this.force = radius;
    this.backgroundColor = '#ff0000';
    this.borderColor = '#ff0000';
    this.ttl = TTL_DEFAULT;
    this.pos = {
        x: x,
        y: y
    };
    this.renderOn = (canvas2D) => {

        canvas2D.globalAlpha = Math.max(this.ttl / TTL_DEFAULT, 0.2);

        canvas2D.beginPath();
        canvas2D.arc(this.pos.x, this.pos.y, 3, 0, 2 * Math.PI);
        canvas2D.fillStyle = this.backgroundColor;
        canvas2D.fill();

        canvas2D.beginPath();
        canvas2D.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        canvas2D.strokeStyle = this.borderColor;
        canvas2D.stroke();

        canvas2D.globalAlpha = 1;

        this.ttl--;
    }
}

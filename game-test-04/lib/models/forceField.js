export function ForceField({x, y, force, radius}) {
    this.force = force;
    this.radius = radius;
    this.borderColor = '#ffc200';
    this.pos = {
        x: x,
        y: y
    };
    this.renderOn = (canvas2D) => {
        canvas2D.beginPath();
        canvas2D.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        canvas2D.strokeStyle = this.borderColor;
        canvas2D.stroke();
    }
}

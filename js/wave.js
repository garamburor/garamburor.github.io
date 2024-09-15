class Wave {
  constructor(shift) {
    this.shift = shift;
    this.angle = 0;
    this.movement = 0;
    this.period = 2.1;
  }
  
  display() {
    for (let i=0; i<=360; i++) {
      let x = map(i, 0, 360, -r, r);
      let amplitude = r * sqrt(1- pow((x/r), 2));
      let y = amplitude*sin((i - this.angle + this.shift*this.movement)*this.period);
      ellipse(x, y, 1, 1);
    }
    
  }
  
  move() {
    this.angle += 6;
    this.movement = (cos(this.angle * 0.5) - 1)*0.5;
  }
}

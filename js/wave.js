class Wave {
  constructor(shift) {
    this.shift = shift;
    this.angle = 0;
    this.movement = 0;
    this.period = 2.1;
    this.increment = 6;
  }
  
  display() {
    beginShape();
    for (let i=0; i<=360; i += this.increment) {
      // Map from angle to circle's size
      let x = map(i, 0, 360, -r, r);
      // Determine amplitude of sine
      let amplitude = r * sqrt(1- pow((x/r), 2));
      // Plot each point of the sine with the corresponding phase shift
      let y = amplitude*sin((i - this.angle + this.shift*this.movement)*this.period);
      vertex(x, y);
    }
    endShape(); 
    
  }
  
  move() {
    // Angle increment per fps
    this.angle += 6;
    this.movement = (cos(this.angle * 0.5) - 1)*0.5;
  }
}

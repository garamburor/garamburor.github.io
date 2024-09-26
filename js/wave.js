class Wave {
  constructor(shift) {
    this.shift = shift; // phase shift between each sine
    this.angle = 0; // angle of sine
    this.movement = 0; // phase shift multiplier
    this.period = 2.1; // visible period
    this.increment = 6; // distance between lines
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
      // Normally use lines to draw
      if (gameMode == 0) {
        vertex(x, y);
      } // For easter egg, use discrete points
      else {
        ellipse(x, y, 1, 1);
      }
    }
    endShape(); 
  }
  
  move() {
    // Angle increment per fps
    this.angle += 6;
    // Dynamically change phase shift
    this.movement = (cos(this.angle * 0.5) - 1)*0.5;
  }
}

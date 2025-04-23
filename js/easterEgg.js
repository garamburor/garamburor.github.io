let clicked = 0;
let gameMode = 0;
let easterEggTimer = null;
let knobLock1 = 0;
let knobLock2 = 0;

function easterEggSetup() {
  // For easter egg
  document.body.addEventListener("mousemove", rotateKnob);
  document.body.addEventListener("touchmove", touchKnob, {passive: false});
  document.body.addEventListener("mouseup", mouseUp);
  document.body.addEventListener("touchend", mouseUp);
  document.body.addEventListener("touchcancel", mouseUp);
  document.getElementById("Gknob").addEventListener("mousedown", mouseDown);
  document.getElementById("Gknob").addEventListener("touchstart", mouseDown);
}

function touchKnob(event) {
  //event.preventDefault();
  if (clicked == 1 && gameMode == 1) {
    let el = document.getElementById("Gknob")
    const rect = el.getBoundingClientRect();
    let targetAngle;
    let str1 = "rotate("
    let str2 = "deg)"
    // Calculate angle
    targetAngle = Math.atan2(event.touches[0].clientY - rect.top - (rect.bottom - rect.top) * 0.5, event.touches[0].clientX - rect.left - (rect.right - rect.left) * 0.5);
    targetAngle = Math.round(targetAngle * 180 / Math.PI);
    targetAngle += 180;
    targetAngle = (targetAngle + 90) % 360;
    // Clip angle
    if (targetAngle >= 315) {targetAngle = 315};
    if (targetAngle <= 45) {targetAngle = 45};
    // Map it to points of logo
    let fun = (targetAngle - 30) / 320;
    for (let i=0; i<num; i++) {
      waves[i].increment = map(fun, 0, 1, 60, 1);
      waves[i].period = map(fun, 0, 1, 1, 8);
    }
    // Rotate G
    targetAngle -= 270;
    el.style.transform = str1.concat(targetAngle.toString(), str2);
  }
}

function rotateKnob(event) {
  let el = document.getElementById("Gknob")
  if (clicked == 1 && gameMode == 1) {
    
    const rect = el.getBoundingClientRect();
    let targetAngle;
    let str1 = "rotate("
    let str2 = "deg)"
    // Calculate angle
    targetAngle = Math.atan2(event.clientY - rect.top - (rect.bottom - rect.top) * 0.5, event.clientX - rect.left - (rect.right - rect.left) * 0.5);
    targetAngle = Math.round(targetAngle * 180 / Math.PI);
    targetAngle += 180;
    targetAngle = (targetAngle + 90) % 360;
    // Clip angle
    if (targetAngle >= 315) 
      {targetAngle = 315};
    if (targetAngle <= 45) 
      {targetAngle = 45};
    // Map it to points of logo
    let fun = (targetAngle - 30) / 320;
    for (let i=0; i<num; i++) {
      waves[i].increment = map(fun, 0, 1, 60, 1);
      waves[i].period = map(fun, 0, 1, 0.7, 4.1);
    }
    // Rotate G
    targetAngle -= 270;
    el.style.transform = str1.concat(targetAngle.toString(), str2);
  }
}

// Handle mouseUp for knob
function mouseUp(evt) {
  // evt.preventDefault();
  clicked = 0;
  clearInterval(easterEggTimer);
  easterEggTimer = setTimeout(function() {gameMode = 0;
  for (let i=0; i<num; i++) {
    waves[i].increment = 6;
    waves[i].period = 2.1;
  }
  document.getElementById("Gknob").style.transition = 'font-size var(--tau) ease-in-out, opacity ' + 
  'var(--tau) ease-in-out, width var(--tau) ease-in-out, max-width var(--tau)' + 
  ' ease-in-out, transform var(--long-tau) ease-in-out';
  document.getElementById("Gknob").style.transform = "rotate(0deg)";
  }, 1000);
  
}

// Handle mouseDown for knob
function mouseDown(evt) {
  evt.preventDefault();
  document.getElementById("Gknob").style.transitionProperty = "font-size, opacity, max-width, width";
  gameMode = 1;
  clicked = 1;
  clearInterval(easterEggTimer);
}

// Sketch for about photo
const sketch2 = p => {
  let img1, modImg;
  let j;
  let x;
  let y;
  let coord;
  let canvas;
  let aspectRatio;
  let imgWidth, imgHeight;
  let mouseX, mouseY;
  let insideLock = 0;
  let quadrant;

  // Load content before processing
  p.preload = function() {
    // Get original aspect ratio from image
    img1 = p.loadImage('media/portrait.jpg'); 
    aspectRatio = 1067 / 1600;
  }

  // Set stuff before running loop
  p.setup = function() {
    // Adjust image size while preserving aspect ratio
    imgHeight = p.windowHeight * 0.6
    imgWidth = imgHeight * aspectRatio
    // Set canvas
    canvas = p.createCanvas(p.windowWidth, imgHeight);
    canvas.position(0, 0, 'relative');
    p.windowResized();
    // Set frame rate
    p.frameRate(24);
  }

  // Adjust image if window changes size
  p.windowResized = function() {
    imgHeight = p.windowHeight * 0.6
    imgWidth = imgHeight * aspectRatio
    p.resizeCanvas(p.windowWidth, imgHeight);
  }

  // Main loop
  p.draw = function() {
    // Clear canvas
    p.clear();
    // Load frame of video
    modImg = img1.get();
    modImg.loadPixels();
    // Reset coordiante counter
    j = 0;
    // Clamp x coordinates to image position
    mouseX = p.constrain(p.mouseX, (p.width - imgWidth) * 0.5, (p.width + imgWidth) * 0.5)
    // Map to be 0 until image width
    mouseX = Math.floor(p.map(mouseX, (p.width - imgWidth) * 0.5, (p.width + imgWidth) * 0.5, 0, modImg.width));
    // There's no need to clamp for mouseY since the canvas and image
    // have the same height, just map
    mouseY = Math.floor(p.map(p.mouseY, 0, p.height, 0, modImg.height));
    // Check if mouse is hovering over image or not
    if(p.mouseX >= (p.width - imgWidth) * 0.5 && p.mouseX <= (p.width + imgWidth) * 0.5) {
      if(p.mouseY >= 0 && p.mouseY <= imgHeight) {
        insideLock = 1;
      }
      else {
        insideLock = 0;
      }
    }
    else {
      insideLock = 0;
    }

    // Detec from which quadrant of the image the mouse has entered
    if (insideLock == 0) {
      if (mouseX < modImg.width * 0.5 && mouseY < modImg.height * 0.5) {
        quadrant = 0;
      } else if (mouseX > modImg.width * 0.5 && mouseY < modImg.height * 0.5) {
        quadrant = 1;
      } else if (mouseX < modImg.width * 0.5 && mouseY > modImg.height * 0.5) {
        quadrant = 2;
      } else {
        quadrant = 3;
      }
    }

    // Pixel transform
    for (var i = 0; i < modImg.pixels.length; i += 4) {
        // Get cartesian coordinates of pixels
        y = Math.floor(j / modImg.width);
        x = j % modImg.width;
        j += 1;
        coord = (mouseX + y * modImg.width) * 4;

        // Repeat horizontally the pixel the mouse is hovering on
        if (insideLock) {
        if (quadrant == 0) {
            if(x < mouseX && y < mouseY) {
              modImg.pixels[i + 0] = modImg.pixels[coord + 0];
              modImg.pixels[i + 1] = modImg.pixels[coord + 1];
              modImg.pixels[i + 2] = modImg.pixels[coord + 2];
              modImg.pixels[i + 3] = modImg.pixels[coord + 3];
            }
        }
        else if (quadrant == 1) {
          if(x > mouseX && y < mouseY) {
            modImg.pixels[i + 0] = modImg.pixels[coord + 0];
            modImg.pixels[i + 1] = modImg.pixels[coord + 1];
            modImg.pixels[i + 2] = modImg.pixels[coord + 2];
            modImg.pixels[i + 3] = modImg.pixels[coord + 3];
          }
        }
        else if (quadrant == 2) {
          if(x < mouseX && y > mouseY) {
            modImg.pixels[i + 0] = modImg.pixels[coord + 0];
            modImg.pixels[i + 1] = modImg.pixels[coord + 1];
            modImg.pixels[i + 2] = modImg.pixels[coord + 2];
            modImg.pixels[i + 3] = modImg.pixels[coord + 3];
          }
        }
        else if (quadrant == 3) {
          if(x > mouseX && y > mouseY) {
            modImg.pixels[i + 0] = modImg.pixels[coord + 0];
            modImg.pixels[i + 1] = modImg.pixels[coord + 1];
            modImg.pixels[i + 2] = modImg.pixels[coord + 2];
            modImg.pixels[i + 3] = modImg.pixels[coord + 3];
          }
        }
      }
    }
    // Update changes
    modImg.updatePixels();
    // Plot image
    p.image(modImg, (p.width - imgWidth) * 0.5, 0, imgWidth, imgHeight);
  }
}
// Create sketch
let instance2 = new p5(sketch2, 'portrait-container');

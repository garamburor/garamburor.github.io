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

function mouseDown(evt) {
  evt.preventDefault();
  document.getElementById("Gknob").style.transitionProperty = "font-size, opacity, max-width, width";
  gameMode = 1;
  clicked = 1;
  clearInterval(easterEggTimer);
}
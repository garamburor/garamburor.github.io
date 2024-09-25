let clicked = 0;
let gameMode = 0;
let easterEggTimer = null;

function touchKnob(event) {
  event.preventDefault();
  if (clicked == 1) {
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
    if (targetAngle >= 320) {targetAngle = 320};
    if (targetAngle <= 30) {targetAngle = 30};
    let fun = (targetAngle - 30) / 320;
    for (let i=0; i<num; i++) {
      waves[i].increment = map(fun, 0, 1, 60, 1);
      waves[i].period = map(fun, 0, 1, 1, 8);
    }
    targetAngle -= 270;
    el.style.transform = str1.concat(targetAngle.toString(), str2);
  }
}

function rotateKnob(event) {
  if (clicked == 1) {
    let el = document.getElementById("Gknob")
    const rect = el.getBoundingClientRect();
    let targetAngle;
    let str1 = "rotate("
    let str2 = "deg)"
    // Calculate angle
    targetAngle = Math.atan2(event.clientY - rect.top - (rect.bottom - rect.top) * 0.5, event.clientX - rect.left - (rect.right - rect.left) * 0.5);
    targetAngle = Math.round(targetAngle * 180 / Math.PI);
    targetAngle += 180;
    targetAngle = (targetAngle + 90) % 360;
    if (targetAngle >= 320) {targetAngle = 320};
    if (targetAngle <= 30) {targetAngle = 30};
    let fun = (targetAngle - 30) / 320;
    for (let i=0; i<num; i++) {
      waves[i].increment = map(fun, 0, 1, 60, 1);
      waves[i].period = map(fun, 0, 1, 0.7, 4.1);
    }
    targetAngle -= 270;
    el.style.transform = str1.concat(targetAngle.toString(), str2);
  }
}

function mouseUp(evt) {
  evt.preventDefault();
  clicked = 0;
  clearInterval(easterEggTimer);
  easterEggTimer = setTimeout(function() {gameMode = 0;
  for (let i=0; i<num; i++) {
    waves[i].increment = 6;
    waves[i].period = 2.1;
  }
  document.getElementById("Gknob").style.transitionProperty = "font-size, opacity, transform";
  document.getElementById("Gknob").style.transform = "rotate(0deg)";
  }, 2000);
  
}

function mouseDown(evt) {
  evt.preventDefault();
  document.getElementById("Gknob").style.transitionProperty = "font-size, opacity";
  gameMode = 1;
  clicked = 1;
  clearInterval(easterEggTimer);
}
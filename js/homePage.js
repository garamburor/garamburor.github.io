// p5js setup
function setup() {
  logoSetup();
  easterEggSetup();
  // Trigger animation
  textChange(0);
  document.getElementById('intro1').addEventListener("transitionend", trigFrame);
}

function steadyCover() {
  // Needed elements
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");
  let subt = document.getElementById("subt");

  // Make logo adjust to text
  document.getElementById('logo').style.position = "sticky";
  // Update cover text
  
  if (subtState == 1) {
    knob.style.overflow = 'hidden';
    knob.textContent = 'G';
    intro1.textContent = 'UILLERM';
    intro2.textContent = '';
  }
  else {
    knob.textContent = '';
    let splitText = titleText.split("O");
    intro1.textContent = splitText[0];
    intro2.textContent = splitText[1];
  }
  

  // Update cover width
  intro1.style.width = 'auto';
  intro2.style.width = 'auto';

  let elements = document.getElementsByClassName('title');
  for(let i = 0; i < elements.length; i++)
  {
    // Set animation for hiding text
    elements[i].style.animation = "widthOpen 500ms linear"
    // Once its done call the main cover
    elements[i].style.width = 1;
    elements[i].removeEventListener("animationend", steadyCover);
    // When animation is done, set overflow to visible for prettier window size changes
    elements[i].addEventListener("animationend", enableSmoothTransition);
  }
  // Show subtitles
  subt.style.opacity = subtState;
  if (subtState == 1) {
    subt.textContent = 'ARÁMBURO RODRÍGUEZ';
  }
  else {
    subt.textContent = '';
  }
  
}
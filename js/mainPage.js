// p5js setup
function setup() {
  logoSetup();
  easterEggSetup();
  menuSetup();
}

function steadyCover() {
  // Needed elements
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");
  let title = document.getElementById("title");
  let subt = document.getElementById("subt");

  // Make logo adjust to text
  document.getElementById('logo').style.position = "sticky";
  // Update cover text
  title.style.animation = "widthOpen 500ms linear"
  knob.style.overflow = 'hidden';
  knob.textContent = 'G';
  intro1.textContent = 'UILLERM';
  intro2.textContent = '';
  title.style.width = 1;

  // Update cover width
  intro1.style.width = 'auto';
  intro2.style.width = 'auto';

  // Show subtitles
  subt.style.opacity = 1;
  subt.textContent = 'ARAMBURO RODRIGUEZ';
  // Remove previous animation listeners
  title.removeEventListener("animationend", enableSmoothTransition);
  title.removeEventListener("animationend", steadyCover);
  // When animation is done, set overflow to visible for prettier window size changes
  title.addEventListener("animationend", enableSmoothTransition);
}
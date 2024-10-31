// p5js setup
function setup() {
  logoSetup();
  easterEggSetup();
  // Trigger animation if home is selected
  if (subtState == 1) {
    textChange(0);
    document.getElementById('intro1').addEventListener("transitionend", trigFrame);
  }
  else {
    menuSetup();
    document.getElementById("menu").style.opacity = 1;
    removeTab(currentPage);
    homeSetup();
    //steadyCover();
    let intro1 = document.getElementById("intro1");
    let intro2 = document.getElementById("intro2");
    let splitText = titleText.split("O");
    intro1.textContent = splitText[0];
    intro2.textContent = splitText[1];
    // Update cover width
    intro1.style.width = 'auto';
    intro2.style.width = 'auto';
    intro1.style.opacity = 1;
    intro2.style.opacity = 1;
    let elements = document.getElementsByClassName('title');
    for(let i = 0; i < elements.length; i++)
    {
      elements[i].style.transition = "width 450ms ease-in-out";
    }
  }
}

function steadyCover() {
  // Needed elements
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");
  let subt = document.getElementById("subt");

  // Make logo adjust to text
  document.getElementById('logo').style.position = "sticky";
  
  // Show subtitles
  subt.style.opacity = subtState;
  if (subtState == 1) {
    knob.style.overflow = 'hidden';
    knob.textContent = 'G';
    intro1.textContent = 'UILLERM';
    intro2.textContent = '';
    subt.textContent = 'ARÁMBURO RODRÍGUEZ';
  }
  else {
    knob.textContent = '';
    subt.textContent = '';
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
    elements[i].style.width = "100%"
    elements[i].removeEventListener("transitionend", steadyCover);
    // When animation is done, set overflow to visible for prettier window size changes
    elements[i].addEventListener("transitionend", enableSmoothTransition);
  }
  
}
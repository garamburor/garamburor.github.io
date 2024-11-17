// p5js setup
function setup() {
  logoSetup();
  easterEggSetup();

  // State machine?
  switch (currentPage) {
    case "home":
      textChange(0);
      document.getElementById('intro1').addEventListener("transitionend", trigFrame);
      break;
    case "about":
      // Add features of home navigation
      document.getElementById("home").textContent = "HOME";
      break;
  }
}

function steadyCover() {
  // Needed elements
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");
  let subt = document.getElementById("subt");
  let home = document.getElementById("home");

  // Make logo adjust to text
  document.getElementById('logo').style.position = "sticky";
  
  // Show subtitles
  switch (currentPage) {
    case "home":
      // Enable subtitles
      subt.style.opacity = 1;
      // Show main title
      knob.style.overflow = 'hidden';
      knob.textContent = 'G';
      intro1.textContent = 'UILLERM';
      intro2.textContent = '';
      subt.textContent = 'ARÁMBURO RODRÍGUEZ';
      // Disable home in nav
      home.style.opacity = 0;
      removeTab("home");
      break;
    default:
      // Activate home in nav
      home.style.opacity = 1;
      enableTab("home");
      // Disable subtitles
      if (subt.style.opacity != 0) {
        subt.style.opacity = 0;
        subt.addEventListener('transitionend', function byeSubs() {
          subt.textContent = '';
          document.getElementById('subt').removeEventListener('transitionend', byeSubs);
        })
      }
      // Remove knob
      knob.textContent = '';
      // Write new title
      let splitText = titleText.split("O");
      intro1.textContent = splitText[0];
      intro2.textContent = splitText[1];
      break;
  }
  // Update cover width
  intro1.style.width = 'auto';
  intro2.style.width = 'auto';
  let elements = document.getElementsByClassName('title');
  for(let i = 0; i < elements.length; i++)
  {
    // set text to be revealed
    elements[i].style.width = "100%";
    elements[i].addEventListener("transitionend", enableSmoothTransition);
  }
}
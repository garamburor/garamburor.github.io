let titleText = null;
var lastMove = [0, 0];

// Setup required for nav menu
function menuSetup(id) {
  menuEvent("about");
  menuEvent("contact");
  menuEvent("work");
  menuEvent("hme");
}

// Listeners to add for menu elements
function menuEvent(id) {
  document.getElementById(id).addEventListener("mouseenter", menuHoverIn);
  document.getElementById(id).addEventListener("touchstart", handleTouchStart);
  document.getElementById(id).addEventListener("touchmove", saveTouch, false);
  document.getElementById(id).addEventListener("touchend", handleTouchEnd);
  document.getElementById(id).addEventListener("touchcancel", handleTouchEnd);
  document.getElementById(id).addEventListener("mouseout", menuHoverOut);
}

/* Store last touch position */
function saveTouch(evt) {
  evt.preventDefault();
  lastMove[0] = evt.touches[0].clientX;
  lastMove[1] = evt.touches[0].clientY;
}

/* If finger is inside element, go to link, otherwise cancel */
function handleTouchEnd(e) {
  e.preventDefault();
  const rect = document.getElementById(e.target.id).getBoundingClientRect();
  if (lastMove[0] >= rect.x && lastMove[0] <= rect.right) {
    if (lastMove[1] >= rect.y && lastMove[1] <= rect.bottom) {
      e.target.click();
    }
    else {
      menuHoverOut();
    }
  }
  else {
    menuHoverOut();
  } 
}

function handleTouchStart(evt) {
  // Save coordinate for hover-like effect with touchscreens
  lastMove[0] = evt.touches[0].clientX;
  lastMove[1] = evt.touches[0].clientY;
  menuHoverIn(evt)
}

/* When mouse hovers nav element */
function menuHoverIn(evt) {
  // For touch devices
  evt.preventDefault();
  // Needed elements
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");
  let elements = document.getElementsByClassName('title');
  let subt = document.getElementById("subt");
  // Hide elements that don't fit width
  intro1.style.overflow = 'hidden';
  intro2.style.overflow = 'hidden';
  knob.style.overflow = 'hidden';
  // Remove subtitle
  subt.style.opacity = 0;
  // While letters are hidden, set new text and then open back
  titleText = evt.target.innerText;
  for(let i = 0; i < elements.length; i++)
    {
      // Hide letters by reducing width
      elements[i].style.animation = "widthClose 500ms linear";
      // Remove previous listeners
      elements[i].removeEventListener("animationend", enableSmoothTransition);
      elements[i].removeEventListener("animationend", steadyCover);
      elements[i].addEventListener("animationend", setTitle);
    }
}

/* Set main title text */
function setTitle() {
  // Needed elements
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let elements = document.getElementsByClassName('title');
  // Make sure G is not there
  document.getElementById("Gknob").textContent = "";
  // Split text where O is
  let splitText = titleText.split("O");
  intro1.textContent = splitText[0];
  intro2.textContent = splitText[1];
  for(let i = 0; i < elements.length; i++)
  {
    // set text to be revealed
    elements[i].style.animation = "widthOpen 500ms linear"
  } 
}

/* Makes overflow visible for prettier window size changes */
function enableSmoothTransition()  {
  document.getElementById("intro1").style.overflow = 'visible';
  document.getElementById("intro2").style.overflow = 'visible';
  document.getElementById("Gknob").style.overflow = 'visible';
};

/* When mouse leaves nav element */
function menuHoverOut() {
  let elements = document.getElementsByClassName('title');
  for(let i = 0; i < elements.length; i++)
  {
    // Make sure there are no events for prev animations
    elements[i].removeEventListener("animationend", enableSmoothTransition);
    elements[i].removeEventListener("animationend", setTitle);
    // Set animation for hiding text
    elements[i].style.animation = "widthClose 500ms linear";
    // Once its done call the main cover
    elements[i].addEventListener("animationend", steadyCover);
  } 
}
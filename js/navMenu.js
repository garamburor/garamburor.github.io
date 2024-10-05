let titleText = null;
// Coordinates for "touch hover"
var lastMove = [0, 0];
// State to wait before link redirect
let linkState = 0;

// Setup required for nav menu
function menuSetup(id) {
  menuEvent("about");
  menuEvent("contact");
  menuEvent("work");
}

/* Add home nav features */
function homeSetup() {
  let home = document.getElementsByClassName('home')[0];
  home.addEventListener("mouseenter", menuHoverIn);
  home.addEventListener("touchstart", handleTouchStart);
  home.addEventListener("touchmove", saveTouch, false);
  home.addEventListener("touchend", handleTouchEnd);
  home.addEventListener("touchcancel", handleTouchEnd);
  home.addEventListener("mouseout", menuHoverOut);
  home.style.opacity = 1;
  home.addEventListener('click', homeClick);
}

// Listeners to add for menu elements
function menuEvent(id) {
  document.getElementById(id).addEventListener("mouseenter", menuHoverIn);
  document.getElementById(id).addEventListener("touchstart", handleTouchStart);
  document.getElementById(id).addEventListener("touchmove", saveTouch, false);
  document.getElementById(id).addEventListener("touchend", handleTouchEnd);
  document.getElementById(id).addEventListener("touchcancel", handleTouchEnd);
  document.getElementById(id).addEventListener("mouseout", menuHoverOut);
  document.getElementById(id).addEventListener("click", menuClick);
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
  linkState = 0;
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
  setTimeout(function() { linkState = 1; }, 200);
}

/* Makes overflow visible for prettier window size changes */
function enableSmoothTransition()  {
  linkState = 0;
  document.getElementById("intro1").style.overflow = 'visible';
  document.getElementById("intro2").style.overflow = 'visible';
  document.getElementById("Gknob").style.overflow = 'visible';
};

/* When mouse leaves nav element */
function menuHoverOut() {
  linkState = 0;
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

function homeClick(evt) {
  evt.preventDefault();
  let elements = document.getElementsByClassName('title');
  for(let i = 0; i < elements.length; i++)
  {
    // Make sure there are no events for prev animations
    elements[i].removeEventListener("animationend", enableSmoothTransition);
    elements[i].removeEventListener("animationend", setTitle);
    // Set animation for hiding text
    elements[i].style.animation = "widthClose 500ms linear";
    // Once its done call the main cover
    elements[i].addEventListener("animationend", function() { 
      elements[i].textContent = ""
      window.location = "/" ;
    });
  }
}

/* Disable element in nav menu */
function removeTab(id) {
  let el = document.getElementById(id);
  el.style.filter = "blur(3px)";
  el.style.userSelect = "none";
  el.style.pointerEvents = "none";
  el.style.cursor = "pointer";
}

/* Handle nav click */
function menuClick(evt) {
  evt.preventDefault();
  let elements = document.getElementsByClassName('title');
  for(let i = 0; i < elements.length; i++)
  {
    // Remove all mouse events
    evt.target.removeEventListener("mouseenter", menuHoverIn);
    evt.target.removeEventListener("touchstart", handleTouchStart);
    evt.target.removeEventListener("touchmove", saveTouch, false);
    evt.target.removeEventListener("touchend", handleTouchEnd);
    evt.target.removeEventListener("touchcancel", handleTouchEnd);
    evt.target.removeEventListener("mouseout", menuHoverOut);
    // Once title is shown redirect
    // If title is loaded, redirect instantly
    if (linkState == 1) {
      window.location = evt.target.href;
    }
    // Otherwise, wait for animation to end
    else {
      elements[i].addEventListener("animationend", function() {
        if (linkState == 1) {
          window.location = evt.target.href;
        }
      });
    }
  }
}
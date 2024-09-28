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
  document.getElementById(id).addEventListener("touchstart", menuHoverIn);
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
      window.location = e.currentTarget.href;
    }
    else {
      menuHoverOut();
    }
  }
  else {
    menuHoverOut();
  } 
}

/* When mouse hovers nav element */
function menuHoverIn(evt) {
  // Needed elements
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");
  let title = document.getElementById("title");
  let subt = document.getElementById("subt");
  // For touch devices
  evt.preventDefault();
  // Save coordinate for hover-like effect with touchscreens
  lastMove[0] = evt.touches[0].clientX;
  lastMove[1] = evt.touches[0].clientY;
  // Hide elements that don't fit width
  intro1.style.overflow = 'hidden';
  intro2.style.overflow = 'hidden';
  knob.style.overflow = 'hidden';
  // Hide letters by reducing width
  title.style.animation = "widthClose 500ms linear";
  // Remove previous listeners
  title.removeEventListener("animationend", enableSmoothTransition);
  title.removeEventListener("animationend", steadyCover);
  title.removeEventListener("animationend", toHome);
  // While letters are hidden, set new text and then open back
  titleText = evt.target.innerText;
  title.addEventListener("animationend", setTitle);
  // Remove subtitle
  subt.style.opacity = 0;
}

/* Set main title text */
function setTitle() {
  // Needed elements
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let title = document.getElementById("title");
  // Make sure G is not there
  document.getElementById("Gknob").textContent = "";
  // Split text where O is
  let splitText = titleText.split("O");
  intro1.textContent = splitText[0];
  intro2.textContent = splitText[1];
  // set text to be revealed
  title.style.animation = "widthOpen 500ms linear"
}

/* Makes overflow visible for prettier window size changes */
function enableSmoothTransition()  {
  document.getElementById("intro1").style.overflow = 'visible';
  document.getElementById("intro2").style.overflow = 'visible';
  document.getElementById("Gknob").style.overflow = 'visible';
};

/* When mouse leaves nav element */
function menuHoverOut() {
  let title = document.getElementById("title");
  // Make sure there are no events for prev animations
  title.removeEventListener("animationend", enableSmoothTransition);
  title.removeEventListener("animationend", setTitle);
  title.removeEventListener("animationend", toHome);
  // Set animation for hiding text
  title.style.animation = "widthClose 500ms linear";
  // Once its done call the main cover
  title.addEventListener("animationend", steadyCover);
}

/* Home click event */
function goHome(evt) {
  // Don't go to link yet
  evt.preventDefault();
  // Remove hover effect
  let home = document.getElementsByClassName('home')[0];
  home.removeEventListener("mouseenter", menuHoverIn);
  home.removeEventListener("mouseout", menuHoverOut);
  // Make sure there are no events for prev animations
  let title = document.getElementById("title");
  title.removeEventListener("animationend", enableSmoothTransition);
  title.removeEventListener("animationend", setTitle);
  title.removeEventListener("animationend", steadyCover);
  title.removeEventListener("animationend", toHome);
  title.style.animation = "widthClose 500ms linear";
  title.style.fontSize = 'min(13vw, 128px)';
  title.style.width = 0;
  subt.innerText = "";
  let logo = document.getElementById('logo');
  logo.style.fontSize = 'min(13vw, 128px)';
  sphereSize();
  title.addEventListener("transitionend", toHome);
  return false;
}

/* Needed to send link after transition */
function toHome() {
  window.location.href = "/";
  return false;
}
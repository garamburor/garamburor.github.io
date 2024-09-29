/* Switch frames of anim everytime transition ends */
let j = 0;
function trigFrame() {
  j += 1;
  textChange(j);
};

/* Intro text animation sequence */
function textChange(j) {
  switch(j) {
    case 0: // greeting
      // disable href links
      document.getElementById("about").style.pointerEvents = "none";
      document.getElementById("contact").style.pointerEvents = "none";
      document.getElementById("work").style.pointerEvents = "none";
      // make text not selectable
      document.getElementById("about").style.userSelect = "none";
      document.getElementById("contact").style.userSelect = "none";
      document.getElementById("work").style.userSelect = "none";
      // keep the same pointer always
      document.getElementById("about").style.cursor = "pointer";
      document.getElementById("contact").style.cursor = "pointer";
      document.getElementById("work").style.cursor = "pointer";
      // Set new title
      document.getElementById("intro1").style.opacity = 1;
      document.getElementById("intro2").style.opacity = 1;
      document.getElementById("intro1").textContent = 'H';
      document.getElementById("intro2").textContent = "LA";
      // Adjust centering
      document.getElementById("intro1").style.width = '12%';
      document.getElementById("intro2").style.width = '12%';
      document.getElementById("intro2").style.overflow = 'visible';
      break;
    case 1:
      // Hide
      document.getElementById("intro1").style.opacity = 0;
      document.getElementById("intro2").style.opacity = 0;
      break;
    case 2: // I'm
      // Set new title
      document.getElementById("intro1").style.opacity = 1;
      document.getElementById("intro2").style.opacity = 1;
      document.getElementById("intro1").textContent = 'S';
      document.getElementById("intro2").textContent = "Y";
      // Adjust centering
      document.getElementById("intro1").style.width = '10%';
      document.getElementById("intro2").style.width = '10%';
      break;
    case 3:
      // Hide
      document.getElementById("intro1").style.opacity = 0;
      document.getElementById("intro2").style.opacity = 0;
      break;
    case 4: // Cover
      // Remove animation listener
      document.getElementById('intro1').removeEventListener("transitionend", trigFrame);
      // Show last title
      document.getElementById("intro1").style.opacity = 1;
      document.getElementById("intro2").style.opacity = 1;
      document.getElementById("intro1").style.overflow = 'hidden';
      document.getElementById("intro2").style.overflow = 'hidden';
      // enable hyperlinks
      document.getElementById("about").style.pointerEvents = "auto";
      document.getElementById("contact").style.pointerEvents = "auto";
      document.getElementById("work").style.pointerEvents = "auto";
      // make text selectable
      document.getElementById("about").style.userSelect = "auto";
      document.getElementById("contact").style.userSelect = "auto";
      document.getElementById("work").style.userSelect = "auto";
      // pointer back to default
      document.getElementById("about").style.cursor = "default";
      document.getElementById("contact").style.cursor = "default";
      document.getElementById("work").style.cursor = "default";
      menuSetup();
      document.getElementById("menu").style.opacity = 1;
      steadyCover();
      break;
    default:
      break;
  }
  j += 1;
}
/* Intro animation */
let counter = 0;
let j = 0;
let id1 = null;
clearInterval(id1);
id1 = setInterval(textChange, 900);

/* Intro text animation seuqence */
function textChange() {
  switch(j) {
    case 0: // greeting
      document.getElementById("about").textContent = "";
      document.getElementById("contact").textContent = "";
      document.getElementById("work").textContent = "";
      document.getElementById("intro1").classList.add('hi');
      document.getElementById("intro2").classList.add('hi');
      // Set new title
      document.getElementById("intro1").textContent = 'H';
      document.getElementById("intro2").textContent = "LA";
      // Adjust centering
      document.getElementById("intro1").style.width = '12%';
      document.getElementById("intro2").style.width = '12%';
      document.getElementById("intro2").style.overflow = 'visible';
      break;
    case 1: // I'm
      // Set new title
      document.getElementById("intro1").textContent = 'S';
      document.getElementById("intro2").textContent = "Y";
      // Adjust centering
      document.getElementById("intro1").style.width = '10%';
      document.getElementById("intro2").style.width = '10%';
      break;
    case 2: // Cover
      document.getElementById("intro1").classList.remove('hi');
      document.getElementById("intro2").classList.remove('hi');
      document.getElementById("intro1").style.overflow = 'hidden';
      document.getElementById("intro2").style.overflow = 'hidden';
      document.getElementById("about").textContent = "ABOUT";
      document.getElementById("contact").textContent = "CONTACT";
      document.getElementById("work").textContent = "WORK";
      document.getElementById("menu").style.opacity = 1;
      steadyCover();
      clearInterval(id1);
      break;
    default:
      break;
  }
  j += 1;
}
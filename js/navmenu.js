// Hover effect for navigation menu
function menuHoverIn(id) {
    // Don't go to menu if you hover back inside
    clearInterval(id2);
    clearInterval(id3);
    document.getElementById("intro1").style.overflow = 'hidden';
    document.getElementById("intro2").style.overflow = 'hidden';
    document.getElementById("Gknob").style.overflow = 'visible';
    // Obtain text to be set
    let text = document.getElementById(id).textContent;
    // Split where O is
    let splitText = text.split("O");
    // Add text word by word
    document.getElementById("title").style.animation = "curtain 1s linear";
    id2 = setTimeout(function() {
      document.getElementById("Gknob").textContent = '';
      document.getElementById("intro1").textContent = splitText[0];
      document.getElementById("intro2").textContent = splitText[1];
      document.getElementById("title").style.width = 1;
    }, 500);
  
    id3 = setTimeout(function() {
      document.getElementById("Gknob").style.overflow = 'hidden';
    }, 400);
    // Remove subtitle
    document.getElementById("subt").style.opacity = 0;
  }
  
  function menuHoverOut() {
    clearInterval(id1);
    clearInterval(id2);
    clearInterval(id3);
    document.getElementById("title").style.animation = "widthIn 500ms linear";
    id2 = setTimeout(steadyCover, 490);
    id3 = setTimeout(function () {
      document.getElementById("Gknob").style.overflow = 'visible';
    }, 100);
  }
  
  /* Steady state of home page */
  function steadyCover() {
    clearInterval(id1);
    clearInterval(id2);
    clearInterval(id3);
    // Make logo adjust to text
    document.getElementById('logo').style.position = "sticky";
    // Update cover text
    document.getElementById("title").style.animation = "widthOut 500ms linear"
    document.getElementById("Gknob").style.overflow = 'hidden';
    document.getElementById("Gknob").textContent = 'G';
    document.getElementById("intro1").textContent = 'UILLERM';
    document.getElementById("intro2").textContent = '';
    document.getElementById("title").style.width = 1;
    // Update cover width
    document.getElementById("intro1").style.width = 'auto';
    document.getElementById("intro2").style.width = 'auto';
    // Show subtitles
    document.getElementById("subt").style.opacity = 1;
    document.getElementById("subt").textContent = 'ARAMBURO RODRIGUEZ';
    id2 = setTimeout(function () {
      document.getElementById("Gknob").style.overflow = 'visible';
    }, 100);
  
    id3 = setTimeout(function() {
      document.getElementById("intro1").style.overflow = 'visible';
      document.getElementById("intro2").style.overflow = 'visible';
    }, 600);
    
  }
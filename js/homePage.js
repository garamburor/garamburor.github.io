// p5js setup
// Page state
let currentPage = 'home';
let memory = 'home';
let nbPages = 3 - 1.;


// Secret video
var myVideo;

// Click triggers video until next photo
function videoPlay(evt) {
  evt.preventDefault();
  if(myVideo.paused == true) {
    myVideo.play();
    // After 4s stop video
    setTimeout(videoStop, 4430);
  }
}

// Stop video func, if video is near end or beginning, reset
function videoStop() {
  myVideo.pause();
  // Bound video to pause in the photos
  myVideo.currentTime = Math.round(myVideo.currentTime / 4.43) * 4.43;
  if (myVideo.currentTime >= 14) {
    myVideo.currentTime = 0;
  }
}

function setup() {
  let el = document.getElementById("intro1");
  el.addEventListener("transitionstart", function inT() {
    hoverState = 1;
  });
  el.addEventListener("transitionend", function ouT() {
    hoverState = 0;
  });

  document.getElementById("main").addEventListener('scroll', scrollListener);
  // State machine?
  if (currentPage == "home") {
    textChange(0);
    document.getElementById('intro1').addEventListener("transitionend", trigFrame);
    document.getElementById('home').style.opacity = 0;
  }
  else {
    textChange(4);
    scrollPage();
  }
}

// Set page state following scroll
function scrollListener(evt) {
  // Change color from home to about
  let roo = document.querySelector(':root');
  let normH = this.scrollTop / this.clientHeight;
  // console.log(normH);
  let fontcol;
  let bgcol;
  // Fade elements
  roo.style.setProperty('--show-elem', Math.abs(Math.cos(Math.PI * normH)));
  if (normH < 1) {
    currentPage = "home";
    // Dynamic
    fontcol = lerpColor(color(0,0,255), color(6,41,118), normH);
    bgcol = lerpColor(color(255,254,241), color(253,253,253), normH);
    roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
    roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
    instance1.changeStrokeColor(red(fontcol), green(fontcol), blue(fontcol))
    roo.style.setProperty('--title-pos', map(normH, 0, 1, 33.33, 66.66).toString() + "dvh");
    roo.style.setProperty('--portrait-pos', map(normH, 0, 1, 0, 166).toString() + "dvh");
  }
  else if (normH < 2) {
    roo.style.setProperty('--title-pos', map(normH, 1, 2, 66.66, 0).toString() + "dvh");
    
    currentPage = "about";
  }
  else if (normH < 4) {
    currentPage = "about";
  }
  else if (normH < 5) {
    fontcol = lerpColor(color(6,41,118), color(0, 0, 0), normH - 4);
    bgcol = lerpColor(color(253,253,253), color(242, 242, 242), normH - 4);
    roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
    roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
    instance1.changeStrokeColor(red(fontcol), green(fontcol), blue(fontcol))
    currentPage = "about";
  }
  else if (normH < 6) {
    currentPage = "contact";
  }
  else {
    currentPage = "work";
  }
  
  pageState();
}

let sketch2 = (p) => {
  let img1, modImg;
  let j;
  let x;
  let y;
  let coord;
  let canvas;
  let aspectRatio;
  let imgWidth, imgHeight;
  let mouseX, mouseY;
  let insideLock = 0;
  let quadrant;

  // Load content before processing
  p.preload = () => {
    // Get original aspect ratio from image
    img1 = p.loadImage('media/portrait.jpg'); 
    aspectRatio = 1067 / 1600;
  }

  // Set stuff before running loop
  p.setup = () => {
    // Adjust image size while preserving aspect ratio
    imgHeight = p.windowHeight * 0.6
    imgWidth = imgHeight * aspectRatio
    // Set canvas
    canvas = p.createCanvas(p.windowWidth, imgHeight);
    canvas.position(0, 0, 'relative');
    // Set frame rate
    p.frameRate(24);
  }

  // Adjust image if window changes size
  p.windowResized = () => {
    imgHeight = p.windowHeight * 0.6
    imgWidth = imgHeight * aspectRatio
    p.resizeCanvas(p.windowWidth, imgHeight);
  }

  // Main loop
  p.draw = () => {
    // Clear canvas
    p.clear();
    // Load frame of video
    modImg = img1.get();
    modImg.loadPixels();
    // Reset coordiante counter
    j = 0;
    // Clamp x coordinates to image position
    mouseX = p.constrain(p.mouseX, (p.width - imgWidth) * 0.5, (p.width + imgWidth) * 0.5)
    // Map to be 0 until image width
    mouseX = Math.floor(p.map(mouseX, (p.width - imgWidth) * 0.5, (p.width + imgWidth) * 0.5, 0, modImg.width));
    // There's no need to clamp for mouseY since the canvas and image
    // have the same height, just map
    mouseY = Math.floor(p.map(p.mouseY, 0, p.height, 0, modImg.height));
    // Check if mouse is hovering over image or not
    if(p.mouseX >= (p.width - imgWidth) * 0.5 && p.mouseX <= (p.width + imgWidth) * 0.5) {
      if(p.mouseY >= 0 && p.mouseY <= imgHeight) {
        insideLock = 1;
      }
      else {
        insideLock = 0;
      }
    }
    else {
      insideLock = 0;
    }

    // Detec from which quadrant of the image the mouse has entered
    if (insideLock == 0) {
      if (mouseX < modImg.width * 0.5 && mouseY < modImg.height * 0.5) {
        quadrant = 0;
      } else if (mouseX > modImg.width * 0.5 && mouseY < modImg.height * 0.5) {
        quadrant = 1;
      } else if (mouseX < modImg.width * 0.5 && mouseY > modImg.height * 0.5) {
        quadrant = 2;
      } else {
        quadrant = 3;
      }
    }

    // Pixel transform
    for (var i = 0; i < modImg.pixels.length; i += 4) {
        // Get cartesian coordinates of pixels
        y = Math.floor(j / modImg.width);
        x = j % modImg.width;
        j += 1;
        coord = (mouseX + y * modImg.width) * 4;

        // Repeat horizontally the pixel the mouse is hovering on
        if (insideLock) {
        if (quadrant == 0) {
            if(x < mouseX && y < mouseY) {
              modImg.pixels[i + 0] = modImg.pixels[coord + 0];
              modImg.pixels[i + 1] = modImg.pixels[coord + 1];
              modImg.pixels[i + 2] = modImg.pixels[coord + 2];
              modImg.pixels[i + 3] = modImg.pixels[coord + 3];
            }
        }
        else if (quadrant == 1) {
          if(x > mouseX && y < mouseY) {
            modImg.pixels[i + 0] = modImg.pixels[coord + 0];
            modImg.pixels[i + 1] = modImg.pixels[coord + 1];
            modImg.pixels[i + 2] = modImg.pixels[coord + 2];
            modImg.pixels[i + 3] = modImg.pixels[coord + 3];
          }
        }
        else if (quadrant == 2) {
          if(x < mouseX && y > mouseY) {
            modImg.pixels[i + 0] = modImg.pixels[coord + 0];
            modImg.pixels[i + 1] = modImg.pixels[coord + 1];
            modImg.pixels[i + 2] = modImg.pixels[coord + 2];
            modImg.pixels[i + 3] = modImg.pixels[coord + 3];
          }
        }
        else if (quadrant == 3) {
          if(x > mouseX && y > mouseY) {
            modImg.pixels[i + 0] = modImg.pixels[coord + 0];
            modImg.pixels[i + 1] = modImg.pixels[coord + 1];
            modImg.pixels[i + 2] = modImg.pixels[coord + 2];
            modImg.pixels[i + 3] = modImg.pixels[coord + 3];
          }
        }
      }
    }
    // Update changes
    modImg.updatePixels();
    // Plot image
    p.image(modImg, (p.width - imgWidth) * 0.5, 0, imgWidth, imgHeight);
  }
}
// Create sketch
let instance2 = new p5(sketch2, 'portrait-container');

// For the state events that don't repeat every loop
function pageState() {
  // if page changed
  if (currentPage != memory) {
    let home = document.getElementById("home");
    let intro1 = document.getElementById("intro1");
    let roo = document.querySelector(':root');
    let workPage = document.getElementById('work-page');
    // Disable current page in nav
    removeTab(currentPage);
    // Stop any other transition
    clearTimeout(id1);
    clearTimeout(id2);
    // Remove underline
    enableTab(memory);
    memory = currentPage;

    switch (currentPage) {
      case "home":
        // Set new page cover
        document.title = 'Guillermo A. R.';
        history.pushState({}, 'Guillermo A. R.', '/');
        // Set animation for hiding text
        roo.style.setProperty('--title-width', "0px");
        home.style.opacity = 0;
        // myVideo.pause();
        // myVideo.currentTime = 0;
        // Hide grid
        workPage.style.clipPath = "inset(0 0 100% 0 round 0 0 0 0)";
        instance2.noLoop();
        break;
      case "about":
        // Set new page cover
        document.title = currentPage.toUpperCase() + ' - Guillermo A. R.';
        history.pushState({}, document.title, '/' + currentPage);
        home.style.opacity = 1;
        // Hide grid
        workPage.style.clipPath = "inset(0 0 100% 0 round 0 0 0 0)";
        instance2.loop();
        break;
      case "contact":
        // myVideo.pause();
        // myVideo.currentTime = 0;
        // Set new page cover
        document.title = currentPage.toUpperCase() + ' - Guillermo A. R.';
        history.pushState({}, document.title, '/' + currentPage);
        home.style.opacity = 1;
        // Set title position
        roo.style.setProperty('--title-pos', "0dvh");
        // Set colors
        fontcol = color(0, 0, 0)
        instance1.changeStrokeColor(0, 0, 0)
        roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
        bgcol = color(242,242,242)
        roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
        // Hide grid
        workPage.style.clipPath = "inset(0 0 100% 0 round 0 0 0 0)";
        instance2.noLoop();
        break;
      case "work":
        // Set new page cover
        document.title = currentPage.toUpperCase() + ' - Guillermo A. R.';
        history.pushState({}, document.title, '/' + currentPage);
        home.style.opacity = 1;
        // Set title position
        roo.style.setProperty('--title-pos', "0dvh");
        // Set colors
        fontcol = color(254, 250, 235)
        instance1.changeStrokeColor(254, 250, 235)
        roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
        bgcol = color(23, 167, 126)
        roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
        // Reveal grid
        workPage.style.clipPath = "inset(0 0 0 0 round 0 0 0 0)"
        instance2.noLoop();
        break;
      default: // 404
        break;
    }
    // Trigger page when transitions stop
    if (hoverState == 0) {
      // Set animation for hiding text
      roo.style.setProperty('--title-width', "0px");
      intro1.addEventListener("transitionend", returnTitle, {once:true});
    }
    else {
      intro1.addEventListener("transitionend", returnTitle, {once:true});
    }
  }
}

function scrollPage() {
  let divContainer = document.getElementById("main");
  switch (currentPage) {
    case "home":
      // Scroll to position
      divContainer.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      break;
    case "about":
      // Scroll to position
      divContainer.scrollTo({
        top: 1 * divContainer.clientHeight,
        left: 0,
        behavior: "smooth",
      });
      break;
    case "contact":
      // Scroll to position
      divContainer.scrollTo({
        top: 5 * divContainer.clientHeight,
        left: 0,
        behavior: "smooth",
      });
      break;
    case "work":
      // Scroll to position
      divContainer.scrollTo({
        top: 6 * divContainer.clientHeight,
        left: 0,
        behavior: "smooth",
      });
      break;
    }
}

// return to main title
function returnTitle() {
  clearTimeout(id1);
  clearTimeout(id2);
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");
  let subt = document.getElementById("subt");
  let home = document.getElementById("home");

  switch(currentPage) {
    case "home":
      // Enable subtitles
      subt.textContent = "ARAMBURO RODRIGUEZ";
      subt.style.opacity = 1;
      // Show main title
      knob.textContent = 'G';
      intro1.textContent = 'UILLERM';
      intro2.textContent = '';
      knob.style.transform = "rotate(0deg)";
      home.style.opacity = 0;
      break;
    default:
      // Make sure G is not there
      knob.textContent = "";
      // Rotate
      knob.style.transform = "rotate(45deg)";
      // Split text where O is
      let splitText = titleText.split("O");
      intro1.textContent = splitText[0];
      intro2.textContent = splitText[1];
      subt.style.opacity = 0;
      break;
  }
  let roo = document.querySelector(':root');
  roo.style.setProperty('--title-width', "100dvw");
}
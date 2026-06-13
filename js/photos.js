class Photos extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        this.state = false; // Show instax or carousel
        this.timer = null; // Debounce
    }

    connectedCallback() {
        this.shadowRoot.getElementById("photos").addEventListener('click', this.handleClick.bind(this));    }

    disconnectedCallback() {
        this.shadowRoot.getElementById("photos").removeEventListener('click', this.handleClick.bind(this));
        if (this.timer) { clearTimeout(this.timer)};
    }

    handleClick(e) {
        this.state = !this.state;
        this.shadowRoot.getElementById("photos").style.opacity = this.state ? 0 : 1;
        this.disconnectedCallback();
        if (this.timer) { clearTimeout(this.timer)};
        this.timer = setTimeout(this.render.bind(this), 500);
    }

    render() {
        if (this.state) {
            this.carousel();
        } else {
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../css/photos.css">
            <div id="photos">
                <div class="instax" id="frame3">
                    <img class="photo" id="photo3" src='../media/photos/DSCF1874.avif'>
                </div>
                <div class="instax" id="frame2">
                    <img class="photo" id="photo2" src='../media/photos/DSCF1881.avif'>
                </div>
                <div class="instax" id="frame1">
                    <img class="photo" id="photo1" src='../media/photos/DSCF2415.avif'>
                </div>
                <div class='tooltip-content'>I'm often moving about with a digital camera.🏃🏻‍♂️</div>
            </div>
            <div id="ob1wrap">
                <img id="ob1" src="./media/ob-1.svg"></img>
                <div class='tooltip-content'>Been making music for a long time, now mainly just 2 bar loops with this thing.🤡</div>
            </div>
            `;
        }
    }

    carousel() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="../css/photos.css">
        `;
        
        const carousel = document.createElement("div");
        carousel.id = "carousel";
        this.shadowRoot.appendChild(carousel);
        
        const hold1 = document.createElement("div");
        hold1.className = "imghold";
        hold1.style.top = "5dvh";
        const hold2 = document.createElement("div");
        hold2.className = "imghold";
        hold2.style.top = "55dvh";

        // 2. The Smoothing Loop
        let targetSpeed = 1;
        let currentSpeed = 1;
        const smoothingFactor = 0.1; // Lower is smoother/slower (0.01 to 0.1)
        function updatePlaybackRate() {
            // Linear Interpolation formula: current + (target - current) * factor
            currentSpeed += (targetSpeed - currentSpeed) * smoothingFactor;

            // Apply the smoothed speed to all animations
            marquee.forEach(anim => {
                anim.playbackRate = currentSpeed;
            });
            // Keep the loop running
            requestAnimationFrame(updatePlaybackRate);
        }

        const pics = ['DSCF1714', 'DSCF1874', 'DSCF1881', 'DSCF2415', 'DSCF2489',
        'DSCF2494', 'DSCF2534', 'DSCF2577', 'DSCF2769', 'DSCF2785'];
        let marquee = null;
        //    'DSCF2872', 'DSCF2884', 'DSCF3007', 'DSCF3114', 'DSCF3127'];
        let w = 100 / pics.length * 2;
        hold1.style.setProperty('--s', w + 'dvw');
        hold2.style.setProperty('--s', w + 'dvw');
        let n = 0;
        let pbRate = 1;
        pics.forEach((file) => {
            var img = new Image();
            img.src = '../media/photos/' + file + '.avif';
            img.style.zIndex = 97;
            const anim = img.animate([
                { offsetDistance: "0%" },
                { offsetDistance: "100%" }
            ], {
                duration: 10000,
                iterations: Infinity,
                delay: n * 10000 / pics.length,
                easing: 'linear'
            });

            if (marquee) {
                marquee.push(anim);
            } else {
                marquee = new Array(anim);
            }
            
            // Now you can still use the smooth speed control!
            img.addEventListener('mouseenter', () => {
                targetSpeed = 0;});

            img.addEventListener('mouseleave', () => {
                targetSpeed = 1.});
            
            if (n % 2 == 0) {
                img.decode()
                .then(() => {
                    hold1.appendChild(img);
                    this.shadowRoot.appendChild(hold1);
                });
            } else {
                img.decode()
                .then(() => {
                    hold2.appendChild(img);
                    this.shadowRoot.appendChild(hold2);
                });
            }
            n += 1;
        });
        updatePlaybackRate();
    }
}

customElements.define('photo-work', Photos);
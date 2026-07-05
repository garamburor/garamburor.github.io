import { sequencer } from './sequencer.js'; // Import the specific class

class WorkPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // Render html
        this.render();
        // Allocate sequencer
        this.seq = null;
        this.knob1 = false;
    }

    connectedCallback() {
        let container = this.shadowRoot.getElementById("seq");
        // Create sequencer if it doesn't exist
        if (!this.seq) {
            this.seq = new p5((p) => {
                p.canvasParentNode = container;
                sequencer(p);
            }, container);
        }
        
        let photos = this.shadowRoot.querySelectorAll('.instax');
        for(let i = 0; i < photos.length; i++) {
            photos[i].addEventListener('click', this.callPage);
        }
        let banners = this.shadowRoot.querySelectorAll('.tooltip-content');
        for(let i = 0; i < banners.length; i++) {
            let el = this.shadowRoot.getElementById(banners[i].id);
            el.addEventListener('click', this.callPage);
        }
        let apc = this.shadowRoot.getElementById('apc');
        apc.addEventListener('load', () => {
            let svgDoc = apc.contentDocument;
            let knob1 = svgDoc.getElementById('knob1');
            knob1.addEventListener('click', () => {
                let led = svgDoc.getElementById('LED');
                led.style.fill = '#3498db';
            }); 
        });
    }

    disconnectedCallback() {
        if (this.seq) {
            this.seq.destroy(); // Kill allocated components
            this.seq.remove(); // Remove canvas
            this.seq = null;
        }

        let photos = this.shadowRoot.querySelectorAll('instax');
        for(let i = 0; i < photos.length; i++) {
            photos[i].removeEventListener('click', this.callPage);
        }
        let banners = this.shadowRoot.querySelectorAll('.tooltip-content');
        for(let i = 0; i < banners.length; i++) {
            let el = this.shadowRoot.getElementById(banners[i].id);
            el.removeEventListener('click', this.callPage);
        }
    }

    callPage = (e) => {
        e.preventDefault();
        this.dispatch('change-page', 'photo');
    }

    async unload() {
        return Promise.resolve();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="../css/work.css">
        <link rel="stylesheet" href="../css/photos.css">
        <section id="seq">
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
                <div id="photo-ban" class='tooltip-content'>I'm often moving about with a digital camera.🏃🏻‍♂️</div>
            </div>
            <!--
            <div class='post-it'>
                    <h1>Hi!</h1>
                <ul>
                    <li>This is still a WIP</li>
                    <li>I leave you with the basics</li>
                    <li>+ some photos & a sequencer</li>
                </ul> 
            </div>
            <div id="ob1wrap">
                <img id="ob1" src="./media/ob-1.svg"></img>
                <div class='tooltip-content'>Been making music for a long time, now mainly just 2 bar loops with this thing.🤡</div>
            </div>
            -->
            <div id="apcwrap">
                <object id="apc" data="./media/apc.svg" type="image/svg+xml"></object>            
            </div>
        </section>
        `;
    }

    dispatch(name, link) {
        this.dispatchEvent(new CustomEvent(name, {
            detail: { link },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('work-page', WorkPage);
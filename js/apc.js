class APC extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        //this.id = "apc";
        this.led = false;
        this.knob1 = false;
        this.knob2 = false;
        this.timer = null
        this.timeout = 3000; // 3 seconds
        this.param = Array(0.5, 0.5);
        /* DSP */
        this.audioCtx = null;
        // Constants
        this.TAU_OFF = 6.931471805599453e-06;
        this.C1_LOG2 = 6.931471805599453e-09;
        this.C2_LOG3 = 1.0986122886681097e-07;
        // Main vars
        this.f = 100; // frequency
        this.d = 0.5; // duty cycle
    }

    async connectedCallback() {
        // Load SVG
        let response = await fetch('../media/apc.svg');
        let svgText = await response.text();
        // Create div to hold the SVG
        let apc = document.createElement("div");
        this.shadowRoot.innerHTML = svgText;
        // Add events for interaction with knobs
        let knob1 = this.shadowRoot.getElementById("knob1");
        knob1.addEventListener('mousedown', this.clickKnob1.bind(this));
        knob1.addEventListener('touchstart', this.clickKnob1.bind(this));
        let knob2 = this.shadowRoot.getElementById("knob2");
        knob2.addEventListener('touchstart', this.clickKnob2.bind(this));
        knob2.addEventListener('mousedown', this.clickKnob2.bind(this));
        document.addEventListener('mouseup', this.mouseUp.bind(this));
        document.addEventListener('touchend', this.mouseUp.bind(this));
        document.addEventListener('mousemove', this.mouseTrack.bind(this));
        document.addEventListener('touchmove', this.touchTrack.bind(this));
        let led = this.shadowRoot.getElementById("LED");
        led.addEventListener('click', this.ledClick.bind(this));
        led.addEventListener('touchstart', this.ledClick.bind(this));
    }

    disconnectedCallback() {
        let knob1 = this.shadowRoot.getElementById("knob1");
        knob1.removeEventListener('mousedown', this.clickKnob1.bind(this));
        knob1.removeEventListener('touchstart', this.clickKnob1.bind(this));
        let knob2 = this.shadowRoot.getElementById("knob2");
        knob2.removeEventListener('mousedown', this.clickKnob2.bind(this));
        knob2.removeEventListener('touchstart', this.clickKnob2.bind(this));
        document.removeEventListener('mouseup', this.mouseUp.bind(this));
        document.removeEventListener('touchend', this.mouseUp.bind(this));
        document.removeEventListener('mousemove', this.mouseTrack.bind(this));
        document.removeEventListener('touchmove', this.touchTrack.bind(this));
        let led = this.shadowRoot.getElementById("LED");
        led.removeEventListener('click', this.ledClick.bind(this));
        led.removeEventListener('touchstart', this.ledClick.bind(this));
    }

    mouseUp() {
        this.knob1 = false;
        this.knob2 = false;
    }

    ledClick(e) {
        try { e.preventDefault(); } catch {}
        // Toggle LED state
        this.led = !this.led;
        if (this.led) {
            // If audio not active, turn it on
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            this.timer = setTimeout(this.ledOff.bind(this), this.timeout);
            let led = this.shadowRoot.getElementById("LED");
            // Circuit is on!
            led.style.fill = "red";
            led.style.filter = `
                blur(1px)
                drop-shadow(0px 0px 4px red)
        `;
        }
        else {
            this.ledOff();
        }
        
    }

    ledOff() {
        if (this.audioCtx) {
                this.audioCtx.close();
                this.audioCtx = null;
            }
        this.led = false;
        let led = this.shadowRoot.getElementById("LED");
        clearTimeout(this.timer);
        this.timer = null;
        led.style.fill = "var(--photo-tx-color)";
        led.style.filter = "none";
    }

    clickKnob1(e) {
        e.preventDefault();
        this.knob1 = true;
        if (!this.led) {
            // Turn circuit on
            this.ledClick(e);
        }
    }

    clickKnob2(e) {
        e.preventDefault();
        this.knob2 = true;
        if (!this.led) {
            // Turn circuit on
            this.ledClick(e);
        }
    }

    touchTrack(e) {
        let knob = null;
        let index = null;
        // If a knob is being moved, calculate the rotation based on mouse position
        if (this.knob1 || this.knob2) {
            // Reset timer
            clearTimeout(this.timer);
            this.timer = setTimeout(this.ledOff.bind(this), this.timeout);
            if (this.knob1) {
                knob = this.shadowRoot.getElementById("knob1");
                index = this.param.indexOf(0);
            }
            if (this.knob2) {
                knob = this.shadowRoot.getElementById("knob2");
                index = this.param.indexOf(1);
            }
            let rect = this.shadowRoot.getElementById("apcbox");
            let apcRect = rect.getBoundingClientRect();
            let knobBox = knob.getBoundingClientRect();
            let knobCenterX = knobBox.x + knobBox.width * 0.5;
            let knobCenterY = knobBox.y + knobBox.height * 0.5;
            let deltaX = e.touches[0].clientX - knobCenterX;
            let deltaY = e.touches[0].clientY - knobCenterY;
            let angleRad = Math.atan2(deltaY, deltaX);
            let angleDeg = angleRad * (180 / Math.PI);
            let param = (angleDeg + 258) % 360;
             // Clamp between 35 and 325 degrees
            param = Math.min(Math.max(param, 35), 325);
            // Set rotation but remove the 180 deg offset + 8 degree tilt of svg
            let rotation = param - 172; // angleDeg + 82;
            knob.style.transform = `rotate(${rotation}deg)`;
            // Set value
            this.param[index] = (param - 35) / (325 - 35);
        }
    }

    mouseTrack(e) {
        let knob = null;
        let index = null;
        // If a knob is being moved, calculate the rotation based on mouse position
        if (this.knob1 || this.knob2) {
            // Reset timer
            clearTimeout(this.timer);
            this.timer = setTimeout(this.ledOff.bind(this), this.timeout);
            if (this.knob1) {
                knob = this.shadowRoot.getElementById("knob1");
                index = this.param.indexOf(0);
            }
            if (this.knob2) {
                knob = this.shadowRoot.getElementById("knob2");
                index = this.param.indexOf(1);
            }
            let rect = this.shadowRoot.getElementById("apcbox");
            let apcRect = rect.getBoundingClientRect();
            let knobBox = knob.getBoundingClientRect();
            let knobCenterX = knobBox.x + knobBox.width * 0.5;
            let knobCenterY = knobBox.y + knobBox.height * 0.5;
            let deltaX = e.clientX - knobCenterX;
            let deltaY = e.clientY - knobCenterY;
            let angleRad = Math.atan2(deltaY, deltaX);
            let angleDeg = angleRad * (180 / Math.PI);
            let param = (angleDeg + 258) % 360;
             // Clamp between 35 and 325 degrees
            param = Math.min(Math.max(param, 35), 325);
            // Set rotation but remove the 180 deg offset + 8 degree tilt of svg
            let rotation = param - 172; // angleDeg + 82;
            knob.style.transform = `rotate(${rotation}deg)`;
            // Set value
            this.param[index] = (param - 35) / (325 - 35);
        }
    }

    async unload() {
        return Promise.resolve();
    }

    render() {
    }
}

customElements.define('apc-elm', APC);

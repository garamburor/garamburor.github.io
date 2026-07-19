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
        this.pulseNode = null;
        // Constants
        this.TAU_OFF = 6.931471805599453e-06;
        this.R1C1_LOG2 = 5e5 * 6.931471805599453e-09;
        this.R2C2_LOG3 = 5e5 * 1.0986122886681097e-07;
        this.pot1 = 0.5;
        this.pot2 = 0.5;
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
        knob1.style.cursor = "pointer";
        let knob2 = this.shadowRoot.getElementById("knob2");
        knob2.style.cursor = "pointer";
        knob2.addEventListener('touchstart', this.clickKnob2.bind(this));
        knob2.addEventListener('mousedown', this.clickKnob2.bind(this));
        document.addEventListener('mouseup', this.mouseUp.bind(this));
        document.addEventListener('touchend', this.mouseUp.bind(this));
        document.addEventListener('mousemove', this.mouseTrack.bind(this));
        document.addEventListener('touchmove', this.touchTrack.bind(this), { passive: false });
        let led = this.shadowRoot.getElementById("LED");
        led.style.cursor = "pointer";
        led.addEventListener('click', this.ledClick.bind(this));
        led.addEventListener('touchstart', this.ledClick.bind(this));
    }

    disconnectedCallback() {
        if (this.audioCtx) {
            this.audioCtx.close();
            this.audioCtx = null;
            this.pulseNode = null;
        }
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

    async ledClick(e) {
        try { e.preventDefault(); } catch {}
        // Toggle LED state
        this.led = !this.led;
        if (this.led) {
            // If audio not active, turn it on
            if (!this.audioCtx) {
                await this.initAudio();
            }
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

    async initAudio() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const processorCode = `
            class DPWPulseProcessor extends AudioWorkletProcessor {
            static get parameterDescriptors() {
                return [
                    { name: 'f', defaultValue: 17.96, minValue: 4., maxValue: 20000, automationRate: 'k-rate' },
                    { name: 'd', defaultValue: 0.99, minValue: 0., maxValue: 1., automationRate: 'k-rate' }
                ];
            }

            constructor() {
                super();
                this.phase = 0;
                this.prevParabola = 0;
                // Added a bit of padding to the buffer length for safe multi-tap lookback
                this.bufferLength = Math.ceil(sampleRate / 8) + 4;
                this.zLine = new Float32Array(this.bufferLength);
                this.writeIndex = 0;
                this.Ts = 1. / sampleRate;
                
                // DC blocker
                const RC = 1.0 / (2.0 * Math.PI * 12.);
                this.alpha = RC / (RC + this.Ts);
                this.x1 = 0;
                this.y1 = 0;

                // Voss-McCartney algorithm variables
                this.pink;
                this.white;
                this.b0 = 0;
                this.b1 = 0;
                this.b2 = 0;
                this.b3 = 0;
                this.b4 = 0;
                this.b5 = 0;
                this.b6 = 0;
            }

            /**
             * Reads from the circular buffer using 3rd-order Lagrange (Cubic) Interpolation
             * to significantly reduce interpolation artifacts.
             */
            readCubic(delaySamples) {
                let readPos = this.writeIndex - delaySamples;
                
                // Get base sample
                let idx1 = Math.floor(readPos);
                let eta = readPos - idx1; // Fractional remainder

                // Get the 4 points centered around the fractional position
                let idx0 = idx1 - 1;
                let idx2 = idx1 + 1;
                let idx3 = idx1 + 2;

                // Wrap indices
                idx0 = (idx0 % this.bufferLength + this.bufferLength) % this.bufferLength;
                idx1 = (idx1 % this.bufferLength + this.bufferLength) % this.bufferLength;
                idx2 = (idx2 % this.bufferLength + this.bufferLength) % this.bufferLength;
                idx3 = (idx3 % this.bufferLength + this.bufferLength) % this.bufferLength;

                // Get samples
                const s0 = this.zLine[idx0];
                const s1 = this.zLine[idx1];
                const s2 = this.zLine[idx2];
                const s3 = this.zLine[idx3];

                // 3rd-order Lagrange interpolation formula
                const c0 = s1;
                const c1 = s2 - (1.0 / 3.0) * s0 - 0.5 * s1 - (1.0 / 6.0) * s3;
                const c2 = 0.5 * (s0 + s2) - s1;
                const c3 = (1.0 / 6.0) * (s3 - s0) + 0.5 * (s1 - s2);

                return c0 + eta * (c1 + eta * (c2 + eta * c3));
            }

            process(inputs, outputs, parameters) {
                const output = outputs[0];
                if (!output || output.length === 0) return true;

                const freqParam = parameters.f;
                const dutyParam = parameters.d;
                const sampleCount = output[0].length; 
                const monoBuffer = new Float32Array(sampleCount);

                for (let i = 0; i < sampleCount; i++) {
                    const freq = freqParam.length > 1 ? freqParam[i] : freqParam[0];
                    const duty = dutyParam.length > 1 ? dutyParam[i] : dutyParam[0];

                    // DPW Saw
                    let x = 2 * this.phase - 1;
                    let parabola = x * x;
                    let saw = parabola - this.prevParabola;
                    this.prevParabola = parabola;
                    saw *= sampleRate * 0.25 / freq;
                    
                    // Write the current sample into the delay line
                    this.zLine[this.writeIndex] = saw;
                    
                    // Calculate delay in samples
                    let delaySamples = duty * sampleRate / freq;
                    
                    // Read interpolated delay line
                    let delayedSaw = this.readCubic(delaySamples);
                    
                    /* Pink Noise for mojo */
                    this.white = Math.random() * 2 - 1; // Standard white noise
                    // Pink noise filters
                    this.b0 = 0.99886 * this.b0 + this.white * 0.0555179;
                    this.b1 = 0.99332 * this.b1 + this.white * 0.0750759;
                    this.b2 = 0.96900 * this.b2 + this.white * 0.1538520;
                    this.b3 = 0.86650 * this.b3 + this.white * 0.3104856;
                    this.b4 = 0.55000 * this.b4 + this.white * 0.5329522;
                    this.b5 = -0.7616 * this.b5 - this.white * 0.0168980;
                    
                    // Combine filters
                    this.pink = this.b0 + this.b1 + this.b2 + this.b3;
                    this.pink += this.b4 + this.b5 + this.b6 + this.white * 0.5362;
                    this.b6 = this.white * 0.115926;

                    /* DC Blocker */
                    x = (saw - delayedSaw) * 0.2 + this.pink * 1e-3;
                    monoBuffer[i] = this.alpha * (this.y1 + x - this.x1);
                    this.x1 = x;
                    this.y1 = monoBuffer[i];

                    // Advance phasor
                    this.phase += freq * this.Ts;
                    if (this.phase >= 1.) this.phase -= 1.;
                    // Advance circular buffer
                    this.writeIndex++;
                    if (this.writeIndex >= this.bufferLength) this.writeIndex = 0;
                }

                for (let ch = 0; ch < output.length; ch++) {
                    output[ch].set(monoBuffer);
                }

                return true;
            }
        }

        registerProcessor('dpw-pulse', DPWPulseProcessor);
            `;

            // Convert the string into an object URL blob
            const blob = new Blob([processorCode], { type: 'application/javascript' });
            const blobURL = URL.createObjectURL(blob);
            // Load the blob URL directly
            await this.audioCtx.audioWorklet.addModule(blobURL); 
            // Clean up the URL and instantiate
            URL.revokeObjectURL(blobURL);
            this.pulseNode = new AudioWorkletNode(this.audioCtx, 'dpw-pulse');
            this.pulseNode.connect(this.audioCtx.destination);
    }

    ledOff() {
        if (this.audioCtx) {
                this.audioCtx.close();
                this.audioCtx = null;
            }
        this.led = false;
        let led = this.shadowRoot.getElementById("LED");
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
        // If a knob is being moved, calculate the rotation based on mouse position
        if (this.knob1 || this.knob2) {
            // Knob tracking
            let knob;
            if (this.knob1) {
                knob = this.shadowRoot.getElementById("knob1");
            }
            if (this.knob2) {
                knob = this.shadowRoot.getElementById("knob2");
            }
            // knob tracks mouse pos
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
            param = Math.max(0., Math.min(param / 360, 1.));
            // + add x pos
            param += this.map(e.touches[0].clientX - knobCenterX, 0, window.innerWidth, 0., 1.);
            // Add y pos
            param += this.map(e.touches[0].clientY - knobCenterY, window.innerHeight, 0, 0., 0.1);
            // Clamp value
            param = Math.max(0., Math.min(param, 1.));
            // Calculate param + draw knob rotation
            this.APCParams(param);
        }
    }

    mouseTrack(e) {
        // If a knob is being moved, calculate the rotation based on mouse position
        if (this.knob1 || this.knob2) {
            // Knob tracking
            let knob;
            if (this.knob1) {
                knob = this.shadowRoot.getElementById("knob1");
            }
            if (this.knob2) {
                knob = this.shadowRoot.getElementById("knob2");
            }
            // knob tracks mouse pos
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
            param = Math.max(0., Math.min(param / 360, 1.));
            // + add x pos
            param += this.map(e.clientX - knobCenterX, 0, window.innerWidth, 0., 1.);
            // Add y pos
            param += this.map(e.clientY - knobCenterY, window.innerHeight, 0, 0., 0.1);
            // Clamp value
            param = Math.max(0., Math.min(param, 1.));
            // Calculate param + draw knob rotation
            this.APCParams(param);
        }
    }

    APCParams(param) {
        let index;
        let knob;
        if (this.knob1) {
            knob = this.shadowRoot.getElementById("knob1");
            this.pot1 = (1. - param);
            index = 0
        }
        if (this.knob2) {
            knob = this.shadowRoot.getElementById("knob2");
            this.pot2 = param;
            index = 1;
        }
        // Convert to degrees for knob rotation
        param = this.map(param, 0., 1., 35, 325);
        // Set rotation but remove the 180 deg offset + 8 degree tilt of svg
        let rotation = param - 172; // angleDeg + 82;
        knob.style.transform = `rotate(${rotation}deg)`;
        // Set value
        param = (param - 35) / (325 - 35);
        if (!this.pulseNode || !this.audioCtx) return;

        let tau_on1 = this.pot2 * this.R1C1_LOG2;
        let tau1 = tau_on1 + this.TAU_OFF;
        let tau2 = this.pot1 * this.R2C2_LOG3;
        // logic of 555 in series to determine oscillator period
        let T;
        if (tau2<tau1) {
            T = tau1;
        } else {
            T = tau2 + (tau_on1 - tau1 * ((tau2/tau1) % 1.));
        }
        this.f = 1. / T;
        this.d = tau2 * this.f;
        // Clamp to avoid pure DC
        this.d = Math.min(0.999, Math.max(1e-3, this.d));
        if (index == 0) {
            this.pulseNode.parameters.get('f').setTargetAtTime(this.f, this.audioCtx.currentTime, 0.01);
        }
        else {
            this.pulseNode.parameters.get('d').setTargetAtTime(this.d, this.audioCtx.currentTime, 0.01);
        }
    }

    map(value, x1, y1, x2, y2) {
        return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
    }

    async unload() {
        return Promise.resolve();
    }

    render() {
    }
}

customElements.define('apc-elm', APC);

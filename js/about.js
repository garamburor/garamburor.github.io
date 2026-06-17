class AboutPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.page = 0; // set and load page
        this.prev = this.page;
        this.currentAnim;
        this.funk;
        this.touchPos = 0.;
        this.touchEvent;
        this.timer = null;
    }

    connectedCallback() {
        this.render(); // render container div
        let cont = this.shadowRoot.querySelector('#container');
        cont.addEventListener('wheel', this.wheelHandle);
        cont.addEventListener('touchstart', this.tsHandle);
        cont.addEventListener('touchmove', this.tmHandle);
        cont.addEventListener('touchend', this.teHandle);
        this.handleState(true);
    }

    disconnectedCallback() {
        let cont = this.shadowRoot.querySelector('#container');
        cont.removeEventListener('wheel', this.wheelHandle);
        cont.removeEventListener('touchstart', this.tsHandle);
        cont.addEventListener('touchmove', this.tmHandle);
        cont.removeEventListener('touchend', this.teHandle);
    }

    holdup() {
        this.timer = null;
    }

    tsHandle = (e) => {
        console.log(e.touches[0].clientY);
        this.touchPos = e.touches[0].clientY;
        
    }
    
    tmHandle = (e) => {
        this.touchEvent = e;
    }

    teHandle = (e) => {
        this.touchPos -= this.touchEvent.touches[0].clientY;
        this.changePage(this.touchPos);
    }

    wheelHandle = (e) => {
        this.changePage(e.deltaY);
    }

    changePage(pos) {
        if (!this.timer) {
            if (pos >= 0) {
                this.page++
            } else {
                this.page--;
            }
            this.timer = setTimeout(this.holdup.bind(this), 1200);
        }
        // Clip & reset page count
        if (this.page > 2) {
            this.page = 0;
        }
        if (this.page < 0) {
            this.page = 2;
        }
        // If there's a change trigger state change
        if (this.prev != this.page) {
            this.handleState();
            this.prev = this.page;
        }
    }

    async unload() {
        this.page++;
        await this.funk(false);
        return this.currentAnim.finished;
    }

    handleState(skip=false) {
        if (!skip) { this.funk(false); }
        if (this.page == 0) {
            let text = "Thank you for visiting my website. I'm Guillermo, a DSP Engineer, specializing in audio. Currently based in Paris.";
            this.textBox(text, skip);
            this.funk = this.textBox;
        } else if (this.page == 1) {
            this.table(true);
            this.funk = this.table;
        } else if (this.page == 2) {
            let text = `I enjoy the process of
                    learning new things and there's always some new subject
                    I want to take a stab at. For example, this website. 
                    Hopefully I'll share more projects in the near future.`
            this.textBox(text);
            this.funk = this.textBox;
        }
    }
    async textBox(text, skip=false) {
        if (text) {
            if (!skip) {await this.currentAnim.finished;}
            let div = document.createElement('p');
            div.classList.add('about-p1');
            div.textContent = text;
            this.currentAnim = div.animate(
                [
                    { opacity: 0},
                    { opacity: 1}
                ], {
                    duration: 300,
                    easing: 'ease-in',
                    iterations: 1,
                    fill: 'both',
            });
            this.shadowRoot.querySelector('#container').innerHTML = "";
            this.shadowRoot.querySelector('#container').appendChild(div);
        } else {
            let div = this.shadowRoot.querySelector('#container').getElementsByClassName('about-p1');
            this.currentAnim = div[0].animate(
                [
                    { opacity: 1},
                    { opacity: 0}
                ], {
                    duration: 300,
                    easing: 'ease-in',
                    iterations: 1,
                    fill: 'both',
            });
        }
    }

    // transitions for table
    async table(state) {
        if (state) { // show
            await this.currentAnim.finished;

            this.shadowRoot.querySelector('#container').innerHTML = `
                <link rel="stylesheet" href="../css/about.css">    
                <section id="about-page-3">
                <table>
                <th>EXPERIENCE</th>
                <th> </th>
                <tr class="jobmain">
                    <td class="jobtitle">DSP Engineer</td>
                    <td class="jobdate">Dec 2023 - Present</td>
                </tr>
                <tr class="jobdet">
                    <td class="jobtitle">
                    <a href="https://www.l-acoustics.com/" target="_blank" rel="noopener noreferrer">
                        L-ACOUSTICS
                    </a></td>
                    <td class="jobdate">Marcoussis, France</td>
                </tr>
                <tr class="jobmain">
                    <td class="jobtitle">Internship - DSP</td>
                    <td class="jobdate">Feb 2023 - Aug 2023</td>
                </tr>
                <tr class="jobdet">
                    <td class="jobtitle">
                    <a href="https://www.arturia.com/" target="_blank" rel="noopener noreferrer">
                        ARTURIA
                    </a></td>
                    <td class="jobdate">Grenoble, France</td>
                </tr>
                <tr class="jobmain">
                    <td class="jobtitle">Internship - DSP</td>
                    <td class="jobdate">Jun 2022 - Sep 2022</td>
                </tr>
                <tr class="jobdet">
                    <td class="jobtitle">
                    <a href="https://www.yamaha.com/en/" target="_blank" rel="noopener noreferrer">
                        YAMAHA
                    </a></td>
                    <td class="jobdate">Hamamatsu, Japan</td>
                </tr>
                <tr class="jobmain">
                    <td class="jobtitle"><a class="jobref" href="media/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a></td>
                    <td class="jobdate"><a class="jobref" href="https://www.linkedin.com/in/aramburog/" target="_blank" rel="noopener noreferrer">LinkedIn</a></td>
                </tr>
                </table>
            </section>`;

            parent = this.shadowRoot.querySelector('table');
            let i = 0;
            let children = parent.children[0].children;

            for (i = 0; i < children.length; i++) {
                this.currentAnim = children[i].animate(
                [
                    { transform: 'translateY(10dvh)', opacity: '0', width: '0%', borderTopColor: 'transparent'},
                    { transform: 'translateY(0%)', opacity: '0.5', width: '0%'},
                    { opacity: '0.6', width: '1%', borderTopColor: 'transparent'},
                    { opacity: '1', width: '100%', borderTopColor: 'var(--about-tx-color)'}
                ], {
                    duration: 300,
                    delay: i * 100,
                    easing: 'ease-in',
                    iterations: 1,
                    fill: 'both',
                });
            }
        } else { // hide
            parent = this.shadowRoot.querySelector('table');
            let i = 0;
            let children = parent.children[0].children;
            for (i = 0; i < children.length; i++) {
                this.currentAnim = children[i].animate(
                [
                    { transform: 'translateY(0%)', opacity: '1'},
                    { transform: 'translateY(0%)', opacity: '0.6', borderTopColor: 'transparent'},
                    { transform: 'translateY(-5dvh)', opacity: '0.5'},
                    { transform: 'translateY(-10dvh)', opacity: '0', borderTopColor: 'transparent'}
                ], {
                    duration: 300,
                    delay: i * 100,
                    easing: 'ease-in',
                    iterations: 1,
                    fill: 'both',
                    //direction: 'reverse'
                });
            };
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="../css/about.css">            
        <section id="container">
        </section>
        `;
    }

    // Slower response to avoid jittery interaction
    debounce = (callback, wait=250) => {
        let timeoutId = null;
        return (...args) => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
            callback(...args);
            }, wait);
        };
    }
}

customElements.define('about-page', AboutPage);
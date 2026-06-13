class AboutPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="../css/about.css">            
        <section id="about-page-2" style="color: var(--about-tx-color);">
            <p class="about-p1">Thank you for visiting my website. 
            I'm Guillermo, a DSP Engineer, specializing in audio. 
            Currently based in Paris.</p>
        </section>

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
        </section>

        <section id="about-page-4">
            <p class="about-p1">I enjoy the process of
            learning new things and there's always some new subject
            I want to take a stab at. For example, this website. 
            Hopefully I'll share more projects in the near future.</p>
        </section>
        `;
    }
}

customElements.define('about-page', AboutPage);
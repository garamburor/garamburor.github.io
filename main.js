import './js/nav-tab.js';
import './js/title.js';
import './js/about.js'; 
import './js/contact.js'; 
import './js/work.js';

class MainApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.observer = null; // For monitoring scroll
        this.state = null; // State of page
        this.tempTitle = this.state; // Hover title
        // Initialize the app on first load
        document.addEventListener("DOMContentLoaded", this.handleRouting);
    }

    connectedCallback() {
        // Browser back/forward buttons
        window.addEventListener("popstate", (e) => {
            if(e.state){
                // Scroll to previous page
                this.scrollPage(e.state.pos, false);
            }
        });

        // Initial html
        this.render();

        // Listen to link clicks from the nav tab
        this.handleNavDebounced = this.debounce(this.handleNav.bind(this));
        // Listen to nav component
        let nav = this.shadowRoot.querySelector('nav-tab');
        // For nav clicks
        nav.addEventListener('nav-page', (e) => {
            // Scroll to page position
            this.scrollPage(e.detail.link);
        });
        
        // For nav hover
        nav.addEventListener('enter-hover', (e) => {
            // Temporarily show hovered page title
            let title = this.shadowRoot.querySelector('site-title');
            this.tempTitle = e.detail.link;
            title.debounceState(this.tempTitle);
        });

        nav.addEventListener('leave-hover', (e) => {
            // Go back to current page title
            let title = this.shadowRoot.querySelector('site-title');
            if (this.tempTitle != this.state) {
                title.debounceState(this.state);
            }
            this.tempTitle = this.state;
        });

        // Watch scroll to update nav and title
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Check if it's filling the screen or just entering    
                let ratio = entry.boundingClientRect.height / window.innerHeight;
                // If filling update nav & title
                if ((entry.intersectionRatio * ratio) > 0.7) {
                    this.handleNavDebounced(entry.target.id);
                }
            });
        }, {threshold: [0.25, 0.5, 0.75]});
        
        this.observer.observe(this.shadowRoot.getElementById("work"));
        this.observer.observe(this.shadowRoot.getElementById("about"));
        this.observer.observe(this.shadowRoot.getElementById("contact"));
    }

    disconnectCallback() {
    }

    // Handle  site state
    handleNav(id, hist=true) {
        if (id != this.state) {
            // Disable current page in nav
            let nav = this.shadowRoot.querySelector('nav-tab');
            nav.handleState(id);
            // Update website's title
            document.title = id.toUpperCase() + " - Guillermo A. R.";
            if (hist) {
                // Push in history memory
                window.history.pushState({"pos":id, "pageTitle":document.title},"", '/' + id);
            }
            // Change colors
            document.documentElement.style.setProperty('--tx-color', 'var(--' + id + '-tx-color)');
            // Only change title if hover didn't change it first
            if (id != this.tempTitle) {
                // Change title
                let title = this.shadowRoot.querySelector('site-title');
                title.debounceState(id);
            }
            // Update state memory
            this.state = id;
            this.tempTitle = this.state;
        }
    }

    // Scroll to page position
    scrollPage(id, hist=true) {
        if(id != this.state){
            // Handle website state
            this.handleNavDebounced(id, hist);
            this.observer.disconnect(); // Temporarily disconnect the observer to prevent it from firing during scroll
            // scroll
            this.shadowRoot.getElementById(id).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
            setTimeout(() => {
                this.observer.observe(this.shadowRoot.getElementById("work"));
                this.observer.observe(this.shadowRoot.getElementById("about"));
                this.observer.observe(this.shadowRoot.getElementById("contact"));
            }, 3000); // Reconnect after
        }
    }

    handleRouting = () => {
        const path = window.location.pathname.slice(1);
        // Simple logic to decide what to show
        if (path === "") {
            this.scrollPage('work');
        } 
        else if (path === "about") {
            this.scrollPage("about");
        }
        else if (path === "contact") {
            this.scrollPage("contact");
        }
        else {
            // Make a 404
        }
    };
    
    render() {
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                /* Hide scrollbar in Firefox */
                scrollbar-width: none;
                /* Hide scrollbar in IE and Edge */
                -ms-overflow-style: none;
                /* Hide scrollbar in webkit */
                -webkit-scrollbar: none;
                /* Take whole space of screen */
                display: block;
                width: 100dvw;
                height: 100dvh;
                z-index: auto;
                /* Allow scrolling inside object */
                overflow-y: auto;
                -webkit-scroll-snap-type: y proximity;
                scroll-snap-type: y proximity;
                /* scroll-snap-align: start; */
                /* remove gap at top for nav bar */
                top: 0;
                margin: 0;
                padding-top: 0;
                /* help safari render font well */
                -webkit-font-smoothing: antialiased !important;
                text-rendering: optimizeLegibility;
                background-color: var(--bg-color);
            }

        </style>
            <nav-tab></nav-tab>

            <site-title></site-title>
            
            <work-page id="work"></work-page>

            <about-page id="about"></about-page>

            <contact-page id="contact"></contact-page>
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
customElements.define('main-app', MainApp);
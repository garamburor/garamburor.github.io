import './js/nav-tab.js';
import './js/title.js';
import './js/about.js'; 
import './js/contact.js'; 
import './js/work.js';
import './js/photos.js';
import './js/404.js';

class MainApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.observer = null; // For monitoring scroll
        this.state = null; // State of page
        this.tempTitle = this.state; // Hover title
        // Initialize the app on first load
        document.addEventListener("DOMContentLoaded", this.handleURL);
    }

    connectedCallback() {
        // Browser back/forward buttons
        window.addEventListener("popstate", (e) => {
            if(e.state){
                // Scroll to previous page
                this.handleState(e.state.pos, false);
            }
        });

        // Initial html
        this.render();

        // Listen to link clicks from the nav tab
        this.handleNavDebounced = this.debounce(this.handleNav.bind(this));

        // Listen to nav component
        let nav = this.shadowRoot.querySelector('nav-tab');

        // For nav clicks
        nav.addEventListener('change-page', (e) => {
            // Scroll to page position
            this.handleState(e.detail.link);
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
    }

    disconnectCallback() {
    }

    // Handle site state
    async handleNav(id, hist=true) {
        if (id != this.state) {
            // Create new page
            let newElem = document.createElement(id + '-page');
            newElem.id = id;
            // Add new page
            this.shadowRoot.appendChild(newElem);
            newElem.className = 'is-hidden';
            // Remove page that already exists
            if (this.state != null) {
                // Look for prev page in document
                let oldElem = this.shadowRoot.querySelector(this.state + '-page');
                // If its the work page, remove state call listener
                if (this.state === "work") {
                    // Listen to work component
                    let work = this.shadowRoot.querySelector('work-page');
                    work.removeEventListener('change-page', (e) => {
                        // Scroll to page position
                        this.handleState(e.detail.link);
                    });
                }
                // Trigger page unload and wait until it's done
                let unloadPage = oldElem.unload();
                await unloadPage;
                oldElem.remove();
                newElem.classList.remove('is-hidden');
            }

            if (id === "work") { // Add state listener if its the work page
                 // Listen to work component
                let work = this.shadowRoot.querySelector('work-page');
                // For work clicks
                work.addEventListener('change-page', (e) => {
                    // Scroll to page position
                    this.handleState(e.detail.link);
                });
            }
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
    handleState(id, hist=true) {
        if(id != this.state){
            // Handle website state
            this.handleNavDebounced(id, hist);
        }
    }

    handleURL = () => {
        const path = window.location.pathname.slice(1);
        // Simple logic to decide what to show
        if (path === "" || path === "work") {
            this.handleState('work');
        } 
        else if (path === "photo") {
            this.handleState("photo");
        }
        else if (path === "about") {
            this.handleState("about");
        }
        else if (path === "contact") {
            this.handleState("contact");
        }
        else {
            //this.handleState("4o4");
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
// Smooth scrolling for navigation links
document.querySelectorAll('a.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target){
            const offsetTop = target.offsetTop - 70; // Adjust for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced Form Submission Handling with Client-Side Validation
const form = document.querySelector('form');
form.addEventListener('submit', function(e){
    e.preventDefault();
    // Basic client-side validation
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('emailAddress').value.trim();
    const phone = document.getElementById('phoneNumber').value.trim();
    const message = document.getElementById('messageContent').value.trim();

    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(email)){
        alert('Please enter a valid email address.');
        return;
    }

    // Phone number validation (basic)
    const phonePattern = /^\d{10,15}$/;
    if(!phonePattern.test(phone)){
        alert('Please enter a valid phone number.');
        return;
    }

    if(!fullName || !email || !phone || !message){
        alert('Please fill in all fields.');
        return;
    }

    // Here you can add AJAX code to submit the form data securely
    // For example, using Fetch API
    /*
    fetch('your-server-endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ fullName, email, phone, message })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            alert('Message Sent!');
            form.reset();
        } else {
            alert('There was an error sending your message. Please try again later.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error sending your message. Please try again later.');
    });
    */

    // For demonstration, we use a simple alert
    alert('Message Sent!');
    form.reset();
});

// Optional: Highlight active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 80;
        if(pageYOffset >= sectionTop){
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.navbar-nav .nav-link').forEach(a => {
        a.classList.remove('active');
        if(a.getAttribute('href') === `#${current}`){
            a.classList.add('active');
        }
    });
});

// Dark Mode Toggle
const body = document.body;
const toggleDarkMode = document.getElementById('dark-mode-toggle');

toggleDarkMode.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    toggleDarkMode.innerHTML = body.classList.contains('dark-mode') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Initialize GSAP Animations After the DOM is Fully Loaded
document.addEventListener("DOMContentLoaded", () => {
    // Register the ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Create a master timeline
    const masterTimeline = gsap.timeline({
        defaults: { ease: "power2.out", duration: 1 },
        scrollTrigger: {
            trigger: "#main",
            start: "top center",
            toggleActions: "play none none reverse",
        }
    });

    // Navbar Animation
    masterTimeline.from(".navbar", { y: -100, opacity: 0 });

    // Main Heading and Paragraph Animation
    masterTimeline.from("#main-heading", { x: -300, opacity: 0 }, "-=0.5");
    masterTimeline.from("#main-paragraph", { x: 300, opacity: 0 }, "-=0.8");

    // Technology Icons Animation with Stagger
    masterTimeline.from("#icons i", { scale: 0, opacity: 0, stagger: 0.2 }, "-=0.5");

    // About Section Animation
    masterTimeline.from("#about img", { scale: 0.8, opacity: 0 }, "-=0.3");
    masterTimeline.from("#about h1, #about p, #about .btn-primary", {
        y: 50,
        opacity: 0,
        stagger: 0.2
    }, "-=0.5");

    // Services Section Animation
    masterTimeline.from(".service-box", {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".service-box",
            start: "top 80%",
            toggleActions: "play none none none",
        }
    });

    // Project Cards Animation
    masterTimeline.from(".card", {
        rotationY: 90,
        opacity: 0,
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".card",
            start: "top 80%",
            toggleActions: "play none none none",
        }
    }, "-=0.5");

    // Recommendations Section Animation
    masterTimeline.from("#recommendations .card", {
        rotationX: 90,
        opacity: 0,
        stagger: 0.2,
        scrollTrigger: {
            trigger: "#recommendations .card",
            start: "top 80%",
            toggleActions: "play none none none",
        }
    }, "-=0.5");

    // Footer Animation
    masterTimeline.from("footer", { y: 100, opacity: 0 }, "-=0.5");

    // Dark Mode Toggle Animation
    const toggleButton = document.getElementById("dark-mode-toggle");
    toggleButton.addEventListener("click", () => {
        gsap.to("body", { 
            duration: 1, 
            backgroundColor: "#000000", 
            color: "#ffffff", 
            ease: "power2.out",
            onComplete: () => {
                document.body.classList.toggle("dark-mode");
            }
        });
    });

    // Function to apply fade-in animation to selected elements
    function applyFadeAnimation(selector, triggerElement = selector, options = {}) {
        gsap.from(selector, {
            scrollTrigger: {
                trigger: triggerElement,
                start: "top 80%", // When the top of the trigger element hits 80% of the viewport height
                toggleActions: "play none none none",
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power2.out",
            ...options
        });
    }

    // Apply fade-in animations to various sections and elements
    document.addEventListener("DOMContentLoaded", () => {
        // Fade-in for Navigation Bar
        applyFadeAnimation(".navbar", ".navbar");

        // Fade-in for Main Section
        applyFadeAnimation("#main-heading", "#main-heading");
        applyFadeAnimation("#main-paragraph", "#main-paragraph");

        // Fade-in for Technology Icons
        applyFadeAnimation("#icons i", "#icons i", { stagger: 0.2 });

        // Fade-in for About Section
        applyFadeAnimation("#about", "#about");
        applyFadeAnimation("#about img", "#about img");
        applyFadeAnimation("#about h1", "#about h1");
        applyFadeAnimation("#about p", "#about p");
        applyFadeAnimation("#about .btn-primary", "#about .btn-primary");

        // Fade-in for Services Section
        applyFadeAnimation(".service-box", ".service-box", { stagger: 0.2 });

        // Fade-in for Projects Sections
        applyFadeAnimation(".card", ".card", { stagger: 0.2 });

        // Fade-in for Recommendations Section
        applyFadeAnimation("#recommendations .card", "#recommendations .card", { stagger: 0.2 });

        // Fade-in for Contact Section
        applyFadeAnimation("#contact", "#contact");
        applyFadeAnimation("#contact form", "#contact form");
        applyFadeAnimation("#contact img", "#contact img");

        // Fade-in for Footer
        applyFadeAnimation("footer", "footer");
    });
    // Initializing AOS (If you choose to keep it)
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 1200,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            anchorPlacement: 'top-bottom',
        });
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.globalTimeline.progress(1).pause();
    }
});
 // Register the ScrollTrigger plugin
 gsap.registerPlugin(ScrollTrigger);

 // Function to apply fade-in animation to selected elements
 function applyFadeAnimation(selector, triggerElement = selector, options = {}) {
     gsap.from(selector, {
         scrollTrigger: {
             trigger: triggerElement,
             start: "top 80%", // When the top of the trigger element hits 80% of the viewport height
             toggleActions: "play none none none",
         },
         opacity: 0,
         y: 50,
         duration: 1,
         ease: "power2.out",
         ...options
     });
 }

 // Apply fade-in animations to various sections and elements
 document.addEventListener("DOMContentLoaded", () => {
     // Fade-in for Navigation Bar
     applyFadeAnimation(".navbar", ".navbar");

     // Fade-in for Main Section
     applyFadeAnimation("#main-heading", "#main-heading");
     applyFadeAnimation("#main-paragraph", "#main-paragraph");

     // Fade-in for Technology Icons
     applyFadeAnimation("#icons i", "#icons i", { stagger: 0.2 });

     // Fade-in for About Section
     applyFadeAnimation("#about", "#about");
     applyFadeAnimation("#about img", "#about img");
     applyFadeAnimation("#about h1", "#about h1");
     applyFadeAnimation("#about p", "#about p");
     applyFadeAnimation("#about .btn-primary", "#about .btn-primary");

     // Fade-in for Services Section
     applyFadeAnimation(".service-box", ".service-box", { stagger: 0.2 });

     // Fade-in for Projects Sections
     applyFadeAnimation(".card", ".card", { stagger: 0.2 });

     // Fade-in for Recommendations Section
     applyFadeAnimation("#recommendations .card", "#recommendations .card", { stagger: 0.2 });

     // Fade-in for Contact Section
     applyFadeAnimation("#contact", "#contact");
     applyFadeAnimation("#contact form", "#contact form");
     applyFadeAnimation("#contact img", "#contact img");

     // Fade-in for Footer
     applyFadeAnimation("footer", "footer");
 });

 // Interactive Hover Animations
 const buttons = document.querySelectorAll(".btn");
 buttons.forEach(button => {
     button.addEventListener("mouseenter", () => {
         gsap.to(button, { scale: 1.1, duration: 0.3, ease: "power1.out" });
     });
     button.addEventListener("mouseleave", () => {
         gsap.to(button, { scale: 1, duration: 0.3, ease: "power1.out" });
     });
 });

 const projectCards = document.querySelectorAll(".card");
 projectCards.forEach(card => {
     card.addEventListener("mouseenter", () => {
         gsap.to(card, { scale: 1.05, boxShadow: "0px 10px 30px rgba(0,0,0,0.2)", duration: 0.3 });
     });
     card.addEventListener("mouseleave", () => {
         gsap.to(card, { scale: 1, boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", duration: 0.3 });
     });
     card.addEventListener("click", () => {
         gsap.to(card, { rotationY: 360, duration: 1, ease: "power2.inOut" });
     });
 });

 // Navigation Toggle Animation for Mobile
 const navbarToggler = document.querySelector(".navbar-toggler");
 const navbarCollapse = document.querySelector("#navbarNav");

 navbarToggler.addEventListener("click", () => {
     if (navbarCollapse.classList.contains("show")) {
         gsap.to(navbarCollapse, { height: 0, duration: 0.5, ease: "power2.inOut" });
     } else {
         gsap.fromTo(navbarCollapse, 
             { height: 0 }, 
             { height: "auto", duration: 0.5, ease: "power2.inOut" }
         );
     }
 });

 // Responsive Animation Adjustments
 function adjustAnimations() {
     const isMobile = window.innerWidth < 768;

     if (isMobile) {
         gsap.to(".card", { rotationY: 0 });
         gsap.to("#main-heading", { x: 0 });
         gsap.to("#main-paragraph", { x: 0 });
     } else {
         
     }
 }

 // Debounce Function
 function debounce(func, wait = 20, immediate = true) {
     let timeout;
     return function() {
         let context = this, args = arguments;
         let later = function() {
             timeout = null;
             if (!immediate) func.apply(context, args);
         };
         let callNow = immediate && !timeout;
         clearTimeout(timeout);
         timeout = setTimeout(later, wait);
         if (callNow) func.apply(context, args);
     };
 }

 window.addEventListener("resize", debounce(adjustAnimations, 200));
 adjustAnimations(); // Initial call

 // Dark Mode Toggle Animation
 const toggleButton = document.getElementById("dark-mode-toggle");
 toggleButton.addEventListener("click", () => {
     gsap.to("body", { 
         duration: 1, 
         backgroundColor: "#000000", 
         color: "#ffffff", 
         ease: "power2.out",
         onComplete: () => {
             document.body.classList.toggle("dark-mode");
             // Update ARIA attribute
             const isPressed = toggleButton.getAttribute("aria-pressed") === "true";
             toggleButton.setAttribute("aria-pressed", !isPressed);
         }
     });
 });

 
 gsap.to("#main", {
     backgroundPosition: "50% 100%",
     ease: "none",
     scrollTrigger: {
         trigger: "#main",
         start: "top bottom",
         scrub: true,
     }
 });

 // Check for Reduced Motion Preference
 if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
     gsap.globalTimeline.progress(1).pause(); // Disable all GSAP animations
     buttons.forEach(button => {
         button.style.transition = "none";
     });
     projectCards.forEach(card => {
         card.style.transition = "none";
     });
     AOS.init({
        duration: 1200,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        anchorPlacement: 'top-bottom',
    });
 }
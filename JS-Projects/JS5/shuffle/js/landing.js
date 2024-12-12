

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true
    });

    // GSAP Animations
    gsap.from('.navbar-brand', { duration: 1, x: -100, opacity: 0, ease: 'bounce' });
    gsap.from('.display-4', { duration: 1.5, y: -50, opacity: 0, delay: 0.5 });
    gsap.from('.icon-container .icon', {
        duration: 1,
        scale: 0,
        stagger: 0.2,
        delay: 1
    });
    gsap.from('.footer', { duration: 1, y: 50, opacity: 0, ease: 'power2.inOut' });
});
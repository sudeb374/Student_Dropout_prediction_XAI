document.addEventListener("DOMContentLoaded", () => {
    // Select all elements with reveal classes
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    // Setup Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the visible class to trigger the CSS transition
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe each element
    revealElements.forEach(el => revealObserver.observe(el));
});

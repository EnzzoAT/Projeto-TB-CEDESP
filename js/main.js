(() => {
    'use strict';

    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (menuToggle && navList) {
        const setMenuState = (isOpen) => {
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
            navList.classList.toggle('is-open', isOpen && mobileQuery.matches);
            document.body.classList.toggle('menu-open', isOpen && mobileQuery.matches);
        };

        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
            setMenuState(isOpen);
        });

        navLinks.forEach((link) => link.addEventListener('click', () => setMenuState(false)));
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
                setMenuState(false);
                menuToggle.focus();
            }
        });
        mobileQuery.addEventListener('change', (event) => {
            setMenuState(false);
            if (!event.matches) navList.classList.remove('is-open');
        });
    }

    // Efeitos de entrada discretos com GSAP; o conteúdo continua funcional sem a biblioteca.
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.texto-hero-container > *', {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        delay: 0.15
    });

    gsap.utils.toArray('.card-1, .card-2, .card-3, .card-4').forEach((card, index) => {
        gsap.fromTo(card,
            { opacity: 0.65, y: 34 },
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Em telas pequenas, os cards ficam sticky e se sobrepõem durante a rolagem.
    const mobileCards = gsap.matchMedia();
    mobileCards.add('(max-width: 767px)', () => {
        const cards = gsap.utils.toArray('.card-1, .card-2, .card-3, .card-4');
        cards.forEach((card, index) => {
            if (index === cards.length - 1) return;
            gsap.to(card, {
                scale: 0.94,
                opacity: 0.72,
                transformOrigin: 'center top',
                ease: 'none',
                scrollTrigger: {
                    trigger: cards[index + 1],
                    start: 'top bottom',
                    end: 'top top+=110',
                    scrub: true
                }
            });
        });
    });
})();

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const initPortfolioAnimations = () => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.getAll().forEach((t: any) => t.kill());

    gsap.set('.gsap-hide', { visibility: 'visible' });

    // 1. HERO ANIMATION
    const tlHero = gsap.timeline();
    tlHero
        .from('#vv-smart-nav', {
            y: '-100%',
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
        })
        .from(
            '.gsap-slide-up',
            {
                y: 80,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power4.out',
            },
            '-=0.5'
        )
        .from(
            '.gsap-fade-in',
            { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out' },
            '-=1'
        );

    // 2. ECOSYSTEM ANIMATION
    gsap.from('.gsap-group-slide-up', {
        scrollTrigger: { trigger: '#explore', start: 'top 55%' },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
    });

    gsap.from('.gsap-eco-card', {
        scrollTrigger: { trigger: '#explore', start: 'top 50%' },
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.2,
    });

    // 3. PRODUCT SHOWCASE ANIMATION
    gsap.from('.gsap-showcase-header', {
        scrollTrigger: { trigger: '#showcase', start: 'top 55%' },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
    });

    gsap.from('.gsap-showcase-item', {
        scrollTrigger: { trigger: '#showcase', start: 'top 50%' },
        y: 150,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
    });

    // 4. TEAM SECTION
    gsap.from('.gsap-team-enter', {
        scrollTrigger: { trigger: '#team-section', start: 'top 60%' },
        x: 150,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
    });

    const teamTrack = document.querySelector('.gsap-team-track') as HTMLElement;

    if (teamTrack) {
        const getScrollAmount = () => {
            let distance = window.innerWidth - teamTrack.scrollWidth - 100;
            return Math.min(0, distance);
        };

        const tween = gsap.to(teamTrack, {
            x: getScrollAmount,
            ease: 'none',
        });

        ScrollTrigger.create({
            trigger: '#team-section',
            start: 'top top',
            end: () => `+=${teamTrack.scrollWidth}`,
            pin: true,
            animation: tween,
            scrub: 1,
            invalidateOnRefresh: true,
        });
    }

    // 5. FOOTER ANIMATION
    gsap.from('.gsap-footer-fade', {
        scrollTrigger: { trigger: 'footer', start: 'top 70%' },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
    });
};

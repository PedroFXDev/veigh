document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle Logic
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    mobileToggle.addEventListener('click', () => {
        if (navMenu.style.display === 'flex') {
            navMenu.style.display = 'none';
        } else {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '100%';
            navMenu.style.left = '0';
            navMenu.style.width = '100%';
            navMenu.style.background = 'rgba(5,5,5,0.95)';
            navMenu.style.padding = '2rem';
            navMenu.style.borderBottom = '1px solid var(--neon-purple)';
        }
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                if (window.innerWidth <= 768) navMenu.style.display = 'none';
            }
        });
    });

    // Parallax Hero
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        hero.style.backgroundPositionY = `${window.pageYOffset * 0.5}px`;
    });

    // =========================================
    // SCROLL REVEAL — Intersection Observer
    // =========================================
    const revealElements = document.querySelectorAll(
        '.section-title, .spotify-card, .show-item, .stat-item, .hero-subtitle, .btn-primary'
    );

    revealElements.forEach((el, i) => {
        el.classList.add('sr-hidden');
        // Stagger delay based on siblings
        const siblings = el.parentElement ? [...el.parentElement.children] : [];
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = `${idx * 0.12}s`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('sr-visible');
                entry.target.classList.remove('sr-hidden');
                observer.unobserve(entry.target); // animate only once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // =========================================
    // HEADER SCROLL SHRINK
    // =========================================
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // =========================================
    // SHOWS — carregar do shows.json
    // =========================================
    const showsContainer = document.getElementById('shows-container');
    if (showsContainer) {
        fetch('shows.json')
        .then(response => {
            if (!response.ok) throw new Error('Arquivo shows.json não encontrado');
            return response.json();
        })
        .then(shows => {
            showsContainer.innerHTML = '';
            if (!shows || shows.length === 0) {
                showsContainer.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:3rem;">Nenhum show agendado no momento.</div>';
                return;
            }
            shows.forEach(show => {
                const isSoldOut = show.status === 'sold_out';
                const btnLabel = isSoldOut ? 'ESGOTADO' : 'COMPRAR INGRESSO';
                const btnClass = isSoldOut ? 'btn-ticket sold-out' : 'btn-ticket';
                const showHTML = `
                    <div class="show-item sr-hidden">
                        <div class="show-info">
                            <div class="show-date">${show.date}</div>
                            <div class="show-details">
                                <h3>${show.venue}</h3>
                                <p>${show.city}</p>
                            </div>
                        </div>
                        <a href="${show.ticket_url}" class="${btnClass}" ${!isSoldOut ? 'target="_blank"' : ''}>${btnLabel}</a>
                    </div>
                `;
                showsContainer.insertAdjacentHTML('beforeend', showHTML);
            });

            // Observe dynamically added show items
            document.querySelectorAll('.show-item.sr-hidden').forEach((el, i) => {
                el.style.transitionDelay = `${i * 0.15}s`;
                observer.observe(el);
            });
        })
        .catch(() => {
            showsContainer.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:3rem;">Nenhum show agendado no momento.</div>`;
        });
    }
});


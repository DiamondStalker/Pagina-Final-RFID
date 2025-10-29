// Sistema de Tema Claro/Oscuro
(function() {
    'use strict';
    
    // Obtener el tema guardado o usar 'light' como predeterminado
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme;
    
    // Toggle del tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.body.className = newTheme;
            localStorage.setItem('theme', newTheme);
        });
    }
})();

// Navegación suave a secciones
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Efecto de aparición al hacer scroll
(function() {
    'use strict';
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar todas las tarjetas y secciones
    document.addEventListener('DOMContentLoaded', function() {
        const animatedElements = document.querySelectorAll('.card, .section-header, .process-item');
        animatedElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    });
})();

// Indicador de sección activa en la navegación
(function() {
    'use strict';
    
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navButtons = document.querySelectorAll('.nav-button');
        
        let currentSection = '';
        
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navButtons.forEach(function(button) {
            button.style.background = 'transparent';
            const onclick = button.getAttribute('onclick') || '';
            const match = onclick.match(/'([^']+)'/);
            if (!match) return;
            const sectionId = match[1];
            if (sectionId === currentSection) {
                button.style.background = 'var(--secondary)';
            }
        });
    });
})();

// Animación de números en la sección de resultados
(function() {
    'use strict';
    
    function animateValue(element, start, end, duration, suffix) {
        let startTimestamp = null;
        const step = function(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    
                    const statValues = entry.target.querySelectorAll('.stat-big-value');
                    statValues.forEach(function(stat) {
                        const text = stat.textContent;
                        if (text.includes('%')) {
                            animateValue(stat, 0, 100, 2000, '%');
                        } else if (text.includes('s')) {
                            animateValue(stat, 0, 2, 1500, 's');
                        } else if (text.includes('24')) {
                            stat.textContent = '24/7';
                        }
                    });
                }
            });
        }, { threshold: 0.5 });
        
        const resultsSection = document.querySelector('.results-stats');
        if (resultsSection) {
            statsObserver.observe(resultsSection);
        }
    });
})();

// Mejora de accesibilidad para navegación con teclado
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        const buttons = document.querySelectorAll('button, .nav-button');
        
        buttons.forEach(function(button) {
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    });
})();

// Prevenir que el botón de tema interfiera con el scroll
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });
})();

// OneDrive preview modal logic
(function() {
    'use strict';

    // URL pública de OneDrive (carpeta compartida)
    const oneDriveShare = 'https://1drv.ms/f/c/95552b31406338aa/Eq6O2md4WcFKvLmqHTbHX34BwHb00wxOdkiF19NW9AY5zQ?e=6gyuae';

    // Elementos del DOM (se enlazan al cargar)
    document.addEventListener('DOMContentLoaded', function() {
        const previewBtn = document.getElementById('preview-onedrive');
        const modal = document.getElementById('onedrive-modal');
        const backdrop = document.getElementById('onedrive-modal-backdrop');
        const closeBtn = document.getElementById('onedrive-modal-close');
        const iframe = document.getElementById('onedrive-iframe');

        if (!previewBtn || !modal || !iframe) return;

        function openModal() {
            // Intento de usar el Office Viewer para mejor compatibilidad en archivos de Office/PDF
            const officeViewer = 'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(oneDriveShare);
            iframe.src = officeViewer;

            // Si Office Viewer no funciona por CORS/embeds, mostramos la carpeta OneDrive directamente como fallback.
            // Se configura un timeout corto: si el iframe no carga en 2s, cargamos el enlace directo.
            const fallbackTimeout = setTimeout(function() {
                if (iframe.contentDocument === null) {
                    iframe.src = oneDriveShare;
                }
            }, 2000);

            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            // limpiar timeout al cerrar
            modal._fallbackTimeout = fallbackTimeout;
        }

        function closeModal() {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            iframe.src = '';
            document.body.style.overflow = '';
            if (modal._fallbackTimeout) {
                clearTimeout(modal._fallbackTimeout);
                modal._fallbackTimeout = null;
            }
        }

        previewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });

        closeBtn && closeBtn.addEventListener('click', closeModal);
        backdrop && backdrop.addEventListener('click', closeModal);

        // Cerrar con Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
                closeModal();
            }
        });
    });
})();

console.log('Sistema RFID - Colegio Divino Salvador');
console.log('Sitio web cargado correctamente');

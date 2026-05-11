/**
 * Maneja los eventos de clic de la página de forma centralizada usando delegación de eventos.
 * Este enfoque mejora el rendimiento y la mantenibilidad, especialmente en páginas complejas
 * o con contenido dinámico.
 */
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        const whatsappButton = event.target.closest('.js-whatsapp-btn');
        const contactButton = event.target.closest('.js-contact-btn');

        // Redirigir todas las acciones de WhatsApp y cotización a la página de contacto interna
        // para evitar el uso de números de teléfono específicos en el código.
        if (whatsappButton || contactButton) {
            window.location.href = 'contacto.html';
        }
    });

    // === MOBILE MENU TOGGLE ===
    const mobileMenuToggle = document.getElementById('mobile-menu');
    const mainNav = document.querySelector('header nav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Previene el scroll del body cuando el menú está abierto
        });

        // Cierra el menú cuando se hace clic en un enlace (para UX)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // === INTERSECTION OBSERVER FOR ANIMATIONS ===
    // Anima elementos cuando entran en el viewport.
    const animatedGrids = document.querySelectorAll('.catalog-main-layout, .features-grid'); // Selector actualizado

    const gridObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Animar solo una vez
            }
        });
    }, {
        threshold: 0.1 // El elemento debe ser visible en un 10% para activar
    });

    animatedGrids.forEach(element => {
        gridObserver.observe(element);
    });

    // === CATALOG IMAGE SWAP ON CLICK ===
    // Al hacer clic en una miniatura, esta se muestra en el recuadro grande.
    const catalogMain = document.querySelector('.catalog-main-layout');
    if (catalogMain) {
        const mainImg = catalogMain.querySelector('.main-catalog-image img');
        const thumbnails = catalogMain.querySelectorAll('.catalog-thumb-grid img');

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Actualizar fuente y texto alternativo de la imagen principal
                mainImg.src = thumb.src;
                mainImg.alt = thumb.alt;
                
                // Efecto visual suave de entrada al cambiar
                mainImg.style.animation = 'none';
                void mainImg.offsetWidth; // Truco para reiniciar la animación
                mainImg.style.animation = 'fadeInUp 0.4s ease-out';
            });
        });
    }

    // === LIGHTBOX LOGIC ===
    // Permite ampliar la imagen principal del catálogo al hacer clic.
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox) {
        const mainImageContainer = document.querySelector('.main-catalog-image');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        if (mainImageContainer && lightboxImg && closeBtn) {
            mainImageContainer.addEventListener('click', () => {
                const mainImageEl = mainImageContainer.querySelector('img');
                lightbox.classList.add('active');
                lightboxImg.src = mainImageEl.src;
            });

            const closeLightbox = () => lightbox.classList.remove('active');

            closeBtn.addEventListener('click', closeLightbox);
            // Cierra el lightbox si se hace clic en el fondo (overlay)
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });

            // Cierra el lightbox al presionar la tecla "Escape"
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                    closeLightbox();
                }
            });
        }
    }

    // === CAROUSEL LOGIC ===
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (track && slides.length > 0) {
        let currentIndex = 0;
        let slidesPerView = 1;
        const gap = 20; // Debe coincidir con el gap del CSS
        let autoPlayInterval;

        // Determina cuántos slides se ven según el ancho de pantalla
        const updateSlidesPerView = () => {
            if (window.innerWidth >= 1024) slidesPerView = 3;
            else if (window.innerWidth >= 768) slidesPerView = 2;
            else slidesPerView = 1;
            
            // Ajustar índice si cambia el tamaño para evitar espacios vacíos
            const maxIndex = slides.length - slidesPerView;
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            updateCarousel();
        };

        const updateCarousel = () => {
            const slideWidth = slides[0].offsetWidth + gap;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        };

        const nextSlide = () => {
            const maxIndex = slides.length - slidesPerView;
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop al inicio
            }
            updateCarousel();
        };

        const prevSlide = () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = slides.length - slidesPerView; // Loop al final
            }
            updateCarousel();
        };

        // Auto-play silencioso
        const startAutoPlay = () => {
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, 4500);
        };

        const stopAutoPlay = () => clearInterval(autoPlayInterval);

        // Event Listeners
        nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
        prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
        
        // Pausar en hover
        track.parentElement.addEventListener('mouseenter', stopAutoPlay);
        track.parentElement.addEventListener('mouseleave', startAutoPlay);
        
        // Responsive
        window.addEventListener('resize', updateSlidesPerView);

        // Inicialización
        updateSlidesPerView();
        startAutoPlay();
    }
});
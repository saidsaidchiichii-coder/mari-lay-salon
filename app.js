document.addEventListener('DOMContentLoaded', function () {
  
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ==========================================================================
     DARK MODE THEME TOGGLE
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  
  // Function to apply light/dark theme icon states
  function updateThemeIcons() {
    // Lucide handles icons, we toggle standard state
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Apply saved theme preference on load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }

  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Close mobile menu when clicking any link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });


  /* ==========================================================================
     INTERACTIVE 3D MAGNETIC CARD TILT (HERO & INSTAGRAM CARDS)
     ========================================================================== */
  function setup3DTilt(cardId, maxTilt = 15) {
    const card = document.getElementById(cardId);
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // mouse x inside card
      const y = e.clientY - rect.top;  // mouse y inside card
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation based on cursor position relative to card center
      const tiltX = ((y / height) - 0.5) * -maxTilt; // Rotate on X-axis based on Y-mouse
      const tiltY = ((x / width) - 0.5) * maxTilt;   // Rotate on Y-axis based on X-mouse
      
      card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03)`;
      card.style.boxShadow = `0 35px 70px -15px rgba(244, 111, 124, 0.25)`;
    });

    card.addEventListener('mouseleave', () => {
      // Smoothly restore resting state
      card.style.transform = `rotateX(10deg) rotateY(-5deg) scale3d(1, 1, 1)`;
      card.style.boxShadow = ``;
    });
  }

  setup3DTilt('hero-3d-card', 15);
  setup3DTilt('instagram-3d-card', 12);


  /* ==========================================================================
     STUNNING 3D ROTATING PHOTO CAROUSEL (VIRTUAL TOUR)
     ========================================================================== */
  const stage = document.getElementById('carousel-3d-stage');
  const slides = document.querySelectorAll('.carousel-item-3d');
  const nextBtn = document.getElementById('carousel-next');
  const prevBtn = document.getElementById('carousel-prev');

  if (stage && slides.length > 0) {
    const totalSlides = slides.length;
    let currentRotation = 0;
    let slideWidth = stage.offsetWidth || 300;
    
    // Calculate 3D radius based on slide width and quantity to fit a perfect circle
    let radius = Math.round(slideWidth / (2 * Math.tan(Math.PI / totalSlides))) + 30;

    // Apply 3D translate and rotate to each slide
    function arrangeSlides() {
      slideWidth = stage.offsetWidth || 300;
      radius = Math.round(slideWidth / (2 * Math.tan(Math.PI / totalSlides))) + 30;
      
      slides.forEach((slide, i) => {
        const theta = i * (360 / totalSlides);
        slide.style.transform = `rotateY(${theta}deg) translateZ(${radius}px)`;
      });
      updateStage();
    }

    function updateStage() {
      stage.style.transform = `rotateY(${currentRotation}deg)`;
      
      // Highlight/focus active center card by fading out back cards
      slides.forEach((slide, i) => {
        const theta = i * (360 / totalSlides);
        // Calculate raw relative angle from screen center (0 deg)
        const relAngle = Math.abs((theta + currentRotation) % 360);
        const normalizedAngle = relAngle > 180 ? 360 - relAngle : relAngle;
        
        // If slide is facing towards screen (normalized angle close to 0)
        if (normalizedAngle < 45) {
          slide.style.opacity = '1';
          slide.style.pointerEvents = 'auto';
          slide.classList.add('border-amber-400');
          slide.classList.remove('border-neutral-800');
        } else {
          slide.style.opacity = '0.35';
          slide.style.pointerEvents = 'none';
          slide.classList.remove('border-amber-400');
          slide.classList.add('border-neutral-800');
        }
      });
    }

    // Next/Prev Buttons
    nextBtn.addEventListener('click', () => {
      currentRotation -= (360 / totalSlides);
      updateStage();
    });

    prevBtn.addEventListener('click', () => {
      currentRotation += (360 / totalSlides);
      updateStage();
    });

    // Touch and Drag Rotation logic
    let isDragging = false;
    let startX = 0;
    let previousRotation = 0;

    function handleStart(clientX) {
      isDragging = true;
      startX = clientX;
      previousRotation = currentRotation;
      stage.style.transition = 'none'; // Instant response during dragging
    }

    function handleMove(clientX) {
      if (!isDragging) return;
      const deltaX = clientX - startX;
      // Convert delta pixel drag to rotation degrees
      const rotationDegree = deltaX * 0.25; 
      currentRotation = previousRotation + rotationDegree;
      updateStage();
    }

    function handleEnd() {
      if (!isDragging) return;
      isDragging = false;
      stage.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
      
      // Snap to nearest slide rotation
      const step = 360 / totalSlides;
      currentRotation = Math.round(currentRotation / step) * step;
      updateStage();
    }

    // Mouse Listeners
    stage.addEventListener('mousedown', (e) => handleStart(e.clientX));
    window.addEventListener('mousemove', (e) => handleMove(e.clientX));
    window.addEventListener('mouseup', () => handleEnd());

    // Touch Listeners
    stage.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientX));
    window.addEventListener('touchmove', (e) => handleMove(e.touches[0].clientX));
    window.addEventListener('touchend', () => handleEnd());

    // Arrange slides on load and window resize
    arrangeSlides();
    window.addEventListener('resize', arrangeSlides);
  }


  /* ==========================================================================
     SCROLL-TRIGGERED 3D FOLD-IN ANIMATIONS FOR SERVICES
     ========================================================================== */
  const serviceCards = document.querySelectorAll('.service-3d-card');
  
  if (serviceCards.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add 3D rotation and reveal entry animation
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, observerOptions);

    serviceCards.forEach((card, index) => {
      // Set initial state: folded in 3D perspective rotated on X and Y
      card.style.opacity = '0';
      card.style.transform = `translateY(40px) rotateX(20deg) rotateY(-5deg) scale(0.95)`;
      card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(card);
    });
  }


  /* ==========================================================================
     WHATSAPP BOOKING FORM ACTION
     ========================================================================== */
  const bookingForm = document.getElementById('booking-form');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value;

      // Construct a premium reservation text template
      const template = `Bonjour Mari Lay! 🌟

Je souhaite faire une réservation pour un soin de beauté :
- *Nom* : ${name}
- *Téléphone* : ${phone}
- *Service demandé* : ${service}
${message ? `- *Note spéciale* : ${message}` : ''}

Merci de me confirmer la disponibilité dès que possible. ✨`;

      // URL encode the message and redirect to official WhatsApp
      const encodedText = encodeURIComponent(template);
      const whatsappUrl = `https://wa.me/212668500684?text=${encodedText}`;
      
      window.open(whatsappUrl, '_blank');
    });
  }

});


/* ==========================================================================
   IMAGE MODAL ZOOM VIEW (PORTFOLIO/POSTER ACCESSIBILITY)
   ========================================================================== */
const imageModal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');

window.openModal = function (imgSrc) {
  if (!imageModal || !modalImg) return;
  modalImg.src = imgSrc;
  imageModal.classList.remove('pointer-events-none');
  imageModal.classList.add('opacity-100');
};

window.closeModal = function () {
  if (!imageModal) return;
  imageModal.classList.remove('opacity-100');
  imageModal.classList.add('pointer-events-none');
};

// Close modal if user clicks backdrop
if (imageModal) {
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
      closeModal();
    }
  });
}

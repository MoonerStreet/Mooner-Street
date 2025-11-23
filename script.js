/* script.js — Mooner Street
   Menú móvil, hero slider, fade-in, carrusel por producto, zoom modal con flechas
*/
document.addEventListener('DOMContentLoaded', () => {

  // --- MENU MÓVIL ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });
  }

  // --- CARRUSEL HERO ---
  const slides = Array.from(document.querySelectorAll('.hero-bg .slide'));
  let slideIndex = 0;

  function showHeroSlide(i) {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
  }

  if (slides.length > 0) {
    showHeroSlide(slideIndex);
    setInterval(() => {
      slideIndex = (slideIndex + 1) % slides.length;
      showHeroSlide(slideIndex);
    }, 4200);
  }

  // --- FADE-IN ---
  const observers = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18 });
    observers.forEach(el => io.observe(el));
  } else {
    observers.forEach(el => el.classList.add('visible'));
  }
});

/* --- CARRUSEL + ZOOM EN CADA PRODUCTO --- */
document.querySelectorAll('.img-slider').forEach(slider => {
  const images = slider.querySelectorAll('img');
  const prev = slider.querySelector('.prev');
  const next = slider.querySelector('.next');

  let index = 0;

  function showSlide(i) {
    images.forEach((img, idx) => img.classList.toggle('active', idx === i));
  }

  if (prev && next && images.length > 1) {
    prev.addEventListener('click', e => {
      e.stopPropagation();
      index = (index - 1 + images.length) % images.length;
      showSlide(index);
    });

    next.addEventListener('click', e => {
      e.stopPropagation();
      index = (index + 1) % images.length;
      showSlide(index);
    });
  }

  images.forEach((img, i) => {
    img.addEventListener('click', () => openModal(images, i));
  });
});

/* --- MODAL ZOOM CON FLECHAS --- */
let modal = document.querySelector('.image-modal');

if (!modal) {
  modal = document.createElement('div');
  modal.classList.add('image-modal');
  modal.innerHTML = `
    <button class="modal-prev">‹</button>
    <img src="" alt="zoom">
    <button class="modal-next">›</button>
  `;
  document.body.appendChild(modal);
}

const modalImg = modal.querySelector('img');
const modalPrev = modal.querySelector('.modal-prev');
const modalNext = modal.querySelector('.modal-next');

let modalImages = [];
let modalIndex = 0;

function openModal(images, startIndex) {
  modalImages = Array.from(images).map(img => img.src);
  modalIndex = startIndex;
  modalImg.src = modalImages[modalIndex];
  modal.classList.add('active');
}

modalPrev.addEventListener('click', e => {
  e.stopPropagation();
  modalIndex = (modalIndex - 1 + modalImages.length) % modalImages.length;
  modalImg.src = modalImages[modalIndex];
});

modalNext.addEventListener('click', e => {
  e.stopPropagation();
  modalIndex = (modalIndex + 1) % modalImages.length;
  modalImg.src = modalImages[modalIndex];
});

modal.addEventListener('click', () => {
  modal.classList.remove('active');
});
/* --- ZOOM CON ARRASTRE (PAN) --- */
let isDragging = false, startX, startY, scrollLeft, scrollTop;

modalImg.addEventListener('mousedown', e => {
  e.preventDefault();
  isDragging = true;
  modalImg.classList.add('grabbing');
  startX = e.pageX - modalImg.offsetLeft;
  startY = e.pageY - modalImg.offsetTop;
  scrollLeft = modalImg.style.transformX || 0;
  scrollTop = modalImg.style.transformY || 0;
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  modalImg.classList.remove('grabbing');
});

modalImg.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const x = e.pageX - modalImg.offsetLeft;
  const y = e.pageY - modalImg.offsetTop;
  const walkX = x - startX;
  const walkY = y - startY;
  modalImg.style.transform = `translate(${walkX}px, ${walkY}px) scale(1.7)`; 
});

// Doble click para volver a normal
modalImg.addEventListener('dblclick', () => {
  modalImg.style.transform = `scale(1)`;
});

document.addEventListener("scroll", () => {
  const bg = document.querySelector("#productos .parallax-bg");
  const rect = bg.parentElement.getBoundingClientRect();
  const amount = rect.top * 0.3; // velocidad del parallax
  bg.style.transform = `translateY(${amount}px)`;
});


</script>






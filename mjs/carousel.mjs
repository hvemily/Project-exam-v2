// Funksjon for å hente blogginnleggene og lage karusellen
export async function updateCarousel() {
  const carouselContainer = document.getElementById('carousel-container');
  let currentSlide = 0;

  try {
      const response = await fetch('https://v2.api.noroff.dev/blog/posts/emilyadmin');
      const data = await response.json();

      // Velg de tre første postene for karusellen
      const firstThreePosts = data.data.slice(0, 3);

      // Fjern eksisterende slides (hvis det finnes noen)
      carouselContainer.innerHTML = '';

      // Generer HTML for disse postene
      firstThreePosts.forEach(post => {
          const slide = document.createElement('div');
          slide.classList.add('carousel-slide');

          slide.innerHTML = `
              <img src="${post.media.url}" alt="${post.media.alt}">
              <h3>${post.title}</h3>
              <p>${post.body.slice(0, 100)}...</p>
          `;

          carouselContainer.appendChild(slide);
      });

      setupCarouselNavigation(); // Funksjonen som håndterer pilene og navigasjon

  } catch (error) {
      console.error('Failed to fetch carousel posts:', error);
  }
}

// Funksjon for å sette opp navigasjonen for karusellen
function setupCarouselNavigation() {
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentSlide = 0;

  function updateCarousel() {
      const slideWidth = slides[0].clientWidth;
      const carouselContainer = document.querySelector('.carousel-container');
      carouselContainer.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  }

  nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateCarousel();
  });

  // Håndtere vindu-resize for å oppdatere visningen
  window.addEventListener('resize', updateCarousel);

  updateCarousel(); // Initial kall for å sette opp første slide
}

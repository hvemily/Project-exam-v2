
// Funksjon for å hente blogginnleggene og oppdatere karusellen
export async function updateCarousel() {
    document.addEventListener('DOMContentLoaded', async () => {
        const carouselContainer = document.getElementById('carousel-container');
        if (!carouselContainer) {
            console.error('carousel-container element not found');
            return;
        }

        try {
            const response = await fetch('https://v2.api.noroff.dev/blog/posts/emilyadmin');
            const data = await response.json();

            // first three posts for carousel
            const firstThreePosts = data.data.slice(0, 3);

            // remove existing posts
            carouselContainer.innerHTML = '';

            // generate html for the posts
            firstThreePosts.forEach(post => {
                const slide = document.createElement('div');
                slide.classList.add('carousel-slide');
                slide.innerHTML = `
                        <a href="/Project-exam-v2/post.html?id=${post.id}" class="carousel-link">
                        <img src="${post.media.url}" alt="${post.media.alt}">
                        <h3>${post.title}</h3>
                        <p>${post.body.slice(0, 100)}...</p>
                    </a>
                `;
                carouselContainer.appendChild(slide);
            });

            setupCarouselNavigation(); 
            // function to handle the carousel navigation
        } catch (error) {
            console.error('Failed to fetch carousel posts:', error);
        }
    });
}

  // arrow navigation
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

    // update the viewing with change of windowsize
    window.addEventListener('resize', updateCarousel);

    updateCarousel(); // initializing call
    }

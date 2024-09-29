//carousel 
export async function updateCarousel() {
    document.addEventListener('DOMContentLoaded', async () => {
        const carouselContainer = document.getElementById('carousel-container');
        if (!carouselContainer) return;

        try {
            const response = await fetch('https://v2.api.noroff.dev/blog/posts/emilyadmin');
            const data = await response.json();
            const firstThreePosts = data.data.slice(0, 3);

            carouselContainer.innerHTML = '';

            firstThreePosts.forEach(post => {
                const slide = document.createElement('div');
                slide.classList.add('carousel-slide');
                slide.innerHTML = `
                    <a href="/Project-exam-v2/post.html?id=${post.id}" class="carousel-link">
                        <img src="${post.media.url}" alt="${post.media.alt}">
                        <h3>${post.title}</h3>
                    </a>
                `;
                carouselContainer.appendChild(slide);
            });

            setupCarouselNavigation();
        } catch (error) {
            showModal('Failed to load carousel posts');
        }
    });
}


//navigation w/next and previous//
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

    window.addEventListener('resize', updateCarousel);
    updateCarousel();
}

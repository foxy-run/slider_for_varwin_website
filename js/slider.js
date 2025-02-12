const slider = document.querySelector('.slider_slider');
const slides = Array.from(slider.children);
const dotsContainer = document.querySelector('.slider_dots');
const prevButton = document.querySelector('.slider_arrow-left');
const nextButton = document.querySelector('.slider_arrow-right');

let currentIndex = 0;
const slidesCount = slides.length;
// Рассчитываем количество видимых слайдов
function getVisibleSlides() {
    if (window.innerWidth <= 600) return 1; // Мобильные устройства
    if (window.innerWidth <= 1024) return 2; // Планшеты
    return 3; // Десктоп
}

// Переход к слайду с вычислением смещения в пикселях
function goToSlide(index) {
    const visibleSlides = getVisibleSlides();
    const gap = 25; // Значение gap в пикселях (должно совпадать с CSS)
    // Получаем ширину контейнера слайдера (родительского элемента)
    const containerWidth = slider.parentElement.clientWidth;
    // Вычисляем фактическую ширину одного слайда с учетом gap
    const slideWidth = (containerWidth - gap * (visibleSlides - 1)) / visibleSlides;
    // Эффективная ширина шага – ширина слайда + gap
    const effectiveSlideWidth = slideWidth + gap;
    const maxIndex = slidesCount - visibleSlides;

    if (index < 0) index = 0;
    if (index > maxIndex) index = maxIndex;

    currentIndex = index;
    const translateX = currentIndex * effectiveSlideWidth;
    slider.style.transform = `translateX(-${translateX}px)`;
    updateDots();
    updateArrows();
}

// Обновление точек
function updateDots() {
    const dots = Array.from(dotsContainer.children);
    if (!dots.length) return;
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
    });
}

// Обновление стрелок
function updateArrows() {
    const visibleSlides = getVisibleSlides();
    const maxIndex = slidesCount - visibleSlides;
    prevButton.classList.toggle('active', currentIndex > 0);
    nextButton.classList.toggle('active', currentIndex < maxIndex);
}

// Создание точек
function createDots() {
    dotsContainer.innerHTML = '';
    const totalDots = slidesCount - getVisibleSlides() + 1;
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider_dot');
        dot.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <circle cx="5.5" cy="5.5" r="4" stroke="#7749F8" stroke-width="2"/>
                </svg>`;
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

// События для стрелок
prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));

// Обработка свайпов
let startX = null;
let startY = null;
document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});
document.addEventListener('touchmove', (e) => {
    if (!startX || !startY) return;
    const diffX = startX - e.touches[0].clientX;
    const diffY = startY - e.touches[0].clientY;
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(currentIndex - 1);
        }
    }
    startX = null;
    startY = null;
});

// Адаптация при изменении размера окна
window.addEventListener('resize', () => {
    createDots();
    goToSlide(currentIndex);
});

// Инициализация
createDots();
goToSlide(0);

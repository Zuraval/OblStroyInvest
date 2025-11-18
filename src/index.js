import './styles/main.scss';

import Swiper from 'swiper';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


document.addEventListener('DOMContentLoaded', () => {
  const burgerIcon = document.querySelector('.burger-icon');
  const button = document.querySelector('.burger-menu');

  button.addEventListener('click', () => {
    burgerIcon.classList.toggle('burger-icon--open');
    burgerIcon.classList.toggle('burger-icon--closed');
  });
});

class ProjectStagesSlider {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.slides = JSON.parse(this.container.dataset.slides);
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;

    this.titleEl = this.container.querySelector('.project-stages-slider__stage-title');
    this.descEl = this.container.querySelector('.project-stages-slider__description');
    this.currentImgEl = this.container.querySelector('.project-stages-slider__image-current img');
    this.prevImgEl = this.container.querySelector('.project-stages-slider__image-prev img');
    this.nextImgEl = this.container.querySelector('.project-stages-slider__image-next img');
    this.numberEl = this.container.querySelector('.project-stages-slider__number');
    this.dots = Array.from(this.container.querySelectorAll('.project-stages-slider__dot'));
    this.prevBtn = this.container.querySelector('.project-stages-slider__btn--prev');
    this.nextBtn = this.container.querySelector('.project-stages-slider__btn--next');

    this.isAnimating = false;

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateSlide();
  }

  bindEvents() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    this.prevBtn.addEventListener('click', () => this.goToPrev());
    this.nextBtn.addEventListener('click', () => this.goToNext());
  }

  goToSlide(index) {
    if (index < 0 || index >= this.totalSlides || this.isAnimating) return;

    this.isAnimating = true;
    this.currentIndex = index;
    this.updateSlide();
    this.updatePagination();
  }

  goToPrev() {
    if (this.isAnimating) return;
    const newIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.goToSlide(newIndex);
  }

  goToNext() {
    if (this.isAnimating) return;
    const newIndex = (this.currentIndex + 1) % this.totalSlides;
    this.goToSlide(newIndex);
  }

  updateSlide() {
    const current = this.slides[this.currentIndex];
    const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    const nextIndex = (this.currentIndex + 1) % this.totalSlides;

    this.titleEl.classList.add('project-stages-slider__fade-out');
    this.descEl.classList.add('project-stages-slider__fade-out');
    this.numberEl.classList.add('project-stages-slider__fade-out');

    setTimeout(() => {
      this.currentImgEl.src = current.image;
      this.prevImgEl.src = this.slides[prevIndex].image;
      this.nextImgEl.src = this.slides[nextIndex].image;

      this.titleEl.textContent = current.title;
      this.descEl.textContent = current.description;
      this.numberEl.textContent = current.number;

      this.titleEl.classList.remove('project-stages-slider__fade-out');
      this.titleEl.classList.add('project-stages-slider__fade-in');

      this.descEl.classList.remove('project-stages-slider__fade-out');
      this.descEl.classList.add('project-stages-slider__fade-in');

      this.numberEl.classList.remove('project-stages-slider__fade-out');
      this.numberEl.classList.add('project-stages-slider__fade-in');

      setTimeout(() => {
        this.titleEl.classList.remove('project-stages-slider__fade-in');
        this.descEl.classList.remove('project-stages-slider__fade-in');
        this.numberEl.classList.remove('project-stages-slider__fade-in');
        this.isAnimating = false;
      }, 300);
    }, 150);
  }

  updatePagination() {
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === this.currentIndex);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ProjectStagesSlider('.project-stages-slider');
});

document.addEventListener('DOMContentLoaded', function () {
  const innerSliders = [];
  document.querySelectorAll('.inner-slider').forEach((sliderEl, index) => {
    const innerSwiper = new Swiper(sliderEl, {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: false,
      pagination: {
        el: sliderEl.querySelector('.inner-pagination'),
        clickable: true,
      },
    });
    innerSliders.push(innerSwiper);
  });

  const mainSwiper = new Swiper('.main-slider', {
    slidesPerView: 4,
    spaceBetween: 20,
    loop: false,
    pagination: {
      el: '.main-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.main-button-next',
      prevEl: '.main-button-prev',
    },
  });
});
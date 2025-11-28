import './styles/main.scss';

import Swiper from 'swiper';
import { Pagination, Navigation, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


document.addEventListener('DOMContentLoaded', () => {
  const burgerIcon = document.querySelector('.burger-icon');
  const button = document.querySelector('.burger-menu');
  const menuPanel = document.querySelector('.burger-menu-panel');

  function toggleMenu() {
    burgerIcon.classList.toggle('burger-icon--open');
    burgerIcon.classList.toggle('burger-icon--closed');
    menuPanel.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  }

  button.addEventListener('click', toggleMenu);

  const closeBtn = menuPanel.querySelector('.menu-header__close');
  if (closeBtn) {
    closeBtn.addEventListener('click', toggleMenu);
  }

  const submenuToggle = menuPanel.querySelector('.menu-item__arrow[data-toggle="submenu"]');
  if (submenuToggle) {
    submenuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const item = this.closest('.menu-item');
      const sublist = item.querySelector('.menu-sublist');
      const arrow = this;

      sublist.classList.toggle('active');
      arrow.classList.toggle('rotated');
    });
  }

  const menuItems = menuPanel.querySelectorAll('.menu-item a');
  menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      toggleMenu();
    });
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
      this.numberEl.textContent = current.number;

      this.descEl.innerHTML = '';

      if (Array.isArray(current.description)) {
        current.description.forEach(line => {
          const lineElement = document.createElement('div');
          lineElement.className = 'description-line';
          lineElement.textContent = line.trim();
          this.descEl.appendChild(lineElement);
        });
      } else {
        console.warn('Описание слайда не является массивом:', current.description);
      }

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
      modules: [Pagination, Navigation],
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

  window.mainSwiper = new Swiper('.main-slider', {
    modules: [Pagination, Navigation],
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
    breakpoints: {
      320: {
        slidesPerView: 1.2,
        spaceBetween: 15
      },
      768: {
        slidesPerView: 4
      }
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  let zoomSwiper = null;

  function openZoomModal(images, startIndex = 0) {
    const modalOverlay = document.querySelector('.modal-overlay');
    const swiperWrapper = document.querySelector('.zoom-slider .swiper-wrapper');
    const zoomSlider = document.querySelector('.zoom-slider');

    swiperWrapper.innerHTML = '';

    images.forEach(imgSrc => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = 'Zoomed image';
      img.style.cursor = 'grab';
      slide.appendChild(img);
      swiperWrapper.appendChild(slide);
    });

    modalOverlay.classList.add('active');

    if (!zoomSwiper) {
      zoomSwiper = new Swiper(zoomSlider, {
        modules: [Pagination, Navigation, Zoom],
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        zoom: true,
        navigation: {
          nextEl: '.zoom-next',
          prevEl: '.zoom-prev',
        },
        on: {
          init: function () {
            this.slideTo(startIndex);
          }
        }
      });
    } else {
      zoomSwiper.destroy(true, true);
      zoomSwiper = new Swiper(zoomSlider, {
        modules: [Pagination, Navigation, Zoom],
        slidesPerView: 1,
        spaceBetween: 0,
        loop: false,
        zoom: true,
        pagination: {
          el: '.zoom-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.zoom-next',
          prevEl: '.zoom-prev',
        },
        on: {
          init: function () {
            this.slideTo(startIndex);
          }
        }
      });
    }

    document.querySelector('.modal-close-button').addEventListener('click', closeZoomModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeZoomModal();
      }
    });
  }

  function closeZoomModal() {
    const modalOverlay = document.querySelector('.modal-overlay');
    modalOverlay.classList.remove('active');
    if (zoomSwiper) {
      zoomSwiper.destroy(true, true);
      zoomSwiper = null;
    }
  }

  document.querySelectorAll('.inner-slide img').forEach((img, index) => {
    img.addEventListener('click', function () {
      const innerSlider = img.closest('.inner-slider');
      const allImages = Array.from(innerSlider.querySelectorAll('img')).map(img => img.src);

      const currentIndex = allImages.indexOf(img.src);

      openZoomModal(allImages, currentIndex);
    });
  });
});

let newsSwiper = null;

function initNewsSlider() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  
  const newsList = document.querySelector('.news__list');
  
  if (!newsList) {
    return;
  }

  if (isMobile) {
    if (!newsSwiper) {
      newsSwiper = new Swiper('.news__list', {
        modules: [Pagination, Navigation],
        slidesPerView: 1,
        spaceBetween: 20,
        loop: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next.main-button-next',
          prevEl: '.swiper-button-prev.main-button-prev',
        },
        breakpoints: {
          320: {
            slidesPerView: 1.2,
            spaceBetween: 15
          }
        }
      });
    }
  } else {
    if (newsSwiper) {
      newsSwiper.destroy(true, true);
      newsSwiper = null;
    }
  }
}

document.addEventListener('DOMContentLoaded', initNewsSlider);

const mediaQuery = window.matchMedia('(max-width: 768px)');
mediaQuery.addListener(initNewsSlider);

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(initNewsSlider, 100);
});

let projectsSwiper = null;

function initProjectsSlider() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const projectsMenu = document.querySelector('.projects__menu');

  if (!projectsMenu) return;

  if (projectsSwiper) {
    projectsSwiper.destroy(true, true);
    projectsSwiper = null;
  }

  if (isMobile) {
    projectsSwiper = new Swiper('.projects__menu', {
      modules: [Pagination, Navigation],
      slidesPerView: 1.2,
      spaceBetween: 30,
      loop: false,
      pagination: {
        el: '.swiper-pagination.main-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next.main-button-next',
        prevEl: '.swiper-button-prev.main-button-prev',
      },
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initProjectsSlider();
});

const projectsMediaQuery = window.matchMedia('(max-width: 768px)');
if (projectsMediaQuery.addEventListener) {
  projectsMediaQuery.addEventListener('change', initProjectsSlider);
} else {
  projectsMediaQuery.addListener(initProjectsSlider);
}

let projectsResizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(projectsResizeTimeout);
  projectsResizeTimeout = setTimeout(initProjectsSlider, 100);
});

document.addEventListener('DOMContentLoaded', () => {
  const showMoreContainer = document.querySelector('.js-show-more');
  const hiddenItems = document.querySelector('.projects__hidden-items');

  if (!showMoreContainer || !hiddenItems) return;

  const button = showMoreContainer.querySelector('button');
  if (!button) return;

  const showAllProjects = () => {
    hiddenItems.style.display = 'flex';
    showMoreContainer.style.display = 'none';
  };

  button.addEventListener('click', (e) => {
    showAllProjects();
  });

  const updateVisibility = () => {
    if (window.innerWidth >= 768) {
      hiddenItems.style.display = 'block';
      showMoreContainer.style.display = 'none';
    } else {
      hiddenItems.style.display = 'none';
      showMoreContainer.style.display = hiddenItems.children.length > 0 ? 'block' : 'none';
    }
  };

  updateVisibility();

  window.addEventListener('resize', updateVisibility);
});

document.addEventListener('DOMContentLoaded', () => {
  const showMoreContainer = document.querySelector('.js-show-more');
  const hiddenItemsContainer = document.querySelector('.news-page__hidden-items');

  if (!showMoreContainer || !hiddenItemsContainer) return;

  const button = showMoreContainer.querySelector('button');
  if (!button) return;

  const updateVisibility = () => {
    if (window.innerWidth >= 768) {
      hiddenItemsContainer.style.display = 'block';
      showMoreContainer.style.display = 'none';
    } else {
      hiddenItemsContainer.style.display = 'none';
      showMoreContainer.style.display = hiddenItemsContainer.children.length > 0 ? 'block' : 'none';
    }
  };

  const showAllNews = () => {
    hiddenItemsContainer.style.display = 'block';
    showMoreContainer.style.display = 'none';
  };

  button.addEventListener('click', showAllNews);

  updateVisibility();
  window.addEventListener('resize', updateVisibility);
});

document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.service-list__item');

  items.forEach(item => {
    const title = item.querySelector('.service-list__title');
    const roster = item.querySelector('.service-list__roster');

    const isCollapsed = roster.classList.contains('is-collapsed');
    item.classList.toggle('is-expanded', !isCollapsed);
    title.setAttribute('aria-expanded', String(!isCollapsed));

    title.addEventListener('click', () => {
      const isExpanded = roster.classList.contains('is-collapsed') === false;

      if (isExpanded) {
        roster.classList.add('is-collapsed');
        item.classList.remove('is-expanded');
        title.setAttribute('aria-expanded', 'false');
      } else {
        roster.classList.remove('is-collapsed');
        item.classList.add('is-expanded');
        title.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
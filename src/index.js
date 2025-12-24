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
    this.descWrapper = this.container.querySelector('.project-stages-slider__description-wrapper');
    this.descEl = this.container.querySelector('.project-stages-slider__description');
    this.currentImgEl = this.container.querySelector('.project-stages-slider__image-current img');
    this.prevImgEl = this.container.querySelector('.project-stages-slider__image-prev img');
    this.nextImgEl = this.container.querySelector('.project-stages-slider__image-next img');
    this.numberEl = this.container.querySelector('.project-stages-slider__number');
    this.dots = Array.from(this.container.querySelectorAll('.project-stages-slider__dot'));
    this.prevBtn = this.container.querySelector('.project-stages-slider__btn--prev');
    this.nextBtn = this.container.querySelector('.project-stages-slider__btn--next');

    this.isAnimating = false;
    this.isMobile = window.innerWidth < 768;

    this.slides.forEach(slide => {
      const img = new Image();
      img.src = slide.image;
    });

    this.init();
    this.bindResize();
  }

  bindResize() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.isMobile = window.innerWidth < 768;
        if (this.isMobile) {
          this.updateDescriptionHeight();
        }
      }, 150);
    });
  }

  init() {
    this.bindEvents();
    this.updateSlide();
    if (this.isMobile) {
      this.descWrapper.style.height = this.descEl.scrollHeight + 'px';
    }
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
    this.goToSlide((this.currentIndex - 1 + this.totalSlides) % this.totalSlides);
  }

  goToNext() {
    if (this.isAnimating) return;
    this.goToSlide((this.currentIndex + 1) % this.totalSlides);
  }

  updateDescription(newLines) {
    if (!Array.isArray(newLines)) newLines = [];

    const existingLines = Array.from(this.descEl.children);
    const maxLen = Math.max(existingLines.length, newLines.length);

    for (let i = 0; i < maxLen; i++) {
      if (i < newLines.length) {
        let el = existingLines[i];
        if (!el) {
          el = document.createElement('div');
          el.className = 'description-line';
          this.descEl.appendChild(el);
        }
        el.textContent = newLines[i].trim();
        el.style.visibility = 'visible';
        el.style.position = 'static';
      } else if (existingLines[i]) {
        existingLines[i].style.visibility = 'hidden';
        existingLines[i].style.position = 'absolute';
        existingLines[i].style.top = '-9999px';
      }
    }
  }

  updateDescriptionHeight() {
    if (!this.isMobile) return;

    this.descWrapper.style.height = 'auto';
    const newHeight = this.descEl.scrollHeight;
    this.descWrapper.style.height = newHeight + 'px';
  }

  updateSlide() {
    const current = this.slides[this.currentIndex];
    const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    const nextIndex = (this.currentIndex + 1) % this.totalSlides;

    if (this.isMobile) {
      this.descWrapper.style.height = this.descEl.scrollHeight + 'px';
    }

    this.titleEl.style.opacity = '0';
    this.descEl.style.opacity = '0';
    this.numberEl.style.opacity = '0';

    setTimeout(() => {
      this.currentImgEl.src = current.image;
      this.prevImgEl.src = this.slides[prevIndex].image;
      this.nextImgEl.src = this.slides[nextIndex].image;

      this.titleEl.textContent = current.title;
      this.numberEl.textContent = current.number;
      this.updateDescription(current.description);

      if (this.isMobile) {
        setTimeout(() => {
          this.updateDescriptionHeight();
        }, 10);
      }

      this.titleEl.style.opacity = '1';
      this.descEl.style.opacity = '1';
      this.numberEl.style.opacity = '1';

      this.isAnimating = false;
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

/*------photo-gallery-slider-----*/

document.addEventListener('DOMContentLoaded', function () {
  const mainSwiper = new Swiper('.photo-gallery', {
    modules: [Pagination, Navigation],
    slidesPerView: 'auto',
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    loop: false,
    grabCursor: true,
    breakpoints: {
      768: {
        slidesPerView: 3.1,
        spaceBetween: 20,
      },
      320: {
        slidesPerView: 1.15,
        spaceBetween: 12,
      },
    },
  });

  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    return;
  }

  const lightboxOverlay = document.querySelector('.lightbox-overlay');
  const lightboxClose = document.querySelector('.lightbox-close');

  lightboxClose.addEventListener('click', () => {
    lightboxOverlay.style.display = 'none';
    document.body.style.overflow = '';
  });

  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) {
      lightboxOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  const gallerySlides = document.querySelectorAll('.photo-gallery .swiper-slide');

  const thumbSwiper = new Swiper('.thumb-swiper', {
    modules: [Pagination, Navigation],
    slidesPerView: 'auto',
    spaceBetween: 0,
    freeMode: true,
    watchSlidesProgress: true,
    slideToClickedSlide: true,
    clickable: true,
    on: {
      click: function (swiper, e) {
        const slide = e.target.closest('.swiper-slide');
        if (slide) {
          const index = parseInt(slide.dataset.index);
          if (!isNaN(index)) {
            lightboxSwiper.slideTo(index);
          }
        }
      },
    },
  });

  const lightboxSwiper = new Swiper('.lightbox-swiper', {
    modules: [Pagination, Navigation],
    effect: 'fade',
    loop: false,
    navigation: {
      nextEl: '.main-button-next',
      prevEl: '.main-button-prev',
    },
    thumbs: {
      swiper: thumbSwiper,
    },
    on: {
      slideChange: function () {
        setTimeout(() => {
          thumbSwiper.slideTo(this.activeIndex);
        }, 10);

        const slides = Array.from(document.querySelectorAll('.thumb-swiper .swiper-slide'));
        slides.forEach((slide, i) => {
          if (i === this.activeIndex) {
            slide.classList.add('swiper-slide-thumb-active');
          } else {
            slide.classList.remove('swiper-slide-thumb-active');
          }
        });
      },
    },
  });

  gallerySlides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
      lightboxOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      lightboxSwiper.slideTo(index, 0);
    });
  });

  document.querySelectorAll('.swiper-button-prev, .swiper-button-next').forEach(btn => {
    btn.addEventListener('mousedown', e => e.preventDefault());
  });
});

/*----video-poster------*/

const videos = document.querySelectorAll('.specific-project__video__video');
videos.forEach(video => {
  video.addEventListener('play', () => {
    const poster = video.parentNode.querySelector('.video-poster');
    if (poster) poster.style.display = 'none';
  });
  video.addEventListener('pause', () => {
    const poster = video.parentNode.querySelector('.video-poster');
    if (poster) poster.style.display = 'block';
  });
});

/*----technical-customer-slider----*/

const technicalCustomerSwiper = new Swiper('.technical-customer-swiper', {
  modules: [Pagination, Navigation],
  slidesPerView: 'auto',
  centeredSlides: true,
  spaceBetween: 0,
  loop: true,
  watchSlidesProgress: true,
  pagination: {
    el: '.main-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.main-button-next',
    prevEl: '.main-button-prev',
  },
});

/*-----about-slider----*/

document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.about-slider', {
    modules: [Pagination, Navigation],
    slidesPerView: 4.2,
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1.3,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 4.2,
        spaceBetween: 20,
      },
    }
  });
});

/*------hero-bg-script-----*/

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const bgElements = hero.querySelectorAll('.hero__bg');
  const buttons = hero.querySelectorAll('.hero__location-btn');
  const total = bgElements.length;
  if (total === 0) return;

  const deskTitles = hero.querySelectorAll('.hero__location-title--desk');
  const deskCaptions = hero.querySelectorAll('.hero__location-caption--desk');
  const mobiTitles = hero.querySelectorAll('.hero__location-title--mobi');

  let currentIndex = 0;
  let autoSwitch = null;

  function showBg(index) {
    bgElements.forEach((el, i) => {
      el.classList.toggle('hero__bg--active', i === index);
    });

    hero.setAttribute('data-bg-index', index);
    currentIndex = index;

    buttons.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });

    deskTitles.forEach((el, i) => {
      el.classList.toggle('hero__location-title--active', i === index);
    });
    deskCaptions.forEach((el, i) => {
      el.classList.toggle('hero__location-caption--active', i === index);
    });

    mobiTitles.forEach((el, i) => {
      el.classList.toggle('hero__location-title--active', i === index);
    });
  }

  function startAutoSwitch() {
    if (autoSwitch) clearInterval(autoSwitch);
    autoSwitch = setInterval(() => {
      currentIndex = (currentIndex + 1) % total;
      showBg(currentIndex);
    }, 5000);
  }

  function stopAndRestartAutoSwitch() {
    if (autoSwitch) clearInterval(autoSwitch);
    setTimeout(startAutoSwitch, 10000);
  }

  showBg(0);
  startAutoSwitch();

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const newIdx = parseInt(btn.getAttribute('data-bg-index'), 10);
      if (!isNaN(newIdx) && newIdx >= 0 && newIdx < total) {
        showBg(newIdx);
        stopAndRestartAutoSwitch();
      }
    });
  });
});


/*-------detail-news-slider-image---------*/

document.addEventListener('DOMContentLoaded', function () {
  const mainSwiper = new Swiper('.detail-news__image-slider__slider', {
    modules: [Pagination, Navigation],
    slidesPerView: 'auto',
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    loop: false,
    grabCursor: true,
    breakpoints: {
      768: {
        slidesPerView: 3.2,
        spaceBetween: 20,
      },
      320: {
        slidesPerView: 1.15,
        spaceBetween: 12,
      },
    },
  });
});


/*----detail-news-another-news------*/

document.addEventListener('DOMContentLoaded', function () {
  const sliderEl = document.querySelector('.news__list.swiper');
  if (!sliderEl) return;

  const mode = sliderEl.dataset.sliderMode;
  if (mode !== 'all' && mode !== 'mobile-only') return;

  const isMobile = window.innerWidth < 768;
  const shouldInit = mode === 'all' || (mode === 'mobile-only' && isMobile);

  if (shouldInit) {
    if (sliderEl.swiperInstance) {
      sliderEl.swiperInstance.destroy(true, true);
    }

    const swiper = new Swiper(sliderEl, {
      modules: [Pagination, Navigation],
      slidesPerView: 1,
      spaceBetween: 15,
      loop: false,
      pagination: {
        el: '.swiper-pagination.main-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next.main-button-next',
        prevEl: '.swiper-button-prev.main-button-prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
      },
    });

    sliderEl.swiperInstance = swiper;
  }
});

/*------input-vacancy--------*/

document.addEventListener('DOMContentLoaded', function () {
  const fileInput = document.getElementById('resume-upload');
  if (!fileInput) return;

  const trigger = document.querySelector('.career__vacancy__form__button-file__trigger');
  const preview = document.querySelector('.career__vacancy__form__file-preview');
  const fileName = document.querySelector('.career__vacancy__form__file-name');
  const fileIcon = document.querySelector('.career__vacancy__form__file-icon');
  const removeBtn = document.querySelector('.career__vacancy__form__file-remove');

  const icons = {
    pdf: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2V8H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 13H10" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M16 17H10" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M13 9H11" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
    doc: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2V8H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 13H15" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M9 17H13" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
    docx: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2V8H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 13H15" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M9 17H13" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
    txt: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2V8H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 13H15" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M9 17H15" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
    default: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2V8H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };

  function getIcon(ext) {
    ext = ext.toLowerCase();
    if (ext === 'doc' || ext === 'docx') return icons.docx;
    return icons[ext] || icons.default;
  }

  fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const name = file.name;
    const ext = name.split('.').pop() || '';
    fileName.textContent = name;
    fileIcon.innerHTML = getIcon(ext);
    trigger.style.display = 'none';
    preview.classList.remove('hidden');
  });

  if (removeBtn) {
    removeBtn.addEventListener('click', function () {
      fileInput.value = '';
      trigger.style.display = '';
      preview.classList.add('hidden');
    });
  }
});

/*-------career-vacancy---------*/

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.career__vacancy__list')) return;

  document.querySelectorAll('.service-group__header').forEach(header => {
    const group = header.closest('.service-group');
    if (!group) return;

    header.addEventListener('click', () => {
      group.classList.toggle('is-collapsed');
      header.setAttribute('aria-expanded', String(!group.classList.contains('is-collapsed')));
    });
  });

  document.querySelectorAll('.service-group').forEach(group => {
    const header = group.querySelector('.service-group__header');
    const roster = group.querySelector('.service-list__roster');
    if (!header || !roster) return;

    const isCollapsed = roster.classList.contains('is-collapsed');

    header.addEventListener('click', (e) => {
      roster.classList.toggle('is-collapsed');
    });
  });
});

/*--------------cookie--------------*/

document.addEventListener('DOMContentLoaded', () => {
  const cookieBanner = document.querySelector('.cookie');
  const cookieBannerSetings = document.querySelector('.cookie__setings');
  const cookieBannerContainer = document.querySelector('.cookie__container');

  if (localStorage.getItem('cookiesAccepted') === 'true') {
    if (cookieBanner) cookieBanner.style.display = 'none';
    return;
  }

  const acceptButton = document.querySelector('.accept-all');
  if (acceptButton && cookieBanner) {
    acceptButton.addEventListener('click', () => {
      cookieBanner.style.display = 'none';
      localStorage.setItem('cookiesAccepted', 'true');
    });
  }

  const confirmButton = document.querySelector('.confirm');
  if (confirmButton && cookieBanner) {
    confirmButton.addEventListener('click', () => {
      cookieBanner.style.display = 'none';
      localStorage.setItem('cookiesAccepted', 'true');
    });
  }

  const setingsButton = document.querySelector('.setings-cookie');
  setingsButton.addEventListener('click', () => {
    cookieBannerContainer.style.display = 'none';
    cookieBannerSetings.style.display = 'flex'
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const toggleInputs = document.querySelectorAll('.toggle-input');

  toggleInputs.forEach(input => {
    const serviceItem = input.closest('.service-list');
    if (!serviceItem) return;

    const statusSpan = serviceItem.querySelector('.category-status');
    if (!statusSpan) return;

    updateStatus(input, statusSpan);

    input.addEventListener('change', () => {
      updateStatus(input, statusSpan);
    });
  });

  function updateStatus(input, statusSpan) {
    if (input.checked) {
      statusSpan.textContent = 'Разрешено';
      statusSpan.style.color = 'var(--blue)';
    } else {
      statusSpan.textContent = 'Запрещено';
      statusSpan.style.color = 'var(--grey-text)';
    }
  }
});


document.addEventListener('DOMContentLoaded', function () {
  const langSwitch = document.querySelector('.lang-switch');

  if (!langSwitch) return;

  langSwitch.addEventListener('click', function (e) {
    e.preventDefault();

    const currentLang = this.getAttribute('data-lang');

    if (currentLang === 'en') {
      this.setAttribute('data-lang', 'ru');
      this.textContent = 'RU';
    } else {
      this.setAttribute('data-lang', 'en');
      this.textContent = 'EN';
    }

    localStorage.setItem('preferred-lang', this.getAttribute('data-lang'));
  });
});
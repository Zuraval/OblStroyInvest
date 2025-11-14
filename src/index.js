import './styles/main.scss';

import Swiper from 'swiper';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

document.addEventListener('DOMContentLoaded', function() {
  const swiper = new Swiper('.slide_around_slider .swiper', {
    slidesPerView: 3,
    centeredSlides: true,
    spaceBetween: -200,
    loop: true,
    speed: 500,
    initialSlide: 0,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.around_next',
      prevEl: '.around_prev',
    },
    modules: [Pagination, Navigation],
    grabCursor: true,
  });
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
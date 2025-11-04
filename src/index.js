import './styles/main.scss';

import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const swiperEl = document.querySelector('.swiper');
if (swiperEl) {
  new Swiper(swiperEl, {
    modules: [Pagination],
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
}
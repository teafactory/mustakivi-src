import Swiper from 'swiper';
import { Autoplay, EffectFade, Navigation, Pagination, Scrollbar } from 'swiper/modules';

function Slider({ selector = '.swiper', options = null }) {
  let elements = [];

  // セレクタの型に応じて処理分岐
  if (typeof selector === 'string') {
    elements = Array.from(document.querySelectorAll(selector));
  } else if (selector instanceof Element) {
    elements = [selector];
  } else if (
    selector instanceof NodeList ||
    selector instanceof HTMLCollection
  ) {
    elements = Array.from(selector);
  } else if (Array.isArray(selector)) {
    elements = selector.filter(el => el instanceof Element);
  }

  if (elements.length === 0) return;

  // 複数のSwiperインスタンスを返す
  return elements.map((elem, i) => {
    const elemID = elem.id || `swiper-${i + 1}`;
    elem.setAttribute('id', elemID);
    
    const getValue = (name, fallback = null) => {
      const value = elem.getAttribute(`data-swiper-${name}`);
      return value !== null ? value : fallback;
    };

    const thumbnails = getValue('thumbnails');

    let swiperOptions = {};


    if (options) {
      swiperOptions = options;
    } else {

      const slidesPerView = getValue('slides-per-view', 1);
      const slidesPerViewMd = getValue('slides-per-view-md', slidesPerView);
      const slidesPerViewLg = getValue('slides-per-view-lg', slidesPerViewMd);
      const speed = parseInt(getValue('speed', 500), 10);
      const autoDelay = parseInt(getValue('auto-delay', 5000), 10);
      const loop = elem.hasAttribute('data-swiper-loop');
      const auto = elem.hasAttribute('data-swiper-auto');
      const effect = getValue('effect', 'slide');
      const spaceBetween = parseInt(getValue('space-between', 10), 10);
      const spaceBetweenMd = parseInt(getValue('space-between-md', spaceBetween), 10);
      const spaceBetweenLg = parseInt(getValue('space-between-lg', spaceBetweenMd), 10);
      const direction = getValue('direction', 'horizontal');
      const scrollBar = elem.querySelector('.swiper-scrollbar') ?? null;
      const slideCount = elem.querySelectorAll('.swiper-slide').length;
      const prevButton = elem.closest('.slider')?.querySelector('.swiper-button-prev') ?? elem.querySelector('.swiper-button-prev') ?? null;
      const nextButton = elem.closest('.slider')?.querySelector('.swiper-button-next') ?? elem.querySelector('.swiper-button-next') ?? null;
      const pagination = elem.querySelector('.swiper-pagination') ?? null;
    // var swiper = new Swiper('.swiper', {
    //   slidesPerView: 2,
    //   // slidesPerGroup: 2,
    //   spaceBetween: 14,
    //   allowTouchMove: slideCount > 2,
    //   scrollbar: {
    //     el: '.related-products-section .swiper-scrollbar',
    //     draggable: true,
    //   },
    //   // navigation: {
    //   //   nextEl: nextButton,
    //   //   prevEl: prevButton
    //   // },
    //   breakpoints: {
    //     600: {
    //       slidesPerView: 3,
    //       slidesPerGroup: 3,
    //       spaceBetween: 20,
    //       allowTouchMove: slideCount > 3,
    //     },
    //     900: {
    //       slidesPerView: 4,
    //       slidesPerGroup: 4,
    //       spaceBetween: 32,
    //       allowTouchMove: slideCount > 4,
    //     },
    //   }
    // });

      swiperOptions = {
        speed: speed,
        slidesPerView: slidesPerView,
        spaceBetween: spaceBetween,
        loop: loop,
        navigation: {
          nextEl: nextButton,
          prevEl: prevButton,
        },
        preventClicks: false,
        preventClicksPropagation: false,
        breakpoints: {
          600: {
            slidesPerView: slidesPerViewMd,
            spaceBetween: spaceBetweenMd,
          },
          900: {
            slidesPerView: slidesPerViewLg,
            spaceBetween: spaceBetweenLg,
          },
        },
        modules: [Navigation, Pagination, Scrollbar, Autoplay, EffectFade],
      };

      if(scrollBar) {
        swiperOptions.scrollbar = {
          el: scrollBar,
          draggable: true,
        };
      }

      if(pagination) {
        swiperOptions.pagination = {
          el: pagination,
          clickable: true,
        };
      }

      if (auto) {
        swiperOptions.autoplay = {
          delay: autoDelay,
          disableOnInteraction: true,
        };
      }
      if( effect === 'fade' ) {
        swiperOptions.effect = 'fade';
        swiperOptions.fadeEffect = {
          crossFade: true,
        };
      }
      if (direction === 'vertical') {
        swiperOptions.direction = 'vertical';
      }
    }

    if (elem.querySelectorAll('.swiper-slide').length > 1) {
      const swiper = new Swiper(`#${elemID}`, swiperOptions);

      if (thumbnails) {
        const thumbnailRoot = document.querySelector(thumbnails);

        if (thumbnailRoot) {
          thumbnailRoot.querySelectorAll('.swiper-tn-button').forEach((button) => {
            button.addEventListener('click', (event) => {
              const targetItem = event.currentTarget.parentElement;
              const parentItems = targetItem.parentElement ? Array.from(targetItem.parentElement.children) : [];
              const index = parentItems.indexOf(targetItem);
              swiper.slideTo(index);
            });
          });
        }
      }

      return swiper;
    }

    return null;
  });
}


export default Slider;
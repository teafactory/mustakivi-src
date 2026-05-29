import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/unveilhooks/ls.unveilhooks';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes/plugins/rias/ls.rias';
import Lazyload from 'lazyload';
import $ from 'jquery';
import Axios from "axios"
import 'jquery.easing/jquery.easing';
import Cookies from 'js-cookie';
import PerfectScrollbar from 'perfect-scrollbar';
import initNotificationsPopup from './modules/notifications-popup';
import instagramFeed from './modules/instagram-feed';
import { lockBG, validateEmail } from './utils/functions.js';
import Slider from './components/slider';
// import ZoomOnHover from "vue-zoom-on-hover";
// Vue.use(ZoomOnHover);

// new Vue({
//   el: "#product__images"
// })

require('perfect-scrollbar/css/perfect-scrollbar.css');

// check if body has class 'tmpl--lottery'
if(!document.body.classList.contains('tmpl--lottery')){

  var t=[],YubinBango;!function(YubinBango){var n=function(){function n(t,n){if(void 0===t&&(t=""),this.URL="https://yubinbango.github.io/yubinbango-data/data",this.g=[null,"Hokkaidō","Aomori","Iwate","Miyagi","Akita","Yamagata","Fukushima","Ibaraki","Tochigi","Gunma","Saitama","Chiba","Tōkyō","Kanagawa","Niigata","Toyama","Ishikawa","Fukui","Yamanashi","Nagano","Gifu","Shizuoka","Aichi","Mie","Shiga","Kyōto","Ōsaka","Hyōgo","Nara","Wakayama","Tottori","Shimane","Okayama","Hiroshima","Yamaguchi","Tokushima","Kagawa","Ehime","Kōchi","Fukuoka","Saga","Nagasaki","Kumamoto","Ōita","Miyazaki","Kagoshima","Okinawa"],t){var e=t.replace(/[０-９]/g,function(t){return String.fromCharCode(t.charCodeAt(0)-65248)}),r=e.match(/\d/g),o=r.join(""),i=this.h(o);i?this.i(i,n):n(this.j())}}return n.prototype.h=function(t){if(7===t.length)return t},n.prototype.j=function(t,n,e,r,o){return void 0===t&&(t=""),void 0===n&&(n=""),void 0===e&&(e=""),void 0===r&&(r=""),void 0===o&&(o=""),{k:t,region:n,l:e,m:r,o:o}},n.prototype.p=function(t){return t&&t[0]&&t[1]?this.j(t[0],this.g[t[0]],t[1],t[2],t[3]):this.j()},n.prototype.q=function(t,n){window.$yubin=function(t){return n(t)};var e=document.createElement("script");e.setAttribute("type","text/javascript"),e.setAttribute("charset","UTF-8"),e.setAttribute("src",t),document.head.appendChild(e)},n.prototype.i=function(n,e){var r=this,o=n.substr(0,3);return o in t&&n in t[o]?e(this.p(t[o][n])):void this.q(this.URL+"/"+o+".js",function(i){return t[o]=i,e(r.p(i[n]))})},n}();YubinBango.Core=n}(YubinBango||(YubinBango={}));var n=["Japan","JP","JPN","JAPAN"],e=["p-region-id","p-region","p-locality","p-street-address","p-extended-address"],YubinBango;!function(YubinBango){var t=function(){function t(){this.s()}return t.prototype.s=function(){var n=this,e=document.querySelectorAll(".h-adr");[].map.call(e,function(e){if(n.t(e)){var r=e.querySelectorAll(".p-postal-code");r[r.length-1].addEventListener("keyup",function(e){t.prototype.u(n.v(e.target.parentNode))},!1)}})},t.prototype.v=function(t){return"FORM"===t.tagName||t.classList.contains("h-adr")?t:this.v(t.parentNode)},t.prototype.t=function(t){var e=t.querySelector(".p-country-name"),r=[e.innerHTML,e.value];return r.some(function(t){return n.indexOf(t)>=0})},t.prototype.u=function(t){var n=this,e=t.querySelectorAll(".p-postal-code");new YubinBango.Core(this.A(e),function(e){return n.B(t,e)})},t.prototype.A=function(t){return[].map.call(t,function(t){return t.value}).reduce(function(t,n){return t+n})},t.prototype.B=function(t,n){var r=[this.C,this.D];r.map(function(r){return e.map(function(e){return r(e,t,n)})})},t.prototype.C=function(t,n,e){if(e){var r=n.querySelectorAll("."+t);[].map.call(r,function(t){return t.value=""})}},t.prototype.D=function(t,n,e){var r={"p-region-id":e.k,"p-region":e.region,"p-locality":e.l,"p-street-address":e.m,"p-extended-address":e.o},o=n.querySelectorAll("."+t);[].map.call(o,function(n){return n.value+=r[t]?r[t]:""})},t}();YubinBango.MicroformatDom=t}(YubinBango||(YubinBango={})),document.addEventListener("DOMContentLoaded",function(){new YubinBango.MicroformatDom},!1);

}


let prefecturesAryStr = '[["Hokkaidō","Hokkaidō"],["Aomori","Aomori"],["Iwate","Iwate"],["Miyagi","Miyagi"],["Akita","Akita"],["Yamagata","Yamagata"],["Fukushima","Fukushima"],["Ibaraki","Ibaraki"],["Tochigi","Tochigi"],["Gunma","Gunma"],["Saitama","Saitama"],["Chiba","Chiba"],["Tōkyō","Tokyo"],["Kanagawa","Kanagawa"],["Niigata","Niigata"],["Toyama","Toyama"],["Ishikawa","Ishikawa"],["Fukui","Fukui"],["Yamanashi","Yamanashi"],["Nagano","Nagano"],["Gifu","Gifu"],["Shizuoka","Shizuoka"],["Aichi","Aichi"],["Mie","Mie"],["Shiga","Shiga"],["Kyōto","Kyōto"],["Ōsaka","Ōsaka"],["Hyōgo","Hyōgo"],["Nara","Nara"],["Wakayama","Wakayama"],["Tottori","Tottori"],["Shimane","Shimane"],["Okayama","Okayama"],["Hiroshima","Hiroshima"],["Yamaguchi","Yamaguchi"],["Tokushima","Tokushima"],["Kagawa","Kagawa"],["Ehime","Ehime"],["Kōchi","Kōchi"],["Fukuoka","Fukuoka"],["Saga","Saga"],["Nagasaki","Nagasaki"],["Kumamoto","Kumamoto"],["Ōita","Ōita"],["Miyazaki","Miyazaki"],["Kagoshima","Kagoshima"],["Okinawa","Okinawa"]]'; 
if(window.theme.locale == 'ja'){
prefecturesAryStr  = '[["Hokkaidō", "北海道"],["Aomori", "青森県"],["Iwate", "岩手県"],["Miyagi", "宮城県"],["Akita", "秋田県"],["Yamagata", "山形県"],["Fukushima", "福島県"],["Ibaraki", "茨城県"],["Tochigi", "栃木県"],["Gunma", "群馬県"],["Saitama", "埼玉県"],["Chiba", "千葉県"],["Tōkyō", "東京都"],["Kanagawa", "神奈川県"],["Niigata", "新潟県"],["Toyama", "富山県"],["Ishikawa", "石川県"],["Fukui", "福井県"],["Yamanashi", "山梨県"],["Nagano", "長野県"],["Gifu", "岐阜県"],["Shizuoka", "静岡県"],["Aichi", "愛知県"],["Mie", "三重県"],["Shiga", "滋賀県"],["Kyōto", "京都府"],["Ōsaka", "大阪府"],["Hyōgo", "兵庫県"],["Nara", "奈良県"],["Wakayama", "和歌山県"],["Tottori", "鳥取県"],["Shimane", "島根県"],["Okayama", "岡山県"],["Hiroshima", "広島県"],["Yamaguchi", "山口県"],["Tokushima", "徳島県"],["Kagawa", "香川県"],["Ehime", "愛媛県"],["Kōchi", "高知県"],["Fukuoka", "福岡県"],["Saga", "佐賀県"],["Nagasaki", "長崎県"],["Kumamoto", "熊本県"],["Ōita", "大分県"],["Miyazaki", "宮崎県"],["Kagoshima", "鹿児島県"],["Okinawa", "沖縄県"]]';
}

const $win = $(window);
let winHeight = 0;
window.theme = window.theme || {};

window.matchMedia || (window.matchMedia = function() {
  "use strict";

  // For browsers that support matchMedium api such as IE 9 and webkit
  var styleMedia = (window.styleMedia || window.media);

  // For those that don't support matchMedium
  if (!styleMedia) {
      var style       = document.createElement('style'),
          script      = document.getElementsByTagName('script')[0],
          info        = null;

      style.type  = 'text/css';
      style.id    = 'matchmediajs-test';

      if (!script) {
        document.head.appendChild(style);
      } else {
        script.parentNode.insertBefore(style, script);
      }

      // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
      info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

      styleMedia = {
          matchMedium: function(media) {
              var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

              // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
              if (style.styleSheet) {
                  style.styleSheet.cssText = text;
              } else {
                  style.textContent = text;
              }

              // Test if media query is true or false
              return info.width === '1px';
          }
      };
  }

  return function(media) {
      return {
          matches: styleMedia.matchMedium(media || 'all'),
          media: media || 'all'
      };
  };
}());


// theme.slideshow = ()=>{

//   new Swiper('.swiper', {
//     speed: 1000,
//     effect: 'fade',
//     fadeEffect: {
//       crossFade: true
//     },    
//     // autoplay: {
//     //   delay: 5000,
//     //   disableOnInteraction: false,
//     // },
//     pagination: {
//       el: '.swiper-pagination',
//       clickable: true,
//     },
//     plugins: [Autoplay, Pagination, EffectFade]
//   });
// }

theme.lazyload = ()=>{
  lazyload();
}

theme.scrollto = (tar, e)=>{
	
  let path = window.location.pathname;
  var tar = tar.replace(path, '');
  tar = tar.replace('#', '');

  if($('[data-id="' + tar + '"]').length || tar == 'header'){

    if(e)
    e.preventDefault();

    let diff = $('.mq-tablet:first').is(':visible') ? 53 : 90;
    let pos = tar == 'header' ? 0 : $('[data-id="'+tar+'"]').offset().top - diff;

    $('html,body').stop().animate({ scrollTop: pos }, 10, 'easeOutExpo');
    
  }
 
}

theme.customerTemplates = (function() {
  var selectors = {
    RecoverHeading: '#RecoverHeading',
    RecoverEmail: '#RecoverEmail',
    LoginHeading: '#LoginHeading'
  };

  let recoverHeading;
  let recoverEmail;
  let loginHeading;

  function initEventListeners() {
    recoverHeading = document.querySelector(selectors.RecoverHeading);
    recoverEmail = document.querySelector(selectors.RecoverEmail);
    loginHeading = document.querySelector(selectors.LoginHeading);
    var recoverPassword = document.getElementById('RecoverPassword');
    var hideRecoverPasswordLink = document.getElementById(
      'HideRecoverPasswordLink'
    );

    // Show reset password form
    if (recoverPassword) {
      recoverPassword.addEventListener(
        'click',
        function(evt) {
          evt.preventDefault();
          showRecoverPasswordForm();
          recoverHeading.setAttribute('tabindex', '-1');
          recoverHeading.focus();
        }.bind(this)
      );
    }

    // Hide reset password form
    if (hideRecoverPasswordLink) {
      hideRecoverPasswordLink.addEventListener(
        'click',
        function(evt) {
          evt.preventDefault();
          hideRecoverPasswordForm();
          loginHeading.setAttribute('tabindex', '-1');
          loginHeading.focus();
        }.bind(this)
      );
    }

    if (recoverHeading) {
      recoverHeading.addEventListener('blur', function(evt) {
        evt.target.removeAttribute('tabindex');
      });
    }

    if (loginHeading) {
      loginHeading.addEventListener('blur', function(evt) {
        evt.target.removeAttribute('tabindex');
      });
    }
  }

  /**
   *
   *  Show/Hide recover password form
   *
   */

  function showRecoverPasswordForm() {
    document.getElementById('RecoverPasswordForm').classList.remove('hide');
    document.getElementById('CustomerLoginForm').classList.add('hide');

    if (this.recoverEmail.getAttribute('aria-invalid') === 'true') {
      this.recoverEmail.focus();
    }
  }

  function hideRecoverPasswordForm() {
    document.getElementById('RecoverPasswordForm').classList.add('hide');
    document.getElementById('CustomerLoginForm').classList.remove('hide');
  }

  /**
   *
   *  Show reset password success message
   *
   */
  function resetPasswordSuccess() {
    var formState = document.querySelector('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!formState) {
      return;
    }

    // show success message
    var resetSuccess = document.getElementById('ResetSuccess');
    resetSuccess.classList.remove('hide');
    resetSuccess.focus();
  }

  /**
   *
   *  Show/hide customer address forms
   *
   */
  function customerAddressForm() {
    var newAddressForm = document.getElementById('AddressNewForm');
    var newAddressFormButton = document.getElementById('AddressNewButton');
    var addressDetail = document.querySelectorAll('.address-detail');
    var addressList = document.querySelectorAll('.address-list__item');
    
    //console.log(typeof addressDetail)

    if (!newAddressForm) {
      return;
    }


    document.querySelectorAll('.addresses [name="address[country]"] [value="Japan"]').forEach(function(option) {
      option.setAttribute('data-provinces', prefecturesAryStr)
    });

    // Initialize observers on address selectors, defined in shopify_common.js
    if (Shopify) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(
        'AddressCountryNew',
        'AddressProvinceNew',
        {
          hideElement: 'AddressProvinceContainerNew'
        }
      );

      // document.getElementById('AddressProvinceNew').innerHTML = prefecturesHTML;
      // document.getElementById('AddressProvinceNew').value = 'Tōkyō';

    }

    // Initialize each edit form's country/province selector
    document
      .querySelectorAll('.address-country-option')
      .forEach(function(option) {
        var formId = option.dataset.formId;
        var countrySelector = 'AddressCountry_' + formId;
        var provinceSelector = 'AddressProvince_' + formId;
        var containerSelector = 'AddressProvinceContainer_' + formId;

        // eslint-disable-next-line no-new
        new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
          hideElement: containerSelector
        });

        // var selected_value = document.getElementById(provinceSelector).value;
        // document.getElementById(provinceSelector).innerHTML = prefecturesHTML;

        // if(selected_value){
        //   document.getElementById(provinceSelector).value = selected_value;
        // }


      });

    // Toggle new/edit address forms
    document.querySelectorAll('.address-new-toggle').forEach(function(button) {
      button.addEventListener('click', function() {
        var isExpanded =
          newAddressFormButton.getAttribute('aria-expanded') === 'true';

        newAddressForm.classList.toggle('hide');
        addressDetail.forEach((elem) => {
          elem.classList.toggle('hide');
        });
        addressList.forEach((elem) => {
          elem.classList.toggle('address-list__item--no-border');
        });        
        newAddressFormButton.setAttribute('aria-expanded', !isExpanded);
        newAddressFormButton.focus();
      });
    });

    document.querySelectorAll('.address-edit-toggle').forEach(function(button) {
      button.addEventListener('click', function(evt) {
        var formId = evt.target.dataset.formId;
        var editButton = document.getElementById('EditFormButton_' + formId);
        var editAddress = document.getElementById('EditAddress_' + formId);
        var isExpanded = editButton.getAttribute('aria-expanded') === 'true';

        editAddress.classList.toggle('hide');
        addressDetail.forEach((elem) => {
          elem.classList.toggle('hide');
        });
        addressList.forEach((elem) => {
          elem.classList.toggle('address-list__item--no-border');
        }); 
        editButton.setAttribute('aria-expanded', !isExpanded);
        editButton.focus();
      });
    });

    document.querySelectorAll('.address-delete').forEach(function(button) {
      button.addEventListener('click', function(evt) {
        var target = evt.target.dataset.target;
        var confirmMessage = evt.target.dataset.confirmMessage;

        // eslint-disable-next-line no-alert
        if (
          confirm(
            confirmMessage || 'Are you sure you wish to delete this address?'
          )
        ) {
          Shopify.postLink(target, {
            parameters: { _method: 'delete' }
          });
        }
      });
    });
  }

  /**
   *
   *  Check URL for reset password hash
   *
   */
  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      showRecoverPasswordForm.bind(this)();
    }
  }

  return {
    init: function() {
      initEventListeners();
      checkUrlHash();
      resetPasswordSuccess();
      customerAddressForm();
    }
  };

})();

theme.login = ()=>{

  const hashChangeHandler = ()=>{
    if(location.hash == '#recover'){
      $('.login-form-wrapper').removeClass('visible').addClass('hidden');
      $('.recover-password-wrapper').removeClass('hidden').addClass('visible');
    } else {
      $('.login-form-wrapper').removeClass('hidden').addClass('visible');
      $('.recover-password-wrapper').removeClass('visible').addClass('hidden');   
    }
  }

  hashChangeHandler();

  $(window).on('hashchange', ()=>{
    hashChangeHandler();
  });

}

const resizeHandler = ()=>{
  winHeight = $win.height();
}

$('body').removeClass('no-animation');

const menu = {

	menuOpen: false,
	timer: null,

	open(){

		this.menuOpen = true;

		$('.mobile-site-nav').show();
    lockBG.lock();

		if(this.timer) clearTimeout(this.timer);
		this.timer = setTimeout(
			()=>{				
				$('.mobile-site-nav').addClass('visible');
				$('.toggle-nav-button').addClass('opened');
			}, 100);	
      

	},

	close(){

		this.menuOpen = false;
		
		$('.mobile-site-nav').removeClass('visible');
		$('.toggle-nav-button').removeClass('opened');
    lockBG.unlock();
		
		if(this.timer) clearTimeout(this.timer);
		this.timer = setTimeout(
			()=>{
				$('.mobile-site-nav').hide();
			}, 600);
		
	},

	toggle(){
		if(this.menuOpen){
			this.close();
		} else {
			this.open();
		}
	}	

}


const timer = (func, delay)=>{
  setTimeout(()=>{
    func();
  }, delay);
}

const prlx = (tgt)=>{

  const tgtElem = $(tgt);
  let pst = 0;
  let dist = 0;

  let speed = 0.3;


  const resize = ()=>{
    tgtElem.each((i, elem)=>{
      elem.offset = {};
      //console.log(elem.parent().offsetTop)
      elem.offset.top = $(elem).parent().get(0).offsetTop;
    });    
  }
  
  resize();
  $win.on('load.prlx resize.prlx', resize);

  $win.on('scroll.prlx', (e)=>{

    let st = $(e.currentTarget).scrollTop();

    tgtElem.each((i, elem)=>{
      let pos = elem.offset.top;
      let scrollY = 0;

      if(pos <= st + winHeight){

        dist = st;
        speed = $(elem).hasClass('delay') ? 0.2 : 0.3;
        scrollY = -(elem.offset.top + (dist * speed));
        $(elem).css({transform: 'translate(0px, '+scrollY+'px)'});

      }  

    });

    pst = st;

  }).trigger('scroll');

  
      
};

$win.on('scroll',(e)=>{
  let st = $(e.currentTarget).scrollTop();
  if(st > 100){
    $('.indicator').addClass('invisible');
  } else {
    $('.indicator').removeClass('invisible');
  }
})


theme.scrollableTable = ()=>{

  let sl = 0;

  $('.scrollable-table-container').each((i, o)=>{

    let theadH = $('<div class="scrollable-table-thead-header-rows"></div>');
    $(o).find('thead tr').each((j, p)=>{
      let html = $('<div class="scrollable-table-thead-header-row"></div>');
      html.css({height: $(p).outerHeight(), width: $(p).find('th:first').outerWidth()});
      html.append($(p).find('th:first').html());
      theadH.append(html);
    });
    $(o).append(theadH);

    let tbodyH = $('<div class="scrollable-table-tbody-header-rows"></div>');
    let tbodyTop = $(o).find('thead').length ? $(o).find('thead').outerHeight() : 0;
    tbodyH.css({top: Math.round(tbodyTop)});

    $(o).find('tbody tr').each((j, p)=>{
      let html = $('<div class="scrollable-table-tbody-header-row"></div>');
      html.css({height: $(p).outerHeight(), width: $(p).find('th:first').outerWidth()});
      html.append($(p).find('th:first').html());
      tbodyH.append(html);
    });
    $(o).append(tbodyH);
  });

}


theme.makeTabs = ()=>{

  $('.tab-contents').each((i, elem)=>{
    $(elem).find('.tab__nav__toggle-button').on('click', (e)=>{
      $(elem).find('.tab__nav__toggle-button').removeClass('tab__nav__toggle-button--active');
      $(e.currentTarget).addClass('tab__nav__toggle-button--active');
      const index = $(e.currentTarget).index();
      $(elem).find('.tab__page').removeClass('tab__page--visible').eq(index).addClass('tab__page--visible');
    })
  });

}

theme.makeAccordion = ()=>{

  $('.accordion__toggle-button').on('click', (e)=>{
    $(e.currentTarget).toggleClass('accordion__toggle-button--opened').closest('.accordion__header').toggleClass('accordion__header--opened').next('.accordion__content').toggleClass('accordion__content--visible');
  })

}

theme.pageScrollTo = (tar, duration, e) => {

  tar = tar.replace(window.theme.site_url, '');
  tar = tar.replace('#', '');

  if($('[data-id="' + tar + '"]').length || tar == 'header'){
    if(e)
    e.preventDefault();

    let diff = 80;
    let pos = tar == 'header' ? 0 : $('[data-id="'+ tar +'"]').offset().top - diff;

    $('html,body').stop().animate({ scrollTop: pos }, duration, 'easeOutExpo');
    menu.close();
  }

}

theme.newsletter_popup = ()=>{

  const cookieKey = $('.newsletter-popup').data('key');
  const cookieValue = Cookies.get(cookieKey);
  if(!cookieValue){

    $('.newsletter-popup').addClass('visible');

    $('.newsletter-popup__close-button').on('click', ()=>{
      $('.newsletter-popup').removeClass('visible');
      $('.newsletter-popup').addClass('hidden');
      setTimeout(()=>{
        $('.newsletter-popup').remove();
        Cookies.set(cookieKey, 'true', { expires: 7 });
      }, 700);
    });

  } else {

    $('.newsletter-popup').remove();

  }

  $('.newsletter-popup .form.contact-form button').on('click', (e)=>{
    const form = $(e.currentTarget).closest('form');

    form.closest('.newsletter-popup').find('p.error, p.success').remove();
    //e.preventDefault();
    const value = $(form).find('input[type="email"]').val();
    if(value !== ''){

      if(!validateEmail(value)){
        e.preventDefault();
        $(form).find('.newsletter-popup__form').append('<p class="error">メールアドレスの形式が正しくありません。</p>');  
      }
      // var data = $(form).serialize();

      // Axios.post('/contact')
      // .then(response => {

      //   //console.log(response)

      // })
      // .catch(error => {
      //   //console.log(error)
      // })

      // $.ajax({  
      //   type: "POST",  
      //   url: "/contact",  
      //   data: data,  
      //   success: function(data, status, xhr) { 
      //     console.log(xhr);
      //     if(xhr.status === 200){
      //       $('.contact-form').append('<p class="success">Thanks for signing up! Here is your promo code: 123456</p>');
      //     } else {
      //       $('.contact-form').append('<p class="errror">There was an error in submitting the form.</p>');
      //     }
      //   },
      //   error: function() {
      //     $('.contact-form').append('<p class="errror">There was an error in submitting the form.</p>');
      //   }    
      // }); 



    } else {
      e.preventDefault();
      $(form).find('.newsletter-popup__form').append('<p class="error">メールアドレスを入力してください。</p>');  
    }

  });



}

theme.notificationsPopup = ()=>{

  initNotificationsPopup();

}


theme.notificationsBar = ()=>{

  if($('.notifications-bar').length){

    const notificationsBar = Cookies.get('notifications_bar');
    if(notificationsBar){
      $('.notifications-bar').remove();
    } else {
      $('body').addClass('has-notifications-bar');
      $('.notifications-bar').addClass('visible');
      $('.notifications-bar .notifications-bar__close').on('click', ()=>{
        $('.notifications-bar').remove();
        $('body').removeClass('has-notifications-bar');
        Cookies.set('notifications_bar', 'false', { expires: 3 });
      });
    }
    
  }

}



theme.init = ()=>{
  //theme.slideshow();
  theme.lazyload();
  theme.login();
  theme.makeTabs();
  theme.notificationsBar();
  theme.notificationsPopup();
  theme.newsletter_popup();
  theme.makeAccordion();
  //theme.scrollableTable();
  theme.customerTemplates.init();

  $win.on('load reize', resizeHandler)
  prlx('.hero-banner__logo, .hero-banner__product');

  if(location.hash){
    theme.scrollto(location.pathname + location.hash);
  }

  $('.anchor').on('click', (e)=>{
    let tgt = $(e.currentTarget).attr('href').split('#');
    //if($('[data-id="'+tgt[1]+'"]').length)
    theme.pageScrollTo(tgt[1]);

  });

}


theme.init();

$.event.add(window, "load", ()=>{
  theme.lazyload();
  // if(location.hash){
  //   theme.scrollto(location.pathname + location.hash);
  // }
  theme.scrollableTable();
});


let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
  
const parallaxize = ($tgt,friction)=>{
  let prxTimer;
  if($tgt.length){
    
    let defaultPosLeft = Number($tgt.css('left').replace('px', ''));
    let defaultPosTop = Number($tgt.css('top').replace('px', ''));

    $win.on('mouseenter', ()=>{

      if(prxTimer) clearTimeout(prxTimer);
      setTimeout(()=>{
        $tgt.removeClass('mouseout');
      }, 500)
    });

    $win.on("mousemove", (e)=>{
      
      $tgt.removeClass('mouseout');

      if(e.clientX <= 0 || e.clientY <=0 ) return;
      let cx = $win.width() / 2,
      cy = $win.height() / 2,
      dx = (e.clientX ? e.clientX : e.pageX) - cx,
      dy = (e.clientY ? e.clientY: e.pageY) - cy;

      //console.log('translate('+ (defaultPosLeft+(Math.floor(-dx / friction))) +'px')
      $tgt.css({
        "transform": 'translate('+ (defaultPosLeft+(Math.floor(-dx / friction))) +'px, '+ (defaultPosTop+(Math.floor(-dy / friction))) +'px)'
      });
      
      // $tgt.css({
      // 	"left": defaultPosLeft+(Math.floor(-dx / friction)),
      // 	"top": defaultPosTop+(Math.floor(-dy / friction))
      // });
    });

    $win.on("mouseleave", (e)=>{

      $tgt.css({
        "transform": 'translate(0,0)'
      });

      $tgt.addClass('mouseout');

    });  

  }

}
//if(ua.mobile == false){

  parallaxize($(".hero-banner__logo .image-container"), 15);
  parallaxize($(".hero-banner__product .image-container"), 30);

//}


$('.toggle-nav-button').on('click', ()=>{
  menu.toggle();
});

$('.toggle-search-button').on('click', ()=>{
  $('.search-box').toggleClass('visible');
  $('.search-box input').focus();
});

$(document).on('click', (e)=>{
  if(!$(e.target).closest('.search-box').length && !$(e.target).closest('.toggle-search-button').length){
    $('.search-box').removeClass('visible');
  }
});


$('.fadein, .hero-banner__logo').each((i, elem)=>{
  const delay = $(elem).data('delay') ? $(elem).data('delay') : 0;
  timer(()=>{$(elem).addClass('executed')}, delay);
});


if (window.matchMedia('(max-width: 600px)').matches) {
  
  $('.resp-slider-container').each((i,elem)=>{

    $(elem).addClass('swiper');
    $(elem).find('.resp-slider-wrapper').addClass('swiper-wrapper');
    $(elem).find('.resp-slider-slide').addClass('swiper-slide');

  });

}


const swiperElements = document.querySelectorAll('.swiper:not(.swiper--custom)');

if (swiperElements) {
  Slider({selector: swiperElements});
}



const snScroll = new PerfectScrollbar('#mobile-site-nav_scroll-contents', {
  suppressScrollX: true
});


$('.categories__filter select[name="category"]').on('change', (e)=>{

  const val = $(e.currentTarget).val();
  $('.categories .category').removeClass('visible');
  $('[data-cat="'+ val +'"]').addClass('visible');

})

const syncCustomSelectValue = (selectElem)=>{
  const $select = $(selectElem);
  const $customSelect = $select.closest('.custom-select');
  if(!$customSelect.length) return;
  const selectedText = $select.find('option:selected').text();
  $customSelect.find('.custom-select__value').text(selectedText);
}

$('.custom-select').each((i, elem)=>{

  const val = $(elem).find('option:selected').text();
  if(!$(elem).find('.custom-select__inner').length){
    $(elem).wrapInner('<div class="custom-select__inner"></div>')
  }
  if(!$(elem).find('.custom-select__arrow').length){
    $(elem).find('.custom-select__inner').append('<div class="custom-select__arrow"></div>')
  }
  if(!$(elem).find('.custom-select__value').length){
    $(elem).find('.custom-select__inner').append('<p class="custom-select__value">' + val + '</p>');
  } else {
    $(elem).find('.custom-select__value').text(val);
  }

  if($(elem).find('select').hasClass('select--b')){
    $(elem).addClass('custom-select--b');
  }

  if($(elem).find('select').hasClass('select--c')){
    $(elem).addClass('custom-select--c');
  }



});

$(document)
  .off('change.customSelect', '.custom-select select')
  .on('change.customSelect', '.custom-select select', function(){
    syncCustomSelectValue(this);
  });

$(document)
  .off('keyup.customSelect', '.p-postal-code')
  .on('keyup.customSelect', '.p-postal-code', ()=>{
    setTimeout(()=>{
      $('.custom-select select').each((i, selectElem)=>{
        syncCustomSelectValue(selectElem);
      });
    }, 0);
  });

instagramFeed();
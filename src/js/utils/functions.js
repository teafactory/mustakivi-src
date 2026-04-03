
import $ from 'jquery';

const getRandomKey = function(){
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

const getUA = function(){
  
  let _ua = navigator.userAgent.toLowerCase();
  let _o = {
    ltIE6:typeof window.addEventListener == "undefined" && typeof document.documentElement.style.maxHeight == "undefined",
    ltIE7:typeof window.addEventListener == "undefined" && typeof document.querySelectorAll == "undefined",
    ltIE8:typeof window.addEventListener == "undefined" && typeof document.getElementsByClassName == "undefined",
    IE9: navigator.appVersion.toLowerCase().indexOf("msie 9.") != -1,
    IE10 : navigator.userAgent.match(/Trident\/[6]/i),
    IE11: navigator.userAgent.match(/Trident\/7\./),
    IE:document.uniqueID,
    Firefox:window.sidebar,
    Opera:window.opera,
    chrome: _ua.indexOf('chrome') > -1,
		safari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    //Webkit:!document.uniqueID && !window.opera && !window.sidebar && !window.orientation && window.localStorage,
    mobile:/android|iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase()),
    iphone:/iphone|ipod/i.test(_ua),
    android:/android/.test(_ua),
    ipad:/ipad/.test(_ua),
    tablet:undefined,
    smartphone:undefined,
    touch: window.ontouchstart === null
  }
  _o.tablet = _o.ipad;
  if(!_o.tablet && _o.android){ _o.tablet = !(/mobile/.test(_ua));}				
  _o.smartphone = _o.iphone || _o.android ? true : false;
  
  let v = [];
  if (/iP(hone|od|ad)/.test(navigator.platform)) {v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);}
  let vAry = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
  _o.iosV = vAry[0] ? vAry[0] : '';

  return _o;
  
}

const formatMoney = function(cents, currency = window.Shopify.currency.active || 'JPY', locale = navigator.language) {
  if (!cents) return '0';

  const amount = Number(cents) / 100; // Shopifyは cents 単位

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 2, // 円は小数なし
    maximumFractionDigits: currency === 'JPY' ? 0 : 2
  }).format(amount);
};

const lockBG = {
	locked : false,
	scrollOffsetY : 0,
	toggle : function(){
		if(this.locked){
			this.unlock();
		} else {
			this.lock();
		}
	},
	lock : function(){
		this.scrollOffsetY = $(window).scrollTop();
		$('body').css({position: 'fixed', top: -this.scrollOffsetY, width: '100%'});	
		this.locked = true;	
	},
	unlock : function(){
		$('body').css({position: 'static', top: 'auto'});		
		window.scrollTo(0, this.scrollOffsetY);	
		this.locked = false;	
	}		
}


const formatMoneyRaw = function(cents, currency = window.Shopify.currency.active || 'JPY', locale = navigator.language) {
  if (!cents) return 0;

  const amount = Number(cents) / 100;

  // Intlでフォーマット
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2
  }).format(amount);

  // 記号・カンマなどを削除
  const numericString = formatted.replace(/[^\d.-]/g, '');

  // 数値型に変換して返す
  return parseFloat(numericString);
};



const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

class modalWindow {

	isOpen = false;
  $win = $(window);
	modalwrapper;
	modalContainer;
	modalContents;	
	contents;
	optionsDefault = {url: null, resetContent: true, iscroll: true, fullscreen: false, align: 'top', marginTop: 0, speed: 1000, style:{backgroundColor: '#000'}}
	options;
	onUpdateCallback;
	spMyScroll;
  ua = {};

	constructor (options = {}) {

		const key = options.modalID ? options.modalID : 'modal' + getRandomKey();
		const html = '<div id="'+ key +'" class="modal">'+
			'<div class="modal__container">'+
				'<div class="modal__contents">'+
				'</div>'+
			'</div>'+
		'</div>';

		//alert(key)
		$('body').append(html);
		this.modalwrapper = $('#' + key);
		this.modalContainer = this.modalwrapper.find('.modal__container');
		this.modalContents = this.modalwrapper.find('.modal__contents');
		this.ua = getUA();

		//)

		if(options.content){
			this.contents = $(options.content);
			$(this.contents).appendTo(this.modalContents);
		}

	}

	setContents(data, param){
		let obj = param;
		this.options = $.extend({}, this.optionsDefault, obj);
		
		if(data)
		this.contents = data;

	}

	toggle (obj){

		let w = this.$win.width();
		let h = this.$win.height();

		let callbacks = {
			beforeOpen : ()=>{},
			beforeClose : ()=>{},
			onOpen : ()=>{},
			onClose : ()=>{}
		}

		
		callbacks = $.extend({}, callbacks, obj);
		

		let callbackbeforeOpen = callbacks.beforeOpen;
		let callbackbeforeClose = callbacks.beforeClose;
		let callbackOnOpen = callbacks.onOpen;
		let callbackOnClose = callbacks.onClose;

		if(!this.isOpen){

			let windowTop = this.$win.scrollTop();

			$('body').css({
				position: 'fixed',
				left: 0,
				top: windowTop,
				width: '100%'
			});

			// $('.close-modal-button', this.modalContainer).on('click', (e)=>{
			// 	e.preventDefault();
			// 	this.toggle(callbackOnOpen);
			// });
			
			this.$win.on('resize.modalWindow load.modalWindow', ()=>{
				this.resize();
			});
		
      if(this.options.resetContent == true){
			  this.modalContents.append(this.contents);
      }

			
			this.modalwrapper.attr('style', '');
			this.modalwrapper.css({width: w, height: h, top: 0, left: 0, opacity: 0}).addClass('modal-style-01').css(this.options.style).show();
      
			this.modalwrapper.stop().animate({
				opacity: 1
			}, this.options.speed, 'easeOutCubic');

			this.modalContainer.css({opacity: 0, top: 0, left: 0}).show();
			callbackbeforeOpen();
      this.modalContainer.scrollTop(0);

			this.modalContainer.stop().animate({
				opacity: 1
			}, this.options.speed, 'easeOutCubic', ()=>{
				
				callbackOnOpen();
        
				if(this.options.iscroll && this.ua.smartphone){
					
					// $('> *', this.modalContents).wrap('<div id="modal-iscroll-modalContainer"><div id="modal-iscroll-modalContainer-inner"></div></div>');
					// $('#modal-iscroll-modalContainer').css({height: '80vh', overflow: 'hidden'});
					// //$('#modal-iscroll-modalContainer-inner').css({position: 'absolute', left: 0, top: 0, width: '100%'});
					// $('#modal-iscroll-modalContainer').imagesLoaded(function(){
					// 	this.spMyScroll = new BScroll('#modal-iscroll-modalContainer', { mouseWheel: true, click: true });
					// 	//this.spMyScroll.refresh();
					// });

				}		

			});
		
			this.modalContainer.on('click', (e)=>{		
        if(!$(e.target).hasClass('close-modal-button') && !$(e.target).closest('.close-modal-button').length){
          if($(e.target).hasClass('modal__container') == true || $(e.target).hasClass('modal__contents') == true)
          this.toggle(callbacks);
        }
			});
			
			this.modalContainer.find('.close-modal-button').on('click', (e)=>{
				e.preventDefault();
				this.toggle(callbacks);
			});
				
		
					
			this.isOpen = true;
			this.resize();
			
		} else {
		
			callbackbeforeClose();

			this.modalwrapper.stop().fadeOut(this.options.speed, 'easeOutCubic');			
			this.modalContainer.stop().fadeOut(this.options.speed, 'easeOutCubic', ()=>{
				this.modalwrapper.removeClass('modal-style-01');

        if(this.options.resetContent == true){
				  this.modalContents.html('');
        }

				if(this.options.resetContent == true){
					this.contents = null;	
				}
				this.isOpen = false;
				this.isOpen = null;
				this.options =  null;
				this.modalwrapper.hide();
				this.modalContainer.hide();


			});			
			
			this.modalContainer.off('click');
			$('.close-modal-button').off('click');
			
			this.onUpdateCallback = null;
			
			setTimeout(function(){
				callbackOnClose();
			}, this.options.speed);		
			
			let currentTop = $('body').css('top').replace('px', '');
      

			$('body').css({
				position: 'static',
				left: 0,
				top: 0,
				width: 'auto'
			});
//console.log(currentTop)
			this.$win.scrollTop(currentTop); 
			
			this.$win.off('resize.modalWindow load.modalWindow');	

		}
	}

	scrollTo(target){
		this.modalContainer.scrollTop(target);
	}

	resize(){
		
		let w = this.$win.width();
		let h = this.$win.height();
		let _self = this;

		if(this.isOpen){
			var diff = this.ua.iphone ? 100 : 0;
			this.modalwrapper.css({ width: w, height: h + diff});
			this.modalContainer.css({width: w, height: h + diff});	
			
			if(this.options.align == 'center'){

				setTimeout(function(){
					var contH = _self.contents.outerHeight();
					var contY = (h - contH) / 2;
					var contW = _self.contents.outerWidth();
					var contX = (w - contW) / 2;	
					_self.modalContents.css({marginTop: Math.max(contY, 10)});
				}, 10);

			} else {
				this.modalContents.css({marginTop: this.options.marginTop});
			}
			
      if(this.contents){
        if(this.contents.height() < w){
          this.modalContainer.css({overflowY: 'auto'});
        } else {
          this.modalContainer.css({overflowY: 'scroll'});
        }
      }
		}

	}

}

export {
  lockBG,
  modalWindow,
  validateEmail,
  formatMoney,
	formatMoneyRaw
}
import Vue from 'vue'
import store from '../store'
import { EventBus } from '../utils/event-bus.js';
import { formatMoney } from '../utils/functions.js';
import $ from 'jquery'

if(document.querySelector('.cart-popup')){

  new Vue({
    el: '.cart-popup',
    store,
    delimiters: ['${', '}'],
    data: function(){
      return {
        item: [],
        quantity: '',
        visible: false,
        free_shipping_minimum_amount: window.theme.settings.free_shipping_total_price ?  window.theme.settings.free_shipping_total_price : 10000000,
        free_shipping_progress: 0,
        free_shipping_remaining: 0,             
      }
    },
    computed: {
      cart: function () {
        return this.$store.getters['Cart/cartData']
      }
    },
    mounted: function(){
      this.getCart();
      EventBus.$on('added_to_cart', (data) => {
        this.handleResponse(data);
      });  
      $('body').on('click', (e)=>{
        if(!$(e.target).closest('.cart-popup').length){
          if(this.visible == true)
          this.visible = false;
        }
      });
      window.addEventListener("wiser:cartUpdated", e => {       
        const data = e.detail;
        if (data){
          this.getCart();
        }
      });

    },
    methods: {
      getCart(){
        return this.$store.dispatch('Cart/getCart');
      },
      handleResponse(data){   
        if(data.response.status == 200){
          this.item = data.response.data;
          this.quantity = data.target.quantity;
          this.visible = true;
          setTimeout(()=>{
            this.visible = false;
          }, 5000)
          this.getCart().then(() => {
            this.freeShipping(data);
          });
        }
      },
      closePopup(){
        this.visible = false;
      },
      freeShipping(data){
        const cart_total_price = data && data.response.data.total_price ? data.response.data.total_price : this.cart.total_price;
        this.free_shipping_progress = Math.min(100, Math.max(0, Math.floor(Number(cart_total_price) / this.free_shipping_minimum_amount * 100)));
        this.free_shipping_remaining = formatMoney(Math.max(0, this.free_shipping_minimum_amount - Number(cart_total_price)));
      }        
    }
  })

}






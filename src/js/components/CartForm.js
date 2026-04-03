import Vue from 'vue'
import store from '../store'
import { EventBus } from '../utils/event-bus.js';
import { customInputs, formatMoney } from '../utils/functions.js';
import $ from 'jquery'

let first = true;
const carts = document.querySelectorAll('.cart__wrapper');

if(carts){

  carts.forEach((el, i) => {
    
    new Vue({
      el: el,
      store,
      delimiters: ['${', '}'],
      // data: function(){
      //   return {
      //     cart: {
      //       attributes: {
      //         gift_wrapping: '',
      //         receipt: '',
      //       }
      //     }
      //   }
      // },
      data: function(){
        return {
          checked: false,
          ps: null,
          free_shipping_minimum_amount: window.theme.settings.free_shipping_total_price ?  window.theme.settings.free_shipping_total_price : 10000000,
          free_shipping_progress: 0,
          free_shipping_remaining: 0,          
          result: ''
        }
      },
      computed: {
        cart: function () {
          return this.$store.getters['Cart/cartData']
        },
        cartState: function () {
          return this.$store.getters['Cart/cartState']
        }
      },
      created: function(){
        //this.checked = this.$refs.receipt.checked || this.$refs.gift_wrapping.checked ? true : false
      },
      mounted: function(){
     
        this.$store.dispatch('Cart/initCart');  
        this.getCart().then(() => {
          this.freeShipping();
        });

        EventBus.$on('added_to_cart', (data) => {
          this.handleResponse(data);
        });

        EventBus.$on('update_cart', (data) => {
          this.handleResponse(data);
        });

        if(first){
          setTimeout(()=>{
            FONTPLUS.reload();
          },1000);
          first = false;
        }

      },
      methods: {
        getCart(){
          return this.$store.dispatch('Cart/getCart');
        },
        deleteItem(item, e){

          const handle = $(e.target).closest('.item__quantity').find('[name="handle"]').val();
          const data = new FormData();
          data.append('id', item.key);
          data.append('quantity', 0);
          data.append('handle', handle); 

          this.$store.dispatch('Cart/updateCart', {data: data, item: item, event:e})  
        },
        decrease(item, e){
          let q = Math.max(0, Number($(e.currentTarget).parent().find('.cart-drawer__item__input--quantity').val()) - 1);
          $(e.currentTarget).parent().find('.cart-drawer__item__input--quantity').val(q);
          this.updateCart(item, {target:  $(e.currentTarget).parent().find('.cart-drawer__item__input--quantity').get(0)});
        },
        increase(item, e){
          let q = Math.max(0, Number($(e.currentTarget).parent().find('.cart-drawer__item__input--quantity').val()) + 1);
          $(e.currentTarget).parent().find('.cart-drawer__item__input--quantity').val(q);
          this.updateCart(item, {target:  $(e.currentTarget).parent().find('.cart-drawer__item__input--quantity').get(0)});
        },      
        updateCart(item, e){
          
          //$('.cart__action-result').text('');
          const q = e.target.value;
          const handle = $(e.target).closest('.item__quantity').find('[name="handle"]').val();

          const data = new FormData();
          data.append('id', item.key);
          data.append('quantity', q);
          data.append('handle', handle);          

          this.$store.dispatch('Cart/updateCart', {data: data, item: item, event:e})  
          
        },
        updateAttributes($event){
          
          let name = $event.target.name;
          let value = $event.target.value;

          if($event.target.getAttribute('type') == 'checkbox' || $event.target.getAttribute('type') == 'radio'){
            value = $event.target.checked ? $event.target.value : '';
          }

          let data = {};
          
          if(name.indexOf('attributes') > -1){
            var regexp = /\[([^\[\]\s　]+)/;
            var res = name.match(regexp);

            data = {
              attributes: {
                [res[1]]: value
              }
            }

          } else {
            data = {
              [name]: value
            }
          }

          //this.toggleNote();

          this.$store.dispatch('Cart/updateAttributes', {data: data})    

        },
        toggleNote(){
          this.$refs.receipt.checked || this.$refs.gift_wrapping.checked ? true : false
        },
        handleResponse(data){
          //alert('test')
          $('.cart__action-result').text('');  
          $('.product__actions__result').text('');
          //console.log(data.target.$el.getAttribute('data-handle'))
          if(data.response.status == 422){          
            $(data.target).closest('.cart__item').find('.cart__action-result').text(data.response.data.description);
            //alert(data.response.data.description)
            //$('.gift-wrapping .product__actions__result').text('');
            $('.gift-wrapping button[data-handle="' + $(data.target.$el).data('handle') + '"]').next('.product__actions__result').text(data.response.data.description)
            
          }    
            
             
          if(data.response.status == 200){   

            this.freeShipping(data);

          }  

        },
        addGiftWrapping(e){
          const handle = e.currentTarget.getAttribute('data-handle');
          const tgt = document.querySelector('.product form[data-handle="'+handle+'"]');
          tgt.dispatchEvent(new Event('submit', { cancelable: true }))
        },
        freeShipping(data){
          const cart_total_price = data && data.response.data.total_price ? data.response.data.total_price : this.cart.total_price;
          console.log(this.cart.total_price);
          this.free_shipping_progress = Math.min(100, Math.max(0, Math.floor(Number(cart_total_price) / this.free_shipping_minimum_amount * 100)));
          this.free_shipping_remaining = formatMoney(Math.max(0, this.free_shipping_minimum_amount - Number(cart_total_price)));
        }                    
      }
    })

  })

}






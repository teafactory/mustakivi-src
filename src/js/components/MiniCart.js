import Vue from 'vue'
import store from '../store'

if(document.querySelector('.drawer-cart')){

  new Vue({
    el: '.drawer-cart',
    store,
    delimiters: ['${', '}'],
    computed: {
      cart: function () {
        return this.$store.getters['Cart/cartData']
      }
    },
    mounted: function(){
      this.getCart();
    },
    methods: {
      getCart(){
        this.$store.dispatch('Cart/getCart')
      },
      updateCart(item, e){

        let q = e.target.value

        let data = {
          quantity: q,
          id: item.key
        }

        this.$store.dispatch('Cart/updateCart', {data: data, item: item, event:e})        

      }
    }
  })

}






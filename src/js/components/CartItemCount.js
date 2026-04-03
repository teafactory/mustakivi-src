//import { createApp, computed } from 'vue'
//import { useStore } from 'vuex'
import store from '../store'
import {mapState, mapGetters, mapActions} from "vuex"

const cartCounters = document.querySelectorAll('.cart__item-count');

if(cartCounters){

  cartCounters.forEach((el, i) => {

    new Vue({
      el: el,
      store,
      computed: {
        ...mapGetters({
          cart: 'Cart/cartData'
        })
      },
      mounted: function(){    
        this.getCart();
      },
      methods: {
        ...mapActions({
          'getCart': 'Cart/getCart'
        })
      }
    })

  })

}







import * as product from '@shopify/theme-product';
import Axios from "axios"
import store from '../store'
import { EventBus } from '../utils/event-bus.js';
import { formatMoney, modalWindow } from '../utils/functions';
import Cookies from 'js-cookie';
import $ from 'jquery';



if(document.querySelector('.history-section')){

  new Vue({
    el: '.history-section',
    store,
    delimiters: ['${', '}'],
    data: function(){
      return {
        productHandle: '',
        products: [],
        visible: false,
      }
    },
    mounted: function(){
      if(window.theme.productHandle){
        this.productHandle = window.theme.productHandle;
        this.getHistory();
      }
    },
    methods: {
      getHistory(){

        const cookieValue = Cookies.get('productviewhistory');

        if(!cookieValue){
          Cookies.set('productviewhistory', this.productHandle, { expires: 7 });
        } else {
            

            let productHandles = cookieValue.split(',');

            if(cookieValue.indexOf(this.productHandle) > -1 && productHandles.length > 1){

              productHandles.splice(productHandles.indexOf(this.productHandle), 1);

            }

            productHandles.unshift(this.productHandle);


            const handles = productHandles.toString();

            Cookies.set('productviewhistory', handles, { expires: 7 });
            
            this.loadProducts(productHandles);

        }
      },
      loadProducts(productHandles){

        let count = 0;

        for(let i = 0; i < productHandles.length; i++){

          if(this.productHandle != productHandles[i]){

            this.visible = true;

            Axios.get('/products/' + productHandles[i] + '.js')
            .then(response => {

              const data = response.data;
              this.products.push(data);

            })
            .catch(error => {
              //console.log(error)
            })   

            count++;
            if(count > 9) break;
          
          }
        }


      }
    }
  })

}





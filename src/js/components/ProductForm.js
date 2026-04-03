import * as product from '@shopify/theme-product';
import Axios from "axios"
import store from '../store'
import { EventBus } from '../utils/event-bus.js';
import { formatMoney, modalWindow } from '../utils/functions';
import $ from 'jquery';

const makeProducts = (elems)=>{

  elems.forEach((el, i) => {

    let options = [];
    let colorOptionIndex = 0;

    let select = el.querySelectorAll('.product__select');
 
    if(select.length){
      select.forEach((elem, index) =>{
        options.push(elem.value);
        if(elem.classList.contains('product__select--color')){
          colorOptionIndex = index;
        }
      })
    }

    const label = el.querySelector('.add-to-cart__button .label') ? el.querySelector('.add-to-cart__button .label').getAttribute('data-label') : 'カートに追加する';
    const label_sold_out = el.querySelector('.add-to-cart__button .label') ? el.querySelector('.add-to-cart__button .label').getAttribute('data-label-sold-out') : 'OUT OF STOCK';

    new Vue({
      el: el,
      delimiters: ['${', '}'],
      store,
      data: function(){
        return {
          id: el.querySelector('[name="id"]').value,
          quantity: el.querySelector('[name="quantity"]').value,
          regular_price: '',
          sku: '',
          sale_price: '',
          available: false,
          stock_count: 0,
          is_disabled: false,
          is_sale: false,
          add_to_cart_button_label: label,
          add_to_cart_button_label_sold_out: label_sold_out,
          add_to_cart_button_text: label,
          json: {},
          colors_json: null,
          color_name: '',
          handle: '',
          product_colors: [],
          current_color_handle: el.getAttribute('data-handle'),
          current_color_url: el.getAttribute('data-url'),
          current_color_name: '',
          option: options,
          loading: false,
          color_option_index: colorOptionIndex,        
          result: '',
          first_load: true,
          modal: null
        }
      },
      // computed: {
      //   result: function () {
      //     return '';
      //   }
      // },  
      mounted: function(){

        if(this.$el.querySelector('[name="handle"]')){           
          this.handle = this.$el.querySelector('[name="handle"]').value;
          //console.log(this.handle);
        }
//el.querySelector('.product__json').length ? el.querySelector('.product__json').innerHTML : {}
        if(this.$el.querySelector('.product__json')){

          this.json = this.$el.querySelector('.product__json').innerHTML;
     
        }
        
        this.updateVariant();
        this.selectAvailableVariant();
        
        EventBus.$on('added_to_cart', (data) => {
          this.handleResponse(data);
        });       

        let prd = $(this.$el).closest('.product-container');
        prd.find('.open-modal-button').on('click', (e)=>{
          this.openModal(e);
        });

        if(prd.find('.open-modal-button').length){
          this.modal = new modalWindow();	
        }

        if(prd.find('.product__title').length && prd.find('.product__actions').length){
          $(window).on('scroll', ()=>{
            let prdDesc = $('.product__title:first').offset().top;
            let footer = $('.site-footer:first').offset().top;
            let prdActions = prd.find('.product__actions');
            if(0 <= window.scrollY){
              prdActions.addClass('visible');
            } else {
              prdActions.removeClass('visible');
            }
            if(footer < window.scrollY + window.innerHeight){
              prdActions.removeClass('visible');
            }
          });
        }
        



      },
      watch: {

      },
      methods: {

        changeVariant($event, index, value){

          $($event.currentTarget).closest('.product__option').find('.selected').removeClass('selected');
          $($event.currentTarget).addClass('selected');
          this.$set(this.option, index, value);    
          this.updateVariant();   

        },

        updateColorName(){
          const prd = $(this.$el).closest('.product');
          let selectedColor = prd.find('.product__color-swatch .selected');
          let color_name = selectedColor.data('color-name');
          
          // this.current_color_name = ' - ' + color_name;
          // if(window.theme.country_code == 'jp'){
            this.current_color_name = ', ' + color_name;
          //}
        },

        hasColor( handle ){
          if(this.product_colors.length){
            return this.product_colors.find(color => color.handle == handle);
          }
        },
        
        changeColor($event){
 
          const prd = $($event.currentTarget).closest('.product');
          prd.find('.product__color-swatch button').removeClass('selected');
          $($event.currentTarget).addClass('selected');
          let color_url = $($event.currentTarget).data('url');
          let color_handle = $($event.currentTarget).data('handle');
          

          this.current_color_handle = color_handle;
          this.current_color_url = color_url;
          
          //console.log(this.current_color_handle)

          if(this.hasColor(color_handle)){

            //console.log('true')
            //prd.find('.product__link').attr('href', color_url);

            if(prd.find('.product__image--selected').length < 2){
              prd.addClass('product--single-image');
            } else {
              prd.removeClass('product--single-image');
            }            

          } else {
            
              Axios.get('/products/' + color_handle + '.js')
              .then(response => {

               
                const variants = response.data.variants;
          
                let is_sale = false;
                let sale_price = '';
                let regular_price = '';
                for(let i = 0; i < variants.length; i++){
                  let compare_at_price = variants[i].compare_at_price;
                  let price = variants[i].price;
                  let available = variants[i].available;
                  if (available && compare_at_price > price){
                    is_sale = true;
                    sale_price = price;
                    regular_price = compare_at_price;
                    break;
                  } else {
                    regular_price = price;
                  }             
                }
                
                let is_available = false;
                for(let i = 0; i < variants.length; i++){
                  if (variants[i].available){
                    is_available = true;
                    break;
                  }                
                }        
                
                let tags = [];

                for(let i = 0; i < response.data.tags.length; i++){
                  if(response.data.tags[i].indexOf('tag_') > -1){
                    tags.push(response.data.tags[i].replace('tag_', ''));
                  }
                }
                //console.log('return')
                response.data.is_sale = is_sale;
                response.data.is_available = is_available;
                //response.data.is_coming_soon = window.theme.coming_soon_items.indexOf(response.data.handle) > -1 ? true : false;
                response.data.regular_price = regular_price ? formatMoney(regular_price) : '';
                response.data.sale_price = sale_price ? formatMoney(sale_price) : '';
                response.data.product_tags = tags;

                

                this.product_colors.push(response.data);

                // console.log(this.current_color_handle)
                // console.log(this.product_colors)

                if(prd.find('.product__image--selected').length < 2){
                  prd.addClass('product--single-image');
                } else {
                  prd.removeClass('product--single-image');
                }


              })
              .catch(error => {
                //console.log(error)
              })
          }
          
          
          this.updateColorName();

        },

        selectAvailableVariant() {

          let variant;
          let json;
          if(this.json && this.json.length > 0){
            json = JSON.parse(this.json);
            variant = product.getVariantFromOptionArray(json, this.option);
          }


          if($(this.$el).find('.product__variant--other').length == 1) {

            $(this.$el).find('.product__variant--other .product__variant-content').each((i, a)=>{
              let availableItemSelected = false;
    
              $(a).find('.product__dummy-select').each((j, b)=>{

                let ary = [];
                
                ary.push($(b).text());         
                          
                let tgtVariant = product.getVariantFromOptionArray(json, ary);

                if(tgtVariant){
                  if(tgtVariant.available){  
                    if(availableItemSelected == false){  
                      $(b).addClass('selected');
                      availableItemSelected = true;
                    }
                  } else {
                    $(b).addClass('disabled');
                  }
                }
                
              });
            });  

          } else if($(this.$el).find('.product__variant--other').length == 2) {

              let availableItemSelected = false;

              $(this.$el).find('.product__variant--other:first .product__variant-content .product__dummy-select').each((i, o)=>{

                if(availableItemSelected == true) return false;

                $(this.$el).find('.product__variant--other:eq(1) .product__variant-content .product__dummy-select').each((j, p)=>{

                  let ary = [];
                  ary.push($(o).text());        
                  ary.push($(p).text());                             
                  let tgtVariant = product.getVariantFromOptionArray(json, ary);
                  if(tgtVariant){
                    if(tgtVariant.available){       
                      $(o).addClass('selected');
                      $(p).addClass('selected');
                      availableItemSelected = true;
                      return false;
                    } else {
                      //$(p).addClass('disabled');
                    }
                  }

                });

              });
     
          } else if ($(this.$el).find('.product__variant--other').length == 3){
            
            let firstVariantCount = $(this.$el).find('.product__variant--other:first .product__dummy-select').length;
            let otherVariantCount = $(this.$el).find('.product__variant--other').length;
            let variantAry = [];

            for(let i = 0; i < firstVariantCount; i++){
              variantAry = [];

              // 一個めのバリアント              
              let v = $(this.$el).find('.product__variant--other:first .product__dummy-select').eq(i).text();
              let e = $(this.$el).find('.product__variant--other:first .product__dummy-select').eq(i);
              //[s]
              
              //他のバリアントをループ
              for(let j = 1; j < otherVariantCount; j++){
                // 2種類目のバイリアンとの種類の数を取得
                let vi = $(this.$el).find('.product__variant--other').eq(j).find('.product__variant-content .product__dummy-select').length;
                
                

                // 2種類目のバイリアントをループ
                for(let k = 0; k < vi; k++){
                  // 2種類めのバリアントのテキストを取得
                  let w = $(this.$el).find('.product__variant--other').eq(j).find('.product__dummy-select').eq(k).text();
                  let f = $(this.$el).find('.product__variant--other').eq(j).find('.product__dummy-select').eq(k);
                  
                  // 3種類めのバリアントの長さを取得
                  //let vj = $('.product__variant--other').eq(j).find('.product__variant-content .product__dummy-select').length;

                  // 3種類目のバイリアントをループ
                    for(let l = j+1; l < otherVariantCount; l++){
    
                      let vj = $(this.$el).find('.product__variant--other').eq(l).find('.product__variant-content .product__dummy-select').length;

                      // 3種類目のバイリアントをループ
                        for(let m = 0; m < vj; m++){
                          let x = $(this.$el).find('.product__variant--other').eq(l).find('.product__dummy-select').eq(m).text();
                          let g = $(this.$el).find('.product__variant--other').eq(l).find('.product__dummy-select').eq(m);

                          variantAry.push(v);
                          variantAry.push(w);
                          variantAry.push(x);

                          let tgtVariant = product.getVariantFromOptionArray(json, variantAry);
                          if(tgtVariant){
                            if(tgtVariant.available){       
                              $(e).addClass('selected');
                              $(f).addClass('selected');
                              $(g).addClass('selected');
                              availableItemSelected = true;
                              return false;
                            }
                          }

                          variantAry = [];
                        }
                    }
                }
              }


            }


          }
                  
        },   

        updateVariant(){

          let variant;
          if(this.json && this.json.length > 0){
            let json = JSON.parse(this.json);
            variant = product.getVariantFromOptionArray(json, this.option);
          }


          if(variant){
            this.id = variant.id;
            this.stock_count = window.theme.variantStock ? window.theme.variantStock[variant.id] : 0;
            //console.log('count:' + this.stock_count);
            
            if(variant.sku)
            this.sku = variant.sku;
            
            if(variant.compare_at_price && variant.compare_at_price > variant.price) {
              this.sale_price = formatMoney(variant.price);
              this.regular_price = formatMoney(variant.compare_at_price);
              this.is_sale = true;
            } else {
              this.sale_price = '';
              this.regular_price = formatMoney(variant.price);
              this.is_sale =false;
            }
      
            if(variant.available){
              this.available = true;
              this.is_disabled = false;
              this.add_to_cart_button_text = this.add_to_cart_button_label;
            } else {
              this.available = false;
              this.is_disabled = true;
              this.add_to_cart_button_text = this.add_to_cart_button_label_sold_out;
            }

            const prd = $(this.$el).closest('.product');

            // console.log(prd.find('.product__image[data-id="'+variant.id+'"]').length);
            // console.log(prd.find('.product__image').length);

            //if(pr.hasClass('product--card')){
            // if(prd.find('.product__image').length > 1 && prd.find('.product__image[data-id="'+variant.id+'"]').length){

            //   prd.find('.product__image').addClass('hidden').removeClass('visible');
            //   prd.find('.product__image[data-id="'+variant.id+'"]').removeClass('hidden').addClass('visible');

            //   if(this.first_load == true){
            //     //alert('test')
            //     prd.find('.product__image').removeClass('hidden').addClass('visible');
            //   }

            // } else {
            //   prd.find('.product__image').addClass('visible');            
            // }
            
            if(prd.find('.product__image').length < 2){
              prd.addClass('product--single-image');
            }
            //}

          } else {
            this.available = false;
            this.is_disabled = true;
            this.add_to_cart_button_text = this.add_to_cart_button_label_sold_out;
          }

          this.first_load = false;
          this.updateColorName();

        },

        addToCart(e){
          const data = new FormData();
          data.append('id', this.id);
          data.append('quantity', this.quantity);
          data.append('handle', this.handle);
          this.loading = true;
          this.$store.dispatch('Cart/addToCart', {data: data, target: this});
        },

        counter(e){
          if(e.currentTarget.classList.contains('decrease-button')){
            this.quantity = Math.max(1, Number(this.quantity) - 1);  
          } else {
            this.quantity = Math.min(10, Number(this.quantity) + 1);  
          }              
        },

        handleResponse(data){          
          this.loading = false;
          if(data.response.status == 422){
            //console.log(data.response.data.description)
            data.target.result = data.response.data.description;
          } else {
            data.target.result = '';
          }
        },

        openModal(e){
          
          // if (window.matchMedia('(max-width: 600px)').matches)
          // return false;
          
          const index = $(e.currentTarget).parent().index();
          let cont = $('.product__modal').clone();
          
          this.modal.setContents(cont, {iscroll: true, align: 'top', marginTop: 0, speed: 600, bgOpacity: 1, style: {backgroundColor: '#fff'}});
          this.modal.toggle({
            beforeOpen: ()=>{
              //console.log(index)
              setTimeout(()=>{
                let tgtY = this.modal.contents.find('.product__image').eq(index).offset().top;
                this.modal.scrollTo(tgtY);
              }, 100);
                          
            },
            onOpen: ()=>{
              $('.product__modal').on('click', (e)=>{
                if(!$(e.target).hasClass('close-modal-button') && !$(e.target).closest('.close-modal-button').length){
                  this.modal.toggle();
                }
              });
            }
          });	

        }

      }
    })

  })



}

window.addEventListener('productrecommendationloaded', ()=>{

  const recforms = document.querySelectorAll('.product-reccomendations-section form[action="/cart/add"]');
  makeProducts(recforms);

}, false);

const forms = document.querySelectorAll('form[action="/cart/add"]');
makeProducts(forms);

export {
	makeProducts
}
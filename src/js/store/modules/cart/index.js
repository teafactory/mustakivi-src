import Axios from "axios"
import { cacheAdapterEnhancer } from 'axios-extensions'
import { EventBus } from '../../../utils/event-bus.js';
import PerfectScrollbar from 'perfect-scrollbar';
import {lockBG, spNavigation} from '../../../utils/functions.js';

let ps = null;
const Http = Axios.create({
	baseURL: '/',
	headers: {
    'Cache-Control': 'no-cache',
    'accept': 'accept: application/json, text/javascript, */*; q=0.01',
    'content-yype': 'application/x-www-form-urlencoded; charset=UTF-8',
    'x-requested-with': 'XMLHttpRequest'
  },
	// cache will be enabled by default
	adapter: cacheAdapterEnhancer(Axios.defaults.adapter)
})

const state = {
  cartData: [],
  addResult: [],
  cartState: {
    visible: false
  }
}

const getters = {
  cartData(state){
    return state.cartData;
  },
  addResult(state){
    return state.addResult;
  },
  cartState(state){
    return state.cartState;
  }    
}

const actions = {

  async initCart({commit, state, dispatch}){

    let cartData = await Axios.get('/cart.js')
    .then(response => response.data, ()=> '')
    .catch(error => {
      
    })  

    /*
    * remove the items in the coming soon collection if they are in.
    */

    let data = { updates: {} };


    //let reached_cap = false;

    if(cartData){

      let itemCount = cartData.item_count;
      let giftItemCount = 0;
      cartData.items.forEach(item => {
        if(window.theme.giftWrappingProducts.indexOf(item.variant_id) > -1){
          giftItemCount += item.quantity;
        }
      });

      let maxGiftCount = itemCount - giftItemCount;

      //console.log(maxGiftCount);

      cartData.items.forEach(item => {

        if(window.theme.giftWrappingProducts.indexOf(item.variant_id) > -1 && item.quantity > maxGiftCount){
          data.updates[item.id] = maxGiftCount;
        }

      });

      //console.log(data.updates)

      if(data.updates){

        cartData = await Axios.post('/cart/update.js', data)
        .then ( response => {

          dispatch('getCart')

        }) 

      }  

    }

 

  },  
  async getCart({commit, state, dispatch}){

    const cartData = await Axios.get('/cart.js')
    .then(response => response.data, ()=> '')
    .catch(error => {
      
    })  

    cartData.item_unit = window.theme.locale == 'ja' ? '点' : cartData.item_count > 1 ? 'items' : 'item';


    const payload = {
      cartData: cartData,
    };

    commit('setCartData', payload);
  },
  async updateCart({commit, state, dispatch}, data){
    
    let item = data.item;
    let itemData = data.data;
    let eventTarget = data.event ? data.event.target : null;
    let conditions_response;
    const quantity = itemData.get('quantity');


    /*
    * limit the number of items that customer can add to the cart.
    */    
    // const handle = itemData.get('handle');
    // const quantity = itemData.get('quantity');
    // const limited_item_max = window.theme.limited_items[handle];
    // let reached_max = false;
    // let max_quantity;

    // if(limited_item_max && state.cartData.items.length){
    //   state.cartData.items.forEach(item => {
    //     if(item.handle == handle && item.quantity >= limited_item_max && item.quantity < quantity){
    //       reached_max = true;
    //       max_quantity = item.quantity;
    //     }
    //   });
    // }

    
    // if(reached_max){
    //   eventTarget.value = max_quantity;
    //   conditions_response = {
    //       status: 422,
    //       data: {
    //         description: window.theme.country_code == 'us' ? 'This product is limited to ' + limited_item_max + ' per customer.' : 'この商品はお一人様' + limited_item_max + '点まで購入可能です。'
    //       }
    //     }
      
    //   //triggerEvent('update_cart', {target: eventTarget, response: response});
    //   itemData.set('quantity', limited_item_max);
    // }   


    /*
    * limit the number of items that customer can add to the cart in a collection.
    */   

    // if(limited_collection_items.indexOf(handle) > -1){
      
    //   const allowd_quantity = 1;
    //   let reached_cap = false;
      
    //   if(state.cartData.items && state.cartData.items.length){
    //     state.cartData.items.forEach(item => {
    //       if(limited_collection_items.indexOf(item.handle) > -1){
    //         reached_cap = true;
    //       }
    //     });
    //   }

    //   if(reached_cap && quantity > allowd_quantity){
    //     eventTarget.value = 1;
    //     conditions_response = {
    //         status: 422,
    //         data: {
    //           description: window.theme.country_code == 'us' ? 'Sorry, some of the sale items cannot be added more than one to the cart.' : 'このセール商品は一つ以上カートに追加できません。'
    //         }
    //       }
                
        
    //     //triggerEvent('update_cart', {target: eventTarget, response: response});
    //     itemData.set('quantity', allowd_quantity);
        
    //   } 
    
    // }


    // limit the gift wrapping 
    if(window.theme.giftWrappingProducts && window.theme.giftWrappingProducts.indexOf(item.variant_id) > -1){

      if(state.cartData.items && state.cartData.items.length){
        //console.log(state.cartData);
        let itemCount = state.cartData.item_count;
        let giftItemCount = 0;
        state.cartData.items.forEach(item => {
          if(window.theme.giftWrappingProducts.indexOf(item.variant_id) > -1){
            giftItemCount += item.quantity;
          }
        });

        let maxGiftCount = itemCount - giftItemCount;


        if(maxGiftCount < quantity){
          eventTarget.value = maxGiftCount;
          conditions_response = {
              status: 422,
              data: {
                description: window.theme.country_code == 'us' ? 'Gift wrapping is limited to ' + maxGiftCount + ' per customer.' : 'ご購入商品数(' + maxGiftCount + '点)を超えています。'
              }
            }
          
          itemData.set('quantity', maxGiftCount);
        }

      }

    }    



    const cartData = Axios.post('/cart/change.js', itemData)
    .then ( response => {

      let currentItem = state.cartData.items.find(product => product.variant_id == item.variant_id)
      let newItem = response.data.items.find(product => product.variant_id == item.variant_id)
      if(currentItem) {
        let item_qty = itemData.get('quantity');
    
        if(item_qty > 0 && item_qty > newItem.quantity){   
          conditions_response = {
            status: 422,
            data: {
              description: window.theme.locale == 'us' ? 'No more in stock.' : '在庫がありません。'
            }
          }
        }

      }

      if(conditions_response)
      response = conditions_response;     

      triggerEvent('update_cart', {target: eventTarget, response: response});


      dispatch('getCart')

    })

    // const payload = {
    //   cartData: cartData,
    // };

    // commit('setCartData', payload);

  },
  async updateAttributes({commit, state, dispatch}, data){
    
    //let item = data.item;
    let itemData = data.data;
    //console.log(itemData)
    const cartData = Axios.post('/cart/update.js', itemData)
    .then ( response => {

      dispatch('getCart')

    })    

  },  
  async addToCart({commit, state, dispatch}, data){
    
    let itemData = data.data;
    let eventTarget = data.target;
    

    //const handle = itemData.get('handle');
    //alert(handle);
    // const limited_item_max = window.theme.limited_items[handle];
    // let reached_max = false;

    // if(limited_item_max && state.cartData.items.length){
    //   state.cartData.items.forEach(item => {
    //     if(item.handle == handle && item.quantity >= limited_item_max){
    //       reached_max = true;
    //     }
    //   });
    // }

    // if(reached_max){
    //   let response = {
    //       status: 422,
    //       data: {
    //         description: window.theme.country_code == 'us' ? 'This product is limited to ' + limited_item_max + ' per customer.' : 'この商品はお一人様' + limited_item_max + '点まで購入可能です。'
    //       }
    //     }
      
    //   triggerEvent('added_to_cart', {target: eventTarget, response: response});
    //   return false;
    // }


    /*
    * limit the number of items that customer can add to the cart in a collection.
    */    

    // if(limited_collection_items.indexOf(handle) > -1){
    //   const allowd_quantity = 1;
    //   let reached_cap = false;
      
    //   if(state.cartData.items.length){
    //     state.cartData.items.forEach(item => {
    //       if(limited_collection_items.indexOf(item.handle) > -1){
    //         reached_cap = true;
    //         return true;
    //       }
    //     });
    //   }

    //   if(reached_cap){
    //     let response = {
    //         status: 422,
    //         data: {
    //           description: window.theme.country_code == 'us' ? 'Sorry, some of the sale items cannot be added more than one to the cart.' : 'このセール商品は一つ以上カートに追加できません。'
    //         }
    //       }
        
    //     triggerEvent('added_to_cart', {target: eventTarget, response: response});
    //     return false;
    //   } 
    // }

    // limit the gift wrapping 
    const quantity = itemData.get('quantity');
    const item_id = Number(itemData.get('id'));

    if(window.theme.giftWrappingProducts && window.theme.giftWrappingProducts.indexOf(item_id) > -1){
      
      if(state.cartData.items && state.cartData.items.length){
        //console.log(state.cartData);
        let itemCount = state.cartData.item_count;
        let giftItemCount = 0;
        let totalItemQty = 0;

        state.cartData.items.forEach(item => {
          if(window.theme.giftWrappingProducts.indexOf(item.variant_id) > -1){
            giftItemCount += item.quantity;
            if(item.variant_id == item_id){
              totalItemQty = Number(item.quantity) + Number(quantity);
            }
          }

          // if(window.theme.giftWrappingProducts.indexOf(item_id) > -1){
          //   totalItemQty = item.quantity + quantity;
          // }

        });

        //console.log(totalItemQty)

        let maxGiftCount = itemCount - giftItemCount;

        if(maxGiftCount < totalItemQty){
          
          let response = {
            status: 422,
            data: {
              description: window.theme.country_code == 'us' ? 'Gift wrapping is limited to ' + maxGiftCount + ' per customer.' : 'ご購入商品数(' + maxGiftCount + '点)を超えています。'
            }
          }
          
          triggerEvent('added_to_cart', {target: eventTarget, response: response});
          return false;

        }

      }

    }

    /*
    * add items to the cart.
    */    
    const cartData = Http.post('/cart/add.js', itemData)
    .then ( response => {
      // console.log(itemData)
      //alert('hoge')
      //console.log(response)
      dispatch('getCart');
      triggerEvent('added_to_cart', {target: eventTarget, response: response});
      //this.toggleDrawerCart()      
    })
    .catch(function(error) {
      //alert('test')
      //console.log(error)
      triggerEvent('added_to_cart', {target: eventTarget, response: error.response})
    });

  },
  // toggleDrawerCart({commit, state, dispatch}){
  //   const payload = {
  //     cartState: { visible: !state.cartState.visible}
  //   };    

  //   if(payload.cartState.visible){
  //     lockBG.lock();
  //   } else {
  //     //alert(spNavigation.opened)

  //     if(spNavigation.opened == false){
  //       lockBG.unlock();
  //     }
      
  //   }
  //   commit('setCartState', payload);

  //   if(ps){
  //     ps.update();
  //   } else {
  //     ps = new PerfectScrollbar('#cart-drawer__scroll-contents', {
  //       suppressScrollX: true
  //     });
  //   }

  // }
}

const mutations = { 
  setCartData: (state, payload) => {
    //let cartData = [];
    // for(let i=0;i<payload.cartData.length;i++){
    //   Vue.set(state.cartData, i, payload.cartData[i])
    // }  

    //console.log(payload.cartData)
    state.cartData = payload.cartData;
    
  },
  setAddResult: (state, payload) => {
    state.addResult = payload.addResult;
  },  
  setCartState: (state, payload) => {
    //alert('test')
    state.cartState = payload.cartState;
  },   
};

const triggerEvent = (name, data)=>{
  EventBus.$emit(name, data);
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}


import '../sass/style.scss'
import 'svgxuse'
import Vue from 'vue'
window.Vue = Vue;

import Vuex from 'vuex';
window.Vuex = Vuex;

import store from './store'
window.store = store;

const axios = require('axios');
window.axios = axios;

import {formatMoney} from './utils/functions'

Vue.filter('format_currency', function (value) {
  return formatMoney(value)
})

function requireAll(r) {
  r.keys().forEach(r);
} 

requireAll(require.context('../img/', true, /\.svg$/));

require('./components/ProductForm.js');
require('./components/CartForm.js');
require('./components/MiniCart.js');
require('./components/CartItemCount.js');
require('./components/CartPopup.js');
require('./components/Filter.js');
require('./components/ProductViewHistory.js');
require('./components/ContactForm.js');
require('./components/InqueryForm.js');
require('./script.js');



import CollectionApp from './components/Collection.vue'

if(document.getElementById('collection-app')) {
  new Vue({
    render: h => h(CollectionApp),
  }).$mount('#collection-app')
}

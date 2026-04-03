import $ from 'jquery';
import { lockBG } from '../utils/functions.js';


if(document.querySelectorAll('.filter-nav').length > 0) {

  new Vue({
    el: '.filter-nav',
    delimiters: ['${', '}'],
    store,
    data: function(){
      return {
        filterOpen: false,
        filterToolbarOpen: false,
        sortToolbarOpen: false
      }
    },
    mounted: function(){
      
      // let $description = $('.product__description-body');

      // $description.find('h3').each((i,elem)=>{
      //   let tabAry = {};

      //   tabAry.label = $(elem).html();
      //   let content = $(elem).nextUntil('h3');
      //   let $wrapper = $('<div>');
      //   $wrapper.append(content);
      //   content = $wrapper.prop('outerHTML');
      //   tabAry.content = content;
      //   this.tabs.push(tabAry);
      // });

      // $(window).on('click', (e)=>{
      //   if(!$(e.target).closest('.filters-toolbars').length && (this.filterToolbarOpen == true || this.sortToolbarOpen == true)){
      //     this.filterToolbarOpen = false;
      //     this.sortToolbarOpen = false;
      //     lockBG.unlock();
      //   }
      // })
      // this.$el.querySelector('.filter-nav__toggle-filter-button').
      // this.$el.querySelector('.filter-nav__menu').classList.add('filter-nav__menu--opened');

    },
    watch: {

    },
    methods: {
      // toggleFilterToolbar(target, $event){
      //   if(target == 'filter'){
      //     this.filterToolbarOpen = !this.filterToolbarOpen;
      //     this.sortToolbarOpen = false;
      //     if(window.matchMedia('(max-width: 900px)').matches){
      //       lockBG.toggle();
      //     }
      //   } else if(target == 'sort'){
      //     this.sortToolbarOpen = !this.sortToolbarOpen;
      //     this.filterToolbarOpen = false;
      //   }
      // },
      toggleFilter(target, $event){
        this.filterOpen = !this.filterOpen;
      },      

      submitFilter($event){
        //alert('test')
        // let tag;
        // if(!$event.currentTarget.classList.contains('selected')){
        //   tag = $event.currentTarget.getAttribute('data-tag') ? $event.currentTarget.getAttribute('data-tag') : '';
        // }
        //let tgtVariant = $event.currentTarget.getAttribute('data-variant') ? $event.currentTarget.getAttribute('data-variant') : '';
      
        // let tag_handle = $event.currentTarget.getAttribute('data-tag-handle') ? $event.currentTarget.getAttribute('data-tag-handle') : '';
        //this.$el.querySelector('[name="handle"]')
        let base_url = this.$el.getAttribute('data-base-url');
        //console.log(base_url);

        let currentURL = location.pathname;
        let param = location.search;


        currentURL = currentURL.replace(param,"");

        let tags = [];
        
        this.$el.querySelectorAll('.tag-select').forEach((elem, index)=>{
          if(elem.value){
            tags.push(elem.value);
          }
        });


        //console.log(tags);
        
        tags = tags.join('+');

        param = param ? param : '';

        tags = tags.length ? tags : '';

        // if(isBlog && tags){
        //   tags = 'tagged/' + tags;
        // }

        let sortParam = '';


        if(this.$el.querySelector('.sort-select') && this.$el.querySelector('.sort-select').value){
     
          sortParam = this.$el.querySelector('.sort-select').value;
   
          if(param){
            param = param.replace(/(sort_by=).*?(&|$)/,'$1' + sortParam + '$2');
      
          } else {
            param = '?sort_by=' + sortParam;
          }

        }
        
        base_url = tags.length ? base_url : base_url.replace('/tagged/', '');
        location.href = base_url + tags + param;

      }
    }
    
  });

}

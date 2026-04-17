import Vue from 'vue'
import $ from 'jquery'
import * as Validator from 'validatorjs';

//const title = document.querySelector('.contact-form [name="contact[title]"]') ? document.querySelector('.contact-form [name="contact[title]"]').value : '';
const name = document.querySelector('.contact-form [name="contact[name]"]') ? document.querySelector('.contact-form [name="contact[name]"]').value : '';
const name_furigana = document.querySelector('.contact-form [name="contact[name_furigana]"]') ? document.querySelector('.contact-form [name="contact[name_furigana]"]').value : '';
const email = document.querySelector('.contact-form [name="contact[email]"]') ? document.querySelector('.contact-form [name="contact[email]"]').value : '';
const phone = document.querySelector('.contact-form [name="contact[phone]"]') ? document.querySelector('.contact-form [name="contact[phone]"]').value : '';
const body = document.querySelector('.contact-form [name="contact[body]"]') ? document.querySelector('.contact-form [name="contact[body]"]').value : '';
//const agreement = document.querySelector('.contact-form [name="agreement') ? document.querySelector('.contact-form [name="agreement"]').value : '';
// select checked checkbox;
//const agreement = document.querySelector('.contact-form [name="agreement"]:checked') ? document.querySelector('.contact-form [name="agreement"]:checked').value : '';

if(document.querySelector('.tmpl--contact .site-trunk .contact-form')){
  let customerUpdateForm = document.querySelector('.tmpl--contact .site-trunk .contact-form');
  new Vue({
    el: customerUpdateForm,
    store,
    delimiters: ['${', '}'],
    data: function(){
      return {
        name: name,
        name_furigana: name_furigana,
        email: email,
        phone: phone,
        body: body,
        errors: [],
        locale: window.theme.locale ? window.theme.locale : 'ja',
        loading: false,
        submitButton: null
      }
    },
    mounted: function(){
      this.submitButton =  this.$el.querySelector('[type="submit"]');
      $(this.$el).on('submit', this.submitForm);
    },
    methods: {
      submitForm: function(e) {
   
        this.loading = true;
        
        let rules = {
          name: 'required|max:80', 
          name_furigana: 'required|katakana|max:80', 
          email: 'required|email|max:255',
          phone: 'required|max:16',
          body: 'required|max:2000',
        }

        const formData = {
          name: this.name,
          name_furigana: this.name_furigana,
          email: this.email,
          phone: this.phone,
          body: this.body,
        };


        const errorMessages = {
          "required.name": window.theme.validation.contact.name_required,
          "max.name": window.theme.validation.contact.name_max,
          "required.name_furigana": window.theme.validation.contact.name_furigana_required,
          "katakana.name_furigana": window.theme.validation.contact.name_furigana_katakana,
          "max.name_furigana": window.theme.validation.contact.name_furigana_max,
          "required.email": window.theme.validation.contact.email_required,
          "max.email": window.theme.validation.contact.email_max,
          "email.email": window.theme.validation.contact.email_format,
          "required.phone": window.theme.validation.contact.phone_required,
          "max.phone": window.theme.validation.contact.phone_max,
          "required.body": window.theme.validation.contact.body_required,
          "max.body": window.theme.validation.contact.body_max,
          //"accepted.agreement": window.theme.validation.contact.agreement_accepted,
        }
        
        Validator.register('katakana', function(value, requirement, attribute) {
          return /^[ァ-ヶー\s　]+$/.test(value);
        });
              

        const validation = new Validator(formData, rules, errorMessages);
        
        if (validation.fails()) {
          console.log('validation failed');
          e.preventDefault();
          this.loading = false;
          this.errors = validation.errors.all();

          const headerH = $('.site-header').height();
          const top = $('[id="contact_form"]').offset().top - headerH;
          $('html, body').animate({ scrollTop: top }, 500);

          return false;
        }

        return false;

      }
    }
  });

}







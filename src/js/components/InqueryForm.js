import Vue from 'vue'
import $ from 'jquery'
import * as Validator from 'validatorjs';

//const title = document.querySelector('.contact-form [name="contact[title]"]') ? document.querySelector('.contact-form [name="contact[title]"]').value : '';
const name = document.querySelector('.contact-form [name="contact[name]"]') ? document.querySelector('.contact-form [name="contact[name]"]').value : '';
const company_name = document.querySelector('.contact-form [name="contact[company_name]"]') ? document.querySelector('.contact-form [name="contact[company_name]"]').value : '';
const email = document.querySelector('.contact-form [name="contact[email]"]') ? document.querySelector('.contact-form [name="contact[email]"]').value : '';
const phone = document.querySelector('.contact-form [name="contact[phone]"]') ? document.querySelector('.contact-form [name="contact[phone]"]').value : '';
const inquiry_type = document.querySelector('.contact-form [name="contact[inquiry_type]"]') ? document.querySelector('.contact-form [name="contact[inquiry_type]"]').value : '';
const body = document.querySelector('.contact-form [name="contact[body]"]') ? document.querySelector('.contact-form [name="contact[body]"]').value : '';
//const agreement = document.querySelector('.contact-form [name="agreement') ? document.querySelector('.contact-form [name="agreement"]').value : '';
// select checked checkbox;
//const agreement = document.querySelector('.contact-form [name="agreement"]:checked') ? document.querySelector('.contact-form [name="agreement"]:checked').value : '';

if(document.querySelector('.tmpl--corporate-inquiry .site-trunk .contact-form')){
  let customerUpdateForm = document.querySelector('.tmpl--corporate-inquiry .site-trunk .contact-form');
  new Vue({
    el: customerUpdateForm,
    store,
    delimiters: ['${', '}'],
    data: function(){
      return {
        name: name,
        company_name: company_name,
        email: email,
        phone: phone,
        body: body,
        inquiry_type: inquiry_type,
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
          company_name: 'required|max:80', 
          email: 'required|email|max:255',
          phone: 'required|max:16',
          inquiry_type: 'required',
          body: 'required|max:2000',
        }

        const formData = {
          name: this.name,
          company_name: this.company_name,
          email: this.email,
          phone: this.phone,
          inquiry_type: this.inquiry_type,
          body: this.body,
          //agreement: this.agreement
        };


        const errorMessages = {
          "required.name": window.theme.validation.contact.name_required,
          "max.name": window.theme.validation.contact.name_max,
          "required.company_name": window.theme.validation.contact.company_name_required,
          "max.company_name": window.theme.validation.contact.company_name_max,
          "required.email": window.theme.validation.contact.email_required,
          "max.email": window.theme.validation.contact.email_max,
          "email.email": window.theme.validation.contact.email_format,
          "required.phone": window.theme.validation.contact.phone_required,
          "max.phone": window.theme.validation.contact.phone_max,
          "required.inquiry_type": window.theme.validation.contact.inquiry_type_required,
          "required.body": window.theme.validation.contact.body_required,
          "max.body": window.theme.validation.contact.body_max,
          //"accepted.agreement": window.theme.validation.contact.agreement_accepted,
        }

        const validation = new Validator(formData, rules, errorMessages);
        
        if (validation.fails()) {
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







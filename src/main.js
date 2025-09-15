import { createApp } from 'vue';
import './style.css';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { Form, Field, ErrorMessage } from 'vee-validate';


import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';


library.add(fas);

const app = createApp(App);


app.use(createPinia());
app.use(router);


app.component('VeeForm', Form);
app.component('VeeField', Field);
app.component('VeeErrorMessage', ErrorMessage);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
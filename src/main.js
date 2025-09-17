import { createApp } from 'vue';
import './style.css';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { Form, Field, ErrorMessage } from 'vee-validate';


// --- Font Awesome Imports ---
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faMedal, faBolt, faLeaf, faSignInAlt, faUser, faBars,
    faTimes,
    faHome,
    faCogs,
    faTags,
    faQuestionCircle,
    faInfoCircle,
    faCalendarDays,
    faHandsWash,
    faTshirt,
    faTag,
    faShirt,
    faUserTie,
    faHandsHolding,



} from '@fortawesome/free-solid-svg-icons';

// --- Swiper Imports (CSS and Components) ---
import 'swiper/css';
import 'swiper/css/pagination'; // Only import the CSS for modules you are using
import { Swiper, SwiperSlide } from 'swiper/vue';


// Add only the specific icons you need to the library
library.add(faMedal, faBolt, faLeaf, faSignInAlt, faUser, faBars,
    faTimes,
    faHome,
    faCogs,
    faTags,
    faQuestionCircle,
    faInfoCircle,
    faCalendarDays,
    faHandsWash,
    faTshirt,
    faTag,
    faShirt,
    faUserTie,
    faHandsHolding,


);

const app = createApp(App);


app.use(createPinia());
app.use(router);


app.component('VeeForm', Form);
app.component('VeeField', Field);
app.component('VeeErrorMessage', ErrorMessage);
app.component('font-awesome-icon', FontAwesomeIcon);

// Register Swiper components globally
app.component('Swiper', Swiper);
app.component('SwiperSlide', SwiperSlide);

app.mount('#app');
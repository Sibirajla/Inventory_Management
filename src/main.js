import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import './assets/css/tailwind.css';
import gAuthPlugin from 'vue3-google-oauth2';


const app = createApp(App);
app.use(router);
app.use(gAuthPlugin, {
  clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID,
  scope: 'email',
  prompt: 'consent',
})

app.use(router); // Use the router


app.mount('#app');

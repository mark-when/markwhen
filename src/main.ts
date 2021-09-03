import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import store from './store'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWzyvdh_bxpqGgmNTjTZ833Dta4_XzKeU",
  authDomain: "timelinecascade.firebaseapp.com",
  projectId: "timelinecascade",
  storageBucket: "timelinecascade.appspot.com",
  messagingSenderId: "814631906805",
  appId: "1:814631906805:web:bc719ed95ad32438bdc4bc",
  measurementId: "G-GKJKQL44VC"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

const app = createApp(App)
app.use(store)
app.mount('#app')

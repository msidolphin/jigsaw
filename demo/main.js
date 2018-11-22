import Vue from 'vue'
import App from './App.vue'
import '../dist/index.css'

const app = new Vue({
  el: '#app',
  components: {
    App
  },
  render (h) {
    return h(App)
  }
})

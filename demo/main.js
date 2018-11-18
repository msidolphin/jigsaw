import Vue from 'vue'
import App from './App.vue'
import '../src/jigsaw.css'

const app = new Vue({
  el: '#app',
  components: {
    App
  },
  render (h) {
    return h(App)
  }
})

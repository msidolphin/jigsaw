<template>
  <div ref="dom" style="position: relative;width: 310px; height: 200px;"></div>
</template>

<script>
import Jigsaw from '../dist/jigsaw.min.js'
// import Jigsaw from '@/jigsaw.js'
export default {
  mounted () {
    this.jigsaw = new Jigsaw(this.$refs.dom)
  }
}
</script>

<style>

</style>

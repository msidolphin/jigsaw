<template>
  <div ref="dom" style="position: relative"></div>
</template>

<script>
import Jigsaw from '@/jigsaw'
export default {
  mounted () {
    this.jigsaw = new Jigsaw(this.$refs.dom)
  }
}
</script>

<style>

</style>

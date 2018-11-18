<template>
  <div ref="dom" style="position: relative;width: 310px; height: 200px;"></div>
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

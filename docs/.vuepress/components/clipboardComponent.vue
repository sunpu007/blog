<template>
  <div>
    <div v-html="html" />
    <div class="quote_address">
      <p>著作权归「Jerry的博客-Jerry」所有。</p>
      <p>链接：<a :href="location">{{ location }}</a></p>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['html'],
    created() {
      this.location = window.location
    },
  }
</script>
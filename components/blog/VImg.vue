<template>
  <img :src="imgSrc()" :alt="alt" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    }
  },
  methods: {
    imgSrc() {
      if (this.src.startsWith('http')) {
        return this.src
      }
      try {
        return require(`${this.src}`);
      } catch (error) {
        return null
      }
    }
  }
}
</script>
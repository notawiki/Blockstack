<template>
  <!-- TODO: Only handle arrow keys when slides are focused, simple focus & blur events aren't working -->
  <q-carousel
    quick-nav handle-arrow-keys
    color="white"
    ref="carousel"
    :animation="1500"
  >
    <q-carousel-slide
      v-for="(slide, index) in parsedSlides"
      :key="index"
      v-html="slide"
      class="slide"
    ></q-carousel-slide>
  </q-carousel>
</template>

<script>
export default {
  props: ['html'],

  data () {
    return {
      parsedSlides: []
    }
  },

  watch: {
    html () { this.splitToSlides() },

    parsedSlides (data) {
      if (data.length < this.activeSlide + 1) {
        this.activeSlide = data.length - 1
      }
    }
  },

  methods: {
    /**
     * Create slides by splitting by horizontal lines.
     */
    splitToSlides () {
      let html = String(this.html)
      let hrRegex = /<hr[ ]*[/]*>/g

      let slides = []

      html.split(hrRegex).forEach(slide => {
        if (slide && slide !== '\n') slides.push(slide + '<br>')
      })

      if (this.$refs.carousel && this.$refs.carousel.slide >= slides.length) {
        // goto last slide if parsed slide count are less than current slide count
        this.$refs.carousel.goToSlide(slides.length - 1)
      }

      // set parsed slides
      this.parsedSlides = slides
    }
  },

  created () { this.splitToSlides() }
}
</script>

<!-- NOTE: Not scoped because of slide content being in a quasar component -->
<style lang="scss">
.slide {
  * {
    max-width: 100%;
    max-height: 50vh;
    user-select: none;
  }

  &:active {
    cursor: grabbing;
  }
}
</style>

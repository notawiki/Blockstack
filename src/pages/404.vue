<template>
  <div class="fixed-center text-center">
    <img src="statics/icon.png">

    <p class="text-faded">Sorry, nothing here...<strong>(404)</strong></p>

    <q-btn
      color="primary"
      style="width: 200px;"
      @click="$router.push('/')"
    >Home</q-btn>
  </div>
</template>

<style lang="scss" scoped>
div {
  img {
    width: 30vw;
    max-width: 10em;
  }
}
</style>

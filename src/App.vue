<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import Notification from './services/Notification'

export default {
  name: 'App',

  errorCaptured (err) {
    Notification({
      title: err.message,
      type: 'warning',
      timeout: 30000
    })
  }
}
</script>

<style lang="scss">
.aright { text-align: right; }

h1, h2, h3, h4, h5, h6 { margin: 0; }

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.75rem; }
h4 { font-size: 1.5rem; }
h5 { font-size: 1.25rem; }
h6 { font-size: 1rem; }

code {
  background-color: rgba(0, 0, 0, 0.075);
  border-radius: 3px
}

table {
  width: 100%;

  th, td {
    text-align: left;
  }
}
</style>

<template>
  <div class="row">
    <label class="col-12">Import</label>

    <q-input
      type="text"
      class="col-10"
      placeholder="{}"
      v-model="jsonImport"
    />

    <q-btn
      flat no-caps
      :disabled="!jsonImport || jsonImport.length <= 3 || !isValidJson"
      label="Import JSON"
      color="negative"
      class="col-2"
      @click="importJSON()"
    />
  </div>
</template>

<script>
import Storage from '../services/Storage'

export default {
  data () {
    return {
      jsonImport: ''
    }
  },

  computed: {
    /**
     * test JSON string for validity.
     *
     * @return {Bool}
     */
    isValidJson () {
      try {
        JSON.parse(this.jsonImport)
        return true
      } catch (e) {
        return false
      }
    }
  },

  methods: {
    /**
     * Import JSON string into local storage.
     */
    importJSON () {
      Storage.importJSON(this.jsonImport)
    }
  }
}
</script>

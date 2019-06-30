<template>
  <div class="row">
    <label class="col-12">Export</label>

    <q-input
      readonly
      type="text"
      :class="{ 'col-9': !jsonExport, 'col-8': jsonExport }"
      placeholder="{}"
      v-model="jsonExport"
    />

    <q-btn
      flat no-caps
      icon="file_copy"
      color="black"
      class="col-1"
      v-clipboard:copy="copyJsonExport"
      v-show="copyJsonExport"
    />

    <q-btn
      flat no-caps
      icon="backspace"
      color="negative"
      class="col-1"
      v-show="jsonExport"
      @click="jsonExport = null"
    />

    <q-btn
      flat no-caps
      label="Export JSON"
      color="primary"
      class="col-2"
      @click="getExport()"
    />
  </div>
</template>

<script>
import Storage from '../services/Storage'

export default {
  data () {
    return {
      jsonExport: ''
    }
  },

  methods: {
    _getExport () {
      return Storage.getExportJSON()
    },

    getExport () {
      this.jsonExport = this._getExport()
      this.copyJsonExport = this._getExport()
    }
  },

  created () {
    this.copyJsonExport = this._getExport()
  }
}
</script>

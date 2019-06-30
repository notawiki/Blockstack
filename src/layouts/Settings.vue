<template>
  <q-layout>
    <q-layout-header reveal>
      <q-toolbar>
        <q-btn
          dense flat round
          icon="chevron_left"
          color="white"
          @click="$router.push('/')"
        />
      </q-toolbar>
    </q-layout-header>

    <q-page-container class="q-pa-md">
      <h1>{{ packageInfo.productName }}</h1>

      <br>

      <!-- REPLACE -->
      <div class="row">
        <label class="col-6">Replace</label>

        <div class="col-6 aright">
          <q-toggle
            label="Replace"
            v-model="settings.replace"
          />
        </div>

        <!-- NOTE: List of all replace chars -->
        <div
          class="col-12 col-xs-6 col-sm-4 col-md-3 col-xl-2 q-mb-xs"
          v-for="(value, index) in settings.replaceList"
          :key="index"
        >
          <code>{{ index }}</code> - {{ value }}
        </div>
      </div>

      <br>

      <!-- IMPORT -->
      <json-import></json-import>

      <br>

      <!-- EXPORT -->
      <json-export></json-export>
    </q-page-container>
  </q-layout>
</template>

<script>
import JsonExport from '../components/JsonExport'
import JsonImport from '../components/JsonImport'
import Mousetrap from 'mousetrap'
import Storage from '../services/Storage'

export default {
  components: {
    JsonExport,
    JsonImport
  },

  data () {
    return {
      packageInfo: require('../../package.json'),

      settings: Storage.load('settings')
    }
  },

  watch: {
    settings: {
      deep: true,
      handler () { Storage.save('settings', this.settings) }
    }
  },

  created () {
    Mousetrap.bind('option+s', () => {
      this.$router.push('/')
      return false
    })
  }
}
</script>

<style>
</style>

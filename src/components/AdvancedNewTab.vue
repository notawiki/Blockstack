<template>
  <q-context-menu>
    <q-list link separator>
      <q-item
        v-close-overlay
        @click.native="addTab({})"
      >
        <q-item-main label="New Tab" />
      </q-item>
      <q-item
        v-close-overlay
        @click.native="openPasteDialog()"
      >
        <q-item-main label="Add by JSON" />
      </q-item>
    </q-list>
  </q-context-menu>
</template>

<script>
import Notification from '../services/Notification'

export default {
  props: ['addTab'],

  methods: {
    openPasteDialog () {
      this.$q.dialog({
        title: 'Paste JSON',
        ok: true,
        cancel: true,

        prompt: {
          type: 'text'
        }
      })
        .then(data => {
          if (data) {
            try {
              let tab = JSON.parse(String(data))
              this.addTab(tab)
            } catch (e) {
              Notification({ title: 'Error importing JSON', type: 'negative' })
            }
          }
        })
    }
  }
}
</script>

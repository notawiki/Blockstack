<template>
  <q-context-menu>
    <q-list link separator>
      <q-item
        v-close-overlay
        @click.native="renameTab()"
      >
        <q-item-main label="Rename" />
      </q-item>

      <q-item
        v-close-overlay
        @click.native="previewTab()"
      >
        <q-item-main label="Preview" />
      </q-item>

      <q-item
        v-close-overlay
        @click.native="archiveTab()"
      >
        <q-item-main label="Archive" sublabel="Ctrl + W" />
      </q-item>

      <q-item
        v-close-overlay
        @click.native="removeTab()"
      >
        <q-item-main label="Remove" />
      </q-item>
    </q-list>
  </q-context-menu>
</template>

<script>
export default {
  methods: {
    renameTab () { this.$emit('rename') },

    previewTab () { this.$emit('preview') },

    archiveTab () { this.$emit('archive') },

    removeTab () { this.$emit('close') }
  }
}
</script>

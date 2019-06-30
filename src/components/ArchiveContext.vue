<template>
  <q-context-menu>
    <q-list link separator>
      <q-item
        v-close-overlay
        @click.native="previewTab()"
      >
        <q-item-main label="Preview" />
      </q-item>
    </q-list>
  </q-context-menu>
</template>

<script>
export default {
  methods: {
    previewTab () { this.$emit('preview') }
  }
}
</script>

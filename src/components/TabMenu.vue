<template>
  <div id="tabmenu-container" class="q-pr-sm q-py-md animated fadeInLeft">
    <div class="q-py-sm q-pr-xl">

      <!-- ROWS -->
      <div class="row">
        <div
          class="col-12 header"
          v-show="tabs.length >= 1"
        >
          Tabs
        </div>
      </div>

      <draggable
        class="row"
        v-model="computedTabs"
      >
        <div
          class="col-12"
          :class="{
            'active': isActive(index),
            'shadow-2': isActive(index),
            'bg-primary': isActive(index)
          }"
          v-for="(tab, index) in tabs"
          :key="`tab-${index}`"
          @click="setActiveTab(Number(index))"
        >
          <q-icon name="insert_drive_file" />

          <i
            class="animated zoomIn"
            v-if="showTooltip && (Number(index) + 1 <= 10)"
          >
            {{ index !== 9 ? index + 1 : 0 }}
          </i>

          {{ tab.name }}

          <tab-context
            @rename="renameTab(Number(index))"
            @preview="previewTab(tab)"
            @archive="archiveTab(Number(index))"
            @close="removeTab(Number(index))"
          />
        </div>
      </draggable>

      <div class="row">
        <div
          class="col-12 header hr"
          v-show="archived.length >= 1 && tabs.length !== 0"
        ></div>

        <div
          class="col-12 header"
          v-show="archived.length >= 1"
        >
          Archive
        </div>
      </div>

      <draggable
        class="row"
        v-model="computedArchived"
      >
        <div
          class="col-12"
          v-for="(note, index) in archived"
          :key="`archive-${index}`"
          @click="restoreArchivedTab(Number(index))"
        >
          <q-icon name="archive" />

          {{ note.name }}

          <archive-context
            @preview="previewTab(note)"
          />
        </div>
      </draggable>
      <!-- END ROWS -->

    </div>

    <q-modal v-model="showPreview">
      <markdown-preview
        v-if="showPreview && tabToPreview"
        :tab="tabToPreview"
        class="q-pa-xl"
      />
    </q-modal>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import MarkdownPreview from '../pages/MarkdownPreview'
import Mousetrap from 'mousetrap'
import ArchiveContext from './ArchiveContext'
import TabContext from './TabContext'

export default {
  components: {
    Draggable,
    MarkdownPreview,
    ArchiveContext,
    TabContext
  },

  props: ['tabs', 'activeTab', 'save', 'setActiveTab', 'archiveTab', 'removeTab', 'archived', 'restoreArchivedTab'],

  data () {
    return {
      showTooltip: false,
      showPreview: false,
      tabToPreview: null
    }
  },

  computed: {
    computedTabs: {
      get () { return this.tabs },
      set (val) { this.$emit('update:tabs', val) }
    },

    computedArchived: {
      get () { return this.archived },
      set (val) { this.$emit('update:archived', val) }
    }
  },

  methods: {
    isActive (tabIndex) { return this.activeTab === Number(tabIndex) },

    previewTab (tab) {
      this.tabToPreview = tab
      this.showPreview = true
    },

    renameTab (index) {
      this.$q.dialog({
        title: 'Rename Tab',
        ok: true,
        cancel: true,

        prompt: {
          model: this.tabs[index].name,
          type: 'text'
        }
      })
        .then(data => {
          this.tabs[index].name = data
          this.save()
        })
    }
  },

  created () {
    Mousetrap.bind('option', () => {
      this.showTooltip = true

      if (this.tooltipTimeoout) clearTimeout(this.tooltipTimeoout)

      this.tooltipTimeoout = setTimeout(() => {
        this.showTooltip = false
      }, 5000)
    }, 'keydown')

    Mousetrap.bind('option', () => { this.showTooltip = false }, 'keyup')
  }
}
</script>

<style lang="scss" scoped>
#tabmenu-container {
  width: 100%; // TODO: maybe remove this
  user-select: none;

  // Tab items
  .col-12 {
    width: 100%;
    padding: 4px 0;
    padding-left: 12px;

    border-bottom-right-radius: 20px;
    border-top-right-radius: 20px;

    &.header {
      font-style: italic;
      color: darken(grey, 20%);

      &.hr {
        border-bottom: 1px solid lightgrey;
        margin-bottom: 8px;
      }
    }
    &:hover:not(.header) {
      cursor: pointer;
      background-color: lighten(#027be3, 50%);
    }

    &.active {
      // background-color: #027be3;
      color: #ffffff;

      &:hover {
        background-color: darken(#027be3, 3%);
      }
    }
  }
}
</style>

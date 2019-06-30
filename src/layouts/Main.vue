<template>
  <q-layout>
    <q-layout-header reveal>
      <q-toolbar>
        <q-btn
          flat round dense
          color="white"
          icon="add"
          label="New Tab"
          v-show="tabs.length === 0"
          @click="addTab({})"
        >
          <advanced-new-tab :add-tab="addTab" />
        </q-btn>
        <q-btn
          flat round dense
          color="white"
          icon="add"
          v-show="tabs.length > 0"
          @click="addTab({})"
          >
            <advanced-new-tab :add-tab="addTab" />
          </q-btn>

        <q-btn
          flat round dense
          color="white"
          class="q-ml-sm"
          icon="save"
          @click="save()"
        />

        <q-btn-group
          flat round dense
          class="q-ml-sm"
        >
          <q-btn
            flat round dense
            icon="list"
            :color="panes.tabMenu ? 'white' : 'dark'"
            @click="togglePane('tabMenu')"
          />

          <q-btn
            flat round dense
            icon="edit"
            :color="panes.editor ? 'white' : 'dark'"
            @click="togglePane('editor')"
          />

          <q-btn
            flat round dense
            icon="visibility"
            :color="panes.preview ? 'white' : 'dark'"
            @click="togglePane('preview')"
          />
        </q-btn-group>

        <q-toolbar-title></q-toolbar-title>

        <q-btn
          flat round dense
          color="white"
          class="q-ml-sm"
          v-if="tabs[activeTab] && tabs.length >= 1"
        >
          <q-icon name="share"/>
          <export :tab="tabs[activeTab]" />
        </q-btn>

        <q-btn
          flat round dense
          color="white"
          class="q-ml-sm"
        >
          <q-icon name="menu"/>
          <q-popover>
            <q-list separator link>
              <q-item v-close-overlay @click.native="$router.push('/settings')">
                Settings
              </q-item>

              <q-item>
                Debug
                <debug />
              </q-item>

              <q-item v-close-overlay @click.native="shortcutsModal = true">
                Shortcuts

                <q-modal v-model="shortcutsModal">
                  <div class="q-pa-md">
                    <shortcuts />
                    <div style="text-align: right;">
                      <q-btn
                        flat
                        color="primary"
                        @click="shortcutsModal = false"
                      >Close</q-btn>
                    </div>
                  </div>
                </q-modal>
              </q-item>

              <q-item v-close-overlay @click.native="aboutModal = true">
                About

                <q-modal v-model="aboutModal">
                  <div class="q-pa-md">
                    <about :packageInfo="packageInfo" />
                    <div style="text-align: right;">
                      <q-btn
                        flat
                        color="primary"
                        @click="aboutModal = false"
                      >Close</q-btn>
                    </div>
                  </div>
                </q-modal>
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer side="left" v-model="panes.tabMenu">
      <tab-menu
        :tabs.sync="tabs"
        :active-tab="activeTab"
        :save="save"
        :set-active-tab="setActiveTab"
        :archive-tab="archiveTab"
        :remove-tab="removeTab"

        :archived.sync="archived"
        :restore-archived-tab="restoreArchivedTab"
      />
    </q-layout-drawer>

    <q-page-container class="row">

      <!-- EDITOR -->
      <transition appear enter-active-class="animated fadeIn">
        <div class="col q-pa-md" v-if="panes.editor">
          <div v-for="(tab, index) in tabs"
               :key="index"
          >
            <edit-input :content="tab.content"
                        :index="Number(index)"
                        @update="setTabContent(index, $event)"
                        v-if="tabs[activeTab] && activeTab === Number(index)"
            />
          </div>
        </div>
      </transition>
      <!-- END EDITOR -->

      <!-- PREVIEW -->
      <transition appear enter-active-class="animated fadeIn">
        <div class="col q-pa-md" v-if="panes.preview">
          <div v-for="(tab, index) in tabs" :key="index">
            <markdown-preview :tab="tab"
                              :id="'preview-' + index"
                              v-if="tabs[activeTab] && activeTab === Number(index)"
            />
          </div>
        </div>
      </transition>
      <!-- END PREVIEW -->

      <!-- NONE -->
      <transition appear enter-active-class="animated fadeIn">
        <div class="col" v-if="!panes.editor && !panes.preview">
          <div class="absolute-center" style="text-align: center;">
            <h4 style="color: lightgrey"> {{ randomFact }} </h4>
          </div>
        </div>
      </transition>
      <!-- END NONE -->

      <q-fab
        color="primary"
        text-color="white"
        class="fixed animated fadeInUp"
        style="right: 10px; bottom: 10px;"
        icon="keyboard_arrow_left"
        direction="left"
      >
        <q-fab-action
          icon="assistant"
          color="primary"
          text-color="white"
          @click="applyMarkdownStyle()"
        >
          <q-tooltip>
            Prettify
          </q-tooltip>
        </q-fab-action>

        <q-fab-action
          icon="slideshow"
          :color="tabs[activeTab].slide ? 'warning' : 'primary'"
          text-color="white"
          @click="toggleSlides()"
          v-if="tabs[activeTab] && Object.keys(tabs[activeTab]).includes('slide')"
        >
          <q-tooltip>
            Toggle Presentation
          </q-tooltip>
        </q-fab-action>
      </q-fab>

      <q-modal v-model="searchModal">
        <div class="q-pa-md">
          <transition appear
                      leave-active-class="animated fadeOut"
                      enter-active-class="animated fadeIn"
          >
            <search v-if="searchModal"
                    :tabs="tabs"
                    :archive="archived"
                    :activetab="activeTab"
                    @activetab="setActiveTab($event)"
                    @restorearchivedtab="restoreArchivedTab($event)"
                    @togglemodal="searchModal = !searchModal"
            ></search>
          </transition>
        </div>
      </q-modal>

    </q-page-container>
  </q-layout>
</template>

<script>
import About from '../pages/About'
import AdvancedNewTab from '../components/AdvancedNewTab'
import Debug from '../pages/Debug'
import EditInput from '../pages/EditInput'
import Essential from '../services/Essential'
import Export from '../pages/Export'
import Markdown from '../services/Markdown'
import MarkdownPreview from '../pages/MarkdownPreview'
import Mousetrap from 'mousetrap'
import Notification from '../services/Notification'
import RandomFacts from 'random-facts'
import Search from '../pages/Search'
import Shortcuts from '../pages/Shortcuts'
import StartupHandler from '../services/StartupHandler'
import Storage from '../services/Storage'
import TabMenu from '../components/TabMenu'

export default {
  components: {
    About,
    AdvancedNewTab,
    Debug,
    EditInput,
    Export,
    MarkdownPreview,
    Search,
    Shortcuts,
    TabMenu
  },

  data () {
    return {
      packageInfo: require('../../package.json'),

      shortcutsModal: false,
      aboutModal: false,
      searchModal: false,

      activeTab: 0,
      panes: {
        tabMenu: true,
        editor: true,
        preview: true
      },

      randomFact: null,

      settings: {},

      tabs: [],
      archived: []
    }
  },

  methods: {
    setActiveTab (tabIndex) {
      tabIndex = Number(tabIndex)
      if (!this.tabs[tabIndex]) {
        return
      }

      // Reset events to not duplicate them
      this.$root.$off('content-updated')
      this.$root.$off('content-paste')

      // close tab menu on mobile
      if (this.panes.tabMenu && this.$q.platform.is.mobile) this.togglePane('tabMenu')
      this.activeTab = tabIndex
    },

    addTab ({ name = 'Unamed Tab', content = '' }) {
      let data = Essential.add({
        name: name,
        content: content
      })

      this.setActiveTab(Number(this.tabs.push(data)) - 1)

      this.save()
    },

    removeTab (index) {
      this.activeTab = Number(index - 1)

      this.tabs[index].slide = false

      this.$nextTick(() => {
        if (this.activeTab <= 0) {
          this.activeTab = null
        }

        this.tabs.splice(Number(index), 1)

        this.save()
      })
    },

    archiveTab (index) {
      index = Number(index)
      this.archived.push(this.tabs[index])
      this.activeTab = index - 1
      this.tabs.splice(index, 1)

      this.save()
    },

    restoreArchivedTab (index) {
      index = Number(index)
      if (this.archived[index]) {
        this.tabs.push(this.archived[index])
        this.activeTab = this.tabs.length - 1
        this.archived.splice(index, 1)

        this.save()
      }
    },

    togglePane (paneName) {
      let settings = Storage.load('settings')

      this.panes[paneName] = this.panes[paneName] ? !this.panes[paneName] : true
      settings.panes = this.panes

      Storage.save('settings', settings)
    },

    save () {
      Storage.save('archived', this.archived)
      Storage.save('tabs', this.tabs)
    },

    setTabContent (tabIndex, content) {
      this.tabs[tabIndex].content = content
    },

    applyMarkdownStyle () {
      let content = this.tabs[this.activeTab].content

      // Replace chars with unicode chars, if enabled
      if (this.settings.replace) {
        let strings = this.settings.replaceList

        for (let string in strings) {
          while (content.indexOf(string) !== -1) {
            content = content.replace(string, strings[string])
          }
        }

        console.time('Superscript')
        let superscriptChars = {
          '0': '⁰',
          '1': '¹',
          '2': '²',
          '3': '³',
          '4': '⁴',
          '5': '⁵',
          '6': '⁶',
          '7': '⁷',
          '8': '⁸',
          '9': '⁹',
          '-': '⁻'
        }
        content = content.replace(/\(\^[0-9-]{1,10}\)/g, match => {
          let out = ''

          // Loop over string and replace chars that are replaceable
          for (let charOfMatch of match) {
            out += superscriptChars[charOfMatch] || ''
          }

          console.log(`Superscript Replace: Got '${match}' and made '${out}'`)

          return out
        })
        console.timeEnd('Superscript')
      }

      content = Markdown.applyStyle(content)

      this.tabs[this.activeTab].content = String(content)

      this.$root.$emit('content-updated')
    },

    toggleSlides () {
      let activeTab = this.tabs[this.activeTab]
      activeTab.slide = !activeTab.slide

      // Slide is active
      if (activeTab.slide) {
        // Disable editor
        if (this.panes.editor) {
          this.togglePane('editor')
        }

        // Enable Preview
        if (!this.panes.preview) {
          this.togglePane('preview')
        }
      } else {
        // Enable Editor
        if (!this.panes.editor) {
          this.togglePane('editor')
        }

        // Disable Preview
        if (this.panes.preview) {
          this.togglePane('preview')
        }
      }
    },

    paste (str) {
      let data = {
        index: this.activeTab,
        data: str
      }

      // Emit datato paste
      this.$emit('content-paste', data)
    },

    setRandomFact () { this.randomFact = RandomFacts.randomFact() }
  },

  created () {
    StartupHandler()

    this.tabs = Storage.load('tabs')

    this.archived = Storage.load('archived')

    this.settings = Storage.load('settings')
    this.panes = this.settings.panes

    Mousetrap.bind('ctrl+s', () => {
      this.save()
      Notification({ title: 'Saved', type: 'info' })
      return false
    })
    Mousetrap.bind('ctrl+p', () => {
      this.applyMarkdownStyle()
      Notification({ title: 'Beautified', type: 'info' })
      return false
    })
    Mousetrap.bind('ctrl+shift+s', () => {
      this.applyMarkdownStyle()
      this.save()
      Notification({ title: 'Saved and Beautified', type: 'info' })
    })

    Mousetrap.bind('ctrl+shift+n', () => {
      this.addTab({})
      return false
    })
    Mousetrap.bind('ctrl+shift+w', () => {
      this.archiveTab(Number(this.activeTab))
      return false
    })
    Mousetrap.bind('ctrl+q', () => { window.close() })

    Mousetrap.bind('option+up', () => {
      this.setActiveTab(this.activeTab - 1)
      return false
    })
    Mousetrap.bind('option+down', () => {
      this.setActiveTab(this.activeTab + 1)
      return false
    })

    Mousetrap.bind('option+left', () => {
      this.togglePane('editor')
      return false
    })
    Mousetrap.bind('option+right', () => {
      this.togglePane('preview')
      return false
    })
    Mousetrap.bind('option+s', () => {
      this.$router.push('/settings')
      return false
    })

    Mousetrap.bind('ctrl+space', () => { this.searchModal = !this.searchModal })

    for (let i = 1; i <= 10; i++) {
      let tabIndex = i - 1
      let tabKey = i === 10 ? 0 : i
      Mousetrap.bind(`option+${tabKey}`, () => {
        this.setActiveTab(tabIndex)
        return false
      })
    }

    this.setRandomFact()
    setInterval(this.setRandomFact, 10 * 1000)
  }
}
</script>

<style lang="scss" scoped></style>

<template>
  <div id="editor-root" class="shadow-1 q-pa-md">
    <p
      id="editor"
      ref="editor"
      class="editor mousetrap"
      contenteditable="true"
      @input="update"
      @keydown.tab.prevent
    ></p>

    <q-modal v-model="tableCreator">
      <div class="q-pa-md">
        <table-creator @tablecreate="paste($event)"
                       @closemodal="tableCreator = false"
        >
        </table-creator>
      </div>
    </q-modal>

    <q-btn
      dense flat
      id="bottom-btn"
      ref="bottomBtn"
      icon="expand_more"
      :text-color="stickyBottom ? 'positive' : 'dark'"
      @click="stickyBottom = !stickyBottom"
    >
      <q-tooltip>
        Keep Page bottom in view
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
import Editor from '../services/Editor'
import Mousetrap from 'mousetrap'
import TableCreator from '../components/TableCreator'

export default {
  components: {
    TableCreator
  },

  props: ['content', 'index'],

  data () {
    return {
      activeKeys: {},
      tableCreator: false,

      stickyBottom: false
    }
  },

  watch: {
    stickyBottom (stickyBottom) {
      if (this.stickyBottomInterval) clearInterval(this.stickyBottomInterval)

      if (stickyBottom) {
        // Enable sticky bottom
        this.stickyBottomInterval = setInterval(() => {
          this.$refs.bottomBtn.$el.scrollIntoView(true, { behavior: 'smooth' })
        }, 200)
      }
    }
  },

  methods: {
    /**
     * Set text in editor.
     */
    setText () {
      console.time('Display Text')

      this.$nextTick(() => {
        let input = this.$refs.editor

        // Reset content of the editor
        input.innerHTML = null

        // Get html from markdown for editor
        let rows = Editor.getElements(this.content)
        input.innerHTML = rows.join('')

        console.timeEnd('Display Text')
      })
    },

    /**
     * Inform parent about change.
     *
     * @param {Object} event
     */
    update (event) {
      // Send the content of the contenteditable div as plain text without div elements
      this.$emit('update', event.target.innerText + '\n')
    },

    /**
     * Paste a string like its from clipboard.
     *
     * @param {String} data
     */
    paste (data) {
      let sel = window.getSelection()

      if (sel.getRangeAt && sel.rangeCount) {
        let range = sel.getRangeAt(0)
        range.deleteContents()

        let el = document.createElement('div')
        el.innerHTML = data

        let frag = document.createDocumentFragment()
        let lastNode = frag.appendChild(el.firstChild)

        range.insertNode(frag)

        if (lastNode) {
          range = range.cloneRange()
          range.setStartAfter(lastNode)
          range.collapse(true)

          sel.removeAllRanges()
          sel.addRange(range)
        }
      }

      this.$emit('update', this.$refs.editor.innerText + '\n')
    }
  },

  created () {
    this.$nextTick(() => { this.$refs.editor.focus() })

    Mousetrap.bind('ctrl+b', () => {
      this.$refs.editor.focus()
      this.tableCreator = true
    })

    Mousetrap.bind('tab', () => {
      this.$refs.editor.focus()
      this.paste('    ')
    })

    // Parse markdown and display it
    this.setText()
    this.$root.$on('content-updated', this.setText)

    // Listen for paste events
    this.$root.$on('content-paste', data => {
      // Check if this tab is the target
      if (data.index === this.index) this.paste(String(data.data))
    })
  },

  beforeDestroy () {
    if (this.stickyBottomInterval) clearInterval(this.stickyBottomInterval)
  }
}
</script>

<style lang="scss">
/* TODO: Only apply padding at bottom if text reaches point where its
necessary to avoid scrollbar on the right */
#editor-root {
  overflow-x: hidden;
  margin-bottom: 30vh;
  // text-shadow: -1px 0 rgb(200, 200, 200), 0 1px rgb(200, 200, 200), 1px 0 rgb(200, 200, 200), 0 -1px rgb(200, 200, 200);

  #bottom-btn {
    width: 100%;
    min-height: 5vh;
  }

  #editor {
    // p container
    outline: none;
    margin: 0px;
    padding-bottom: 15px;
    cursor: text;

    // p content
    color: black;
    font-size: 1.1em;

    // Fix for caret jumping over elements with different display values
    h1, h2, h3, h4, h5, h6, blockquote {
      display: inline;
    }

    // Fix for inline styles in code tags
    code {
      mark, b, i, s {
        background-color: transparent;
        font-weight: normal;
        font-style: normal;
        text-decoration: none;
      }
    }

    &, * {
      white-space: pre-wrap; // Allow multiple spaces
      word-wrap: break-word; // Break after text hits line end
      font-family: monospace;
      max-width: 100%;

      img {
        max-height: 70vh;
      }
    }
  }

}
</style>

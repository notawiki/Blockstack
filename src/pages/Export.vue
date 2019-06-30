<template>
  <q-popover>
    <q-list separator link>
      <q-item
        v-close-overlay
        @click.native="exportToTxt()"
      >
        <q-item-main label="Text" />
      </q-item>
      <q-item
        v-close-overlay
        @click.native="exportToHTML()"
      >
        <q-item-main label="HTML" />
      </q-item>
      <q-item
        v-close-overlay
        @click.native="exportToPDF()"
      >
        <q-item-main label="PDF" />
      </q-item>
      <q-item
        v-close-overlay
        v-clipboard:copy="json"
        v-clipboard:success="exportToJSONEvent"
      >
        <q-item-main label="JSON" />
      </q-item>
    </q-list>
  </q-popover>
</template>

<script>
import FileSaver from 'file-saver'
import Markdown from '../services/Markdown'
import Notification from '../services/Notification'

export default {
  props: ['tab'],

  computed: {
    json () {
      return JSON.stringify(this.tab)
    }
  },

  methods: {
    exportToTxt () {
      FileSaver.saveAs(
        new Blob(
          [ this.tab.content ],
          { type: 'text/plain;charset=utf-8' }
        ),
        this.tab.name + '.txt'
      )
    },

    exportToHTML () {
      FileSaver.saveAs(
        new Blob(
          [ Markdown.generateHtmlPage(this.tab.content, this.tab.name) ],
          { type: 'text/plain;charset=utf-8' }
        ),
        this.tab.name + '.html'
      )
    },

    exportToPDF () {
      let page = new Blob(
        [ Markdown.generateHtmlPage(this.tab.content, this.tab.name, true) ],
        { type: 'text/html;charset=utf-8' }
      )

      let url = URL.createObjectURL(page)

      let iframe = document.createElement('iframe')
      iframe.setAttribute('src', url)
      iframe.setAttribute('style', 'display: none;')
      document.body.appendChild(iframe)

      setTimeout(() => {
        iframe.remove()
        URL.revokeObjectURL(url)
      }, 1000)
    },

    exportToJSONEvent () {
      Notification({ title: 'Copied JSON to clipboard', type: 'positive' })
    }
  }
}
</script>

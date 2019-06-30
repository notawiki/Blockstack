// import { remote } from 'electron'

import Config from '../Config'
import Notification from '../Notification'
import Essential from '../Essential'

export default {
  /**
   * Register of all available DB items and their default values
   */
  structure: {
    appData: {
      version: null
    },
    settings: {
      replace: false,
      replaceList: {
        '(=>)': '➡',
        '(<=)': '⬅',
        '(up)': '⬆',
        '(down)': '⬇',
        '(<=>)': '⬅➡',
        '(check)': '✔',
        '(x)': '❌',
        '(--)': '⎼⎼',

        // Greek letters
        '(alpha)': 'α',
        '(omega)': 'Ω',
        '(phi)': 'φ',
        '(lamnda)': 'λ',

        // Mathematical chars
        '(freq)': '⨍',
        '(root)': '√',
        '(pi)': 'π',

        // Example for superscript usage:
        '1(^2)': '1²'
      },
      panes: {
        tabMenu: true,
        editor: true,
        preview: false
      },
      search: {
        tabs: true,
        archived: true
      }
    },
    tabs: [],
    archived: [],
    debug: {}
  },

  _welcomeTab: Essential.add({
    name: 'Welcome',
    content: [
      '# Welcome',
      '',
      '> Vuenote supports full Markdown syntax.',
      '',
      '* * *',
      '',
      '## Typography',
      '',
      '| Name              | Usage        |',
      '| ----------------- | ------------ |',
      '| *Italic*          | `*Text*`     |',
      '| **Strong**        | `**Text**`   |',
      '| ~~Strikethrough~~ | `~~Text~~`   |',
      '| > Blockquote      | `> Text`     |',
      '| """Marked Text""" | `"""Text"""` |',
      '',
      '## Lists',
      '',
      '-   List Item',
      '    -   Child Item',
      '',
      '## Links',
      '',
      '[Vuenote Website](https://exng.gitlab.io/vuenote)',
      '',
      '## Images',
      '',
      '![Vuenote Logo](https://gitlab.com/exng/vuenote/raw/master/src/statics-src/vuenote_screenshot.png)',
      '',
      '## Tables',
      '',
      '| Normal | Centered | Right aligned |',
      '| ------ | :------: | ------------: |',
      '| Text   |   Text   |          Text |',
      '',
      '## Superscript',
      '',
      '`a^123` becomes `a¹²³`',
      '',
      '* * *',
      '',
      'This is just a short introduction to Markdown, take a look at the [Common Mark Specification](https://commonmark.org/help/) for more in depth information.',
      ''
    ].join('\n')
  }),
  _archivedTabExample: Essential.add({
    name: 'The cake is a lie!',
    content: [
      '# The cake is a lie!',
      ''
    ].join('\n')
  }),

  getStructur () { return Essential.clone(this.structure) },

  /**
   * Initiate the DB
   *
   * @return {Bool}
   */
  init () {
    try {
      // set all items with their default value
      for (let name in this.getStructur()) {
        let value = this.getStructur()[name]

        if (name === 'tabs') {
          value.push(this._welcomeTab)
        } else if (name === 'archived') {
          value.push(this._archivedTabExample)
        }

        this.save(name, value)
      }

      // success
      return true
    } catch (e) {
      // error
      return false
    }
  },

  /**
   * Get item from DB or from structure if not set yet
   *
   * @param {String} name
   *
   * @return {String}
   */
  load (name) {
    let value = Config.get(name)

    // check if item is already set
    if (!value) {
      // no return default value if set
      let newValue = this.getStructur()[name]

      // save item with default value
      this.save(name, newValue)

      return newValue
    } else {
      // item is set, return its value
      return JSON.parse(Config.get(name))
    }
  },

  /**
   * Save value of item
   *
   * @param {String} name
   * @param {String} value
   *
   * @return {Bool}
   */
  save (name, value) {
    try {
      // save and return true
      Config.set(name, JSON.stringify(value))
      return true
    } catch (e) {
      // something went wrong while saving
      Notification({
        title: 'Error while saving notes!',
        description: 'The problem is most likely that you ran out of space.',
        type: 'negative'
      })
      return false
    }
  },

  /**
   * Remove item from DB
   *
   * @param {String} value
   *
   * @return {Bool}
   */
  unset (name) {
    // check if item exists
    if (this.load(name)) {
      // yes, remove it
      Config.unset(name)
      return true
    } else {
      // item does not exist in DB
      return false
    }
  },

  /**
   * Export structure as JSON
   *
   * @return {String}
   */
  getExportJSON () {
    let data = {}

    try {
      // add all items to data
      for (let name in this.getStructur()) {
        data[name] = this.load(name)
      }

      // turn into JSOn and return it
      return JSON.stringify(data)
    } catch (e) {
      // error
      return null
    }
  },

  /**
   * Import structure from JSON
   *
   * @param {String} jsonData
   *
   * @return {Bool}
   */
  importJSON (jsonData) {
    let data = {}

    try {
      data = JSON.parse(jsonData)

      for (let name in data) {
        let value = data[name]

        this.save(name, value)
      }

      location.reload()
      return true
    } catch (e) {
      console.log('Error importing JSON')
      return false
    }
  }
}

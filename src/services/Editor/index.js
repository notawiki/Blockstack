const URLregex = require('url-regex')()

export default {
  /**
   * Parse editor content and return list of html strings
   *
   * @param {String} content
   * @return {Array}
   */
  getElements (content) {
    console.time('Parse MD')

    // Split content into array by row
    content = content.split('\n')

    let rows = []
    for (let line of content) {
      let row = [
        // '<span>',
        this.getHTMLStringFromLine(line + '\n')
        // '</span>'
      ]
      rows.push(row.join(''))
    }

    console.timeEnd('Parse MD')
    return rows
  },

  /**
   * Get HTML string from markdown line.
   *
   * @param {String} line
   * @return {String}
   */
  getHTMLStringFromLine (line) {
    if (/^# /.test(line)) { // #
      return this.getHeadingString(line, 'h1')
    } else if (/^## /.test(line)) { // ##
      return this.getHeadingString(line, 'h2')
    } else if (/^### /.test(line)) { // ###
      return this.getHeadingString(line, 'h3')
    } else if (/^#### /.test(line)) { // ####
      return this.getHeadingString(line, 'h4')
    } else if (/^##### /.test(line)) { // #####
      return this.getHeadingString(line, 'h5')
    } else if (/^###### /.test(line)) { // ######
      return this.getHeadingString(line, 'h6')
    } else if (/^> [^\n]*\n/.test(line)) { // blockquote
      return this.getBlockquoteString(line)
    } else if (/!\[[^\]]+\]\([^\\]+\)/.test(line)) { // image
      return this.getImageString(line)
    } else if (/^\* \* \*/.test(line)) { // hr
      return this.getHrString(line)
    }

    return this.getInlineStyle(line)
  },

  /**
   * Get HTML bold, italic, strikethrough and link string from markdown line.
   *
   * @param {String} line
   * @return {String}
   */
  getInlineStyle (line) {
    // Bold text
    line = line.replace(/\*\*[^*]+\*\*/g, match => {
      return `<b>${match}</b>`
    })

    // Italic text
    line = line.replace(/\*[^*]+\*[^*]/g, match => {
      return `<i>${match}</i>`
    })

    // Strikethrough text
    line = line.replace(/~~[^~]+~~/g, match => {
      return `<s>${match}</s>`
    })

    // inline code text
    line = line.replace(/`[^`]+`/g, match => {
      return `<code>${match}</code>`
    })

    // inline mark text
    line = line.replace(/"""[^"""]+"""/g, match => {
      return `<mark>${match}</mark>`
    })

    // url text
    line = line.replace(URLregex, match => {
      let lastChar = ''
      // Fix last char of url being mardown
      if (/[^>)]+[>)]{1}/g.test(match)) {
        // last char would be either '>' or ')'
        lastChar = match.substring(match.length - 1, match.length)
        match = match.substring(0, match.length - 1)
      }

      return `<a href="${match}">${match}</a>${lastChar}`
    })

    return line
  },

  /**
   * Get HTML heading string from markdown heading line.
   *
   * @param {String} line
   * @param {String} headingType
   * @return {String}
   */
  getHeadingString (line, headingType) {
    return '' +
    `<${headingType}>` +
    this.getInlineStyle(line) +
    `</${headingType}>`
  },

  /**
   * Get HTML heading string from markdown heading line.
   *
   * @param {String} line
   * @return {String}
   */
  getBlockquoteString (line) {
    return `` +
    '<blockquote>' +
    this.getInlineStyle(line) +
    '</blockquote>'
  },

  /**
   * Get HTML img string from markdown image line.
   *
   * @param {String} line
   * @return {String}
   */
  getImageString (line) {
    let imgSrc = line.match(/http[^)]+/)[0]

    return '' +
    '<div>' +
    `<div contenteditable="false">` +
    `<img class="shadow-4 q-ma-md" style="display: block;" src="${imgSrc}">` +
    `</div>` +
    this.getInlineStyle(line) +
    '</div>'
  },

  /**
   * Get HTML hr string from markdown hr line.
   *
   * @param {String} line
   * @return {String}
   */
  getHrString (line) {
    return '' +
    `<hr>` +
    line
  }
}

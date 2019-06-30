import MarkdownIt from 'markdown-it'
import remark from 'remark'

// Basic markdown configuration
// Config documentation: https://github.com/markdown-it/markdown-it#init-with-presets-and-options
var md = new MarkdownIt({
  html: true,
  xhtmlOut: true,
  breaks: false,
  langPrefix: 'language-',
  linkify: true,
  typographer: false,
  quotes: '“”‘’',
  highlight: function (/* str, lang */) { return '' }
})

export default {
  /**
   * Return html string made from markdown string
   *
   * @param {String} data
   *
   * @return {String}
   */
  generateHtml (data) {
    return md.render(String(data))
  },

  /**
   * Return html page string made from markdown string
   *
   * @param {String} data
   * @param {String} name
   *
   * @return {String}
   */
  generateHtmlPage (data, name, printDialog = false) {
    let js = null
    let style = '<style>h1,h2,h3,h4,h5,h6{margin:0}h1{font-size:2.5rem}h2{font-size:2rem}h3{font-size:1.75rem}h4{font-size:1.5rem}h5{font-size:1.25rem}h6{font-size:1rem}</style>'

    if (printDialog) {
      js = [
        '<script>',
        'window.print()',
        'setTimeout(function () { window.close() }, 10)',
        '</script>'
      ].join('\n')
    }

    return [
      '<html>',
      '<head>',
      '<title>' + String(name) + '</title>',
      '<link rel="stylesheet" type="text/css" href="https://unpkg.com/quasar-framework@latest/dist/umd/quasar.mat.min.css">',
      '</head>',
      '<body>',
      '<div class="q-pa-md">',
      this.generateHtml(data),
      '</div>',
      js,
      style,
      '</body>',
      '</html>'
    ].join('\n')
  },

  /**
   * Format input markdown string
   *
   * @param {String} data
   *
   * @return {String}
   */
  applyStyle (data) {
    remark()
      .data('settings', {
        commonmark: true,
        emphasis: '*',
        strong: '*'
      })
      .process(data, (err, file) => {
        if (err) throw err
        data = file.contents
      })

    return data
  }
}

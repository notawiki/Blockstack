const Pkg = require('./package.json')

// Configuration for your app

module.exports = function (ctx) {
  return {
    plugins: [
      'animatecss',
      'clipboard'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons'
      // 'ionicons',
      // 'mdi',
      // 'fontawesome'
    ],
    supportIE: false,
    vendor: {
      add: [],
      remove: []
    },
    build: {
      scopeHoisting: true,
      vueRouterMode: 'hash',
      publicPath: process.env.PUBLIC || null,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        })
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QLayoutHeader',
        'QToolbar',
        'QToolbarTitle',
        'QLayoutDrawer',
        'QPageContainer',

        'QContextMenu',
        'QPopover',

        'QFab',
        'QFabAction',

        'QModal',

        'QBtn',
        'QBtnGroup',
        'QIcon',
        'QTooltip',

        'QToggle',
        'QInput',

        'QList',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSide',

        // Slides
        'QCarousel',
        'QCarouselSlide'
      ],
      directives: [
        'CloseOverlay',
        'Ripple',
        'TouchHold'
      ],
      plugins: [
        'Dialog',
        'Notify'
      ]
    },
    // animations: 'all' --- includes all animations
    animations: [
    ],
    pwa: {
      manifest: {
        name: Pkg.productName,
        short_name: Pkg.productName,
        description: Pkg.description,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icon.png',
            'sizes': '256x256',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      extendWebpack (cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.0-beta.4'
  }
}

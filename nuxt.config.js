export default {
  mode: 'universal',
  server: {
    port: 4321
  },
  // router: {
  //   baseUrl: '/covid/'
  // },
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: './favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // '@nuxtjs/pwa',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, { isDev }) {
      // this fixes a prod bug caused by proxying with NGINX from a sub-directory rather than the top level domain. ie. jeremypoole.ca/covid. I could have made a subdomain instead, I guess I'm just lazy :P
      // see https://github.com/nuxt/nuxt.js/issues/1947#issuecomment-416013725
      if (true) {
        config.output.publicPath = './_nuxt/'
      }
    }
  }
}

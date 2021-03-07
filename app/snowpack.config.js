module.exports = {
  extends: '@sveltejs/snowpack-config',
  plugins: ['@snowpack/plugin-typescript'],
  mount: {
    'src/components': '/_components'
  },
  alias: {
    $components: './src/components'
  }
};

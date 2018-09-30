import vue from 'rollup-plugin-vue' // Handle .vue SFC files
import buble from 'rollup-plugin-buble' // Transpile/polyfill with reasonable browser support
export default {
  input: 'src/wrapper.js', // Path relative to package.json
  output: {
    name: 'Vedit',
    exports: 'named'
  },
  plugins: [
    vue({
      css: true, // Dynamically inject css as a <style> tag
      compileTemplate: true // Explicitly convert template to render function
    }),
    buble({ transforms: { forOf: false } }) // Transpile to ES5
  ],
  external: [
    'quill',
    'quill-image-drop-module',
    'quill-image-resize-module',
    'quill-video-resize-module',
    '@/../node_modules/quill/dist/quill.snow.css'
  ]
}

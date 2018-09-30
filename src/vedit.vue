<template>
  <div class="quill"><slot/></div>
</template>

<script>
import '@/../node_modules/quill/dist/quill.snow.css'
// NOT IN USE: import '@/assets/styles/quill.css'
import Quill from 'quill'
import { ImageDrop } from 'quill-image-drop-module'
import ImageResize from 'quill-image-resize-module'
import VideoResize from 'quill-video-resize-module'
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', ImageResize)
Quill.register('modules/VideoResize', VideoResize)

export default {
  name: 'Editor',
  props: ['client'],
  beforeDestroy () {
    this.resetEditor()
  },
  mounted () {
    this.resetEditor()

    // Add icons to toolbar
    const icons = Quill.import('ui/icons')
    icons.header[3] = require('!html-loader!@/../node_modules/quill/assets/icons/header-3.svg')

    // Options
    const options = this.getOptions()

    // Create editor
    this.quill = new Quill('.quill', options)

    // Custom image selection and upload
    this.quill.getModule('toolbar').addHandler('image', () => {
      this.selectImage()
    })

    // Allow select media
    const ImageBlot = Quill.import('formats/image')
    const VideoBlot = Quill.import('formats/video')
    const Parchment = Quill.import('parchment')

    // Add support for selection of images and video
    this.quill.root.addEventListener('click', (ev) => {
      let media = Parchment.find(ev.target)
      if (media instanceof ImageBlot || media instanceof VideoBlot) {
        this.quill.setSelection(media.offset(this.quill.scroll), 1, 'user')
      }
    })

    // On editor update get the content
    this.quill.on('text-change', () => {
      // Other ways of getting the content
      // const delta = this.quill.getContents()
      // console.log(delta)
      // const text = this.quill.getText()
      // console.log(text)
      const html = this.quill.root.innerHTML
      console.log(html)
      this.$emit('change', html)
    })
  },
  methods: {
    // Default options
    getOptions () {
      return {
        theme: 'snow',
        boundary: document.body,
        modules: {
          imageDrop: true,
          imageResize: true,
          videoResize: true,
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 2 }, { 'header': 3 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            // Other options
            // [{ 'header': 1 }, { 'header': 2 }, { 'header': 3 }],
            // [{ 'script': 'sub' }, { 'script': 'super' }],
            // [{ 'indent': '-1' }, { 'indent': '+1' }],
            // [{ 'direction': 'rtl' }],
            // [{ 'size': ['small', false, 'large', 'huge'] }],
            // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            // [{ 'color': [] }, { 'background': [] }],
            // [{ 'font': [] }],
            // ['clean'],
          ]
        },
        placeholder: 'Your deepest thoughts ...',
        readOnly: false
      }
    },
    // Creates an input and clicks it
    selectImage () {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.click()
      input.onchange = () => {
        const files = []
        for (const file of input.files) {
          if (/^image\//.test(file.type)) {
            files.unshift(file)
          } else {
            console.warn('You can only upload images.')
          }
        }
        if (files.length > 0) {
          this.upload(files)
        } else {
          console.log('No files to upload')
        }
      }
    },
    // Uploads a file to the client
    upload (files) {
      if (this.client) {
        this.client.upload({ files }).then((data) => {
          if (data.urls) {
            this.$emit('upload', data.urls)
            const range = this.quill.getSelection()
            for (const url of data.urls) {
              this.quill.insertEmbed(range.index, 'image', url)
            }
          } else {
            console.log('Upload error:', data)
          }
        })
      }
    },
    // Make sure the toolbar is gone before making a new editor
    resetEditor () {
      const toolbars = document.querySelectorAll('.ql-toolbar')
      for (const t of toolbars) {
        t.remove()
      }
    }
  }
}
</script>
<style>
/* Make sure the videos are not clickable or else resize won't work */
iframe.ql-video {
  pointer-events: none;
}
</style>
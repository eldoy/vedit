# Vue editor based on Quill.js

This build has built in support for:
* Upload image
* Drag and drop image as base64
* Insert Vimeo and Youtube video
* Resize and align video and image
* Copy paste text
* H2 and H3 tags
* Bold, italic, underlined, strikethrough
* Quotes, code, lists, text alignment

### INSTALL
```npm i vedit``` or ```yarn add vedit```

### USAGE
Example Editor.vue file:
```html
<template>
  <div class="editor">
    <!-- Subscribe to change and upload events. The client prop is the upload handler. -->
    <Vedit @change="change" @upload="upload" :client="client">
      <!-- Slot for initial HTML. Use v-html if you are loading HTML from a string. -->
      <div v-html="content" />
    </Vedit>
  </div>
</template>

<script>
import Client from '@/lib/client'
import Vedit from 'vedit'

export default {
  name: 'Editor',
  components: { Vedit },
  created () {
    // Example upload client
    this.client = new Client({ url: 'example.com/upload' })
  },
  methods: {
    // Everytime you write something you can read the value of the editor here
    change (value) {
      console.log('CHANGE:', value)
    },
    // The upload handler for the client should be a function that takes input files
    // and returns a promise that resolves with file URLs.
    upload(urls) {
      console.log('UPLOADED:', urls)
    }
  },
  data () {
    return {
      client: null,
      content: '<p><img src="https://7ino.s3.amazonaws.com/1538111025472_umbrellas-small.jpg">Hello</p>'
    }
  }
}
</script>
```
MIT Licensed. Enjoy!

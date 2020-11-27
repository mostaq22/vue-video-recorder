<template>
  <div id="app">
    
    <VideoNative />
  </div>
</template>

<script>
import VideoNative from './components/VideoNative'
// import VideoJSRecord from './components/VideoJSRecord.vue'

export default {
  name: 'app',
  components: {
    // VideoJSRecord
    VideoNative
  }
}
</script>

<style>
/* change player background color */
#myVideo {
  background-color: #95DDF5;
}
</style>
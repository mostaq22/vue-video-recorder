
<template>
      <p>
      Click the "Start" button to begin video recording for a few seconds. You
      can stop the video by clicking the creatively-named "Stop" button. The
      "Download" button will download the received data (although it's in a raw,
      unwrapped form that isn't very useful).
    </p>
    <br />
    <div class="left">
      <button @click="this.startVideo" id="startButton" class="button">Start</button>
      <h2>Preview</h2>
      <video id="preview" width="160" height="120" autoplay muted></video>
    </div>
    <div class="right">
      <button id="stopButton" @click="this.stop" class="button">Stop</button>
      <h2>Recording</h2>
      <video id="recording" width="160" height="120" controls></video>
      <a id="downloadButton" class="button"> Download </a>
    </div>
    <div class="bottom">
      <pre id="log"></pre>
    </div>
    <button @click="test"></button>
</template>

<script>

export default {
  name: "VideoNative",
  data() {
    return {
      title: "NativeVideio",
      data : []
    };
  },
  mounted() {
  console.log(this);
},
  methods: {
      test(){
          console.log(this);
      },
    
    startRecording(stream, lengthInMS) {
          console.log(this);
        console.log(lengthInMS);
      
      let recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => this.data.push(event.data);
      recorder.start();
      console.log(recorder.state + " for " + lengthInMS / 1000 + " seconds...");

      let stopped = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = (event) => reject(event.name);
      });

      let recorded = this.wait(lengthInMS).then(
        () => recorder.state == "recording" && recorder.stop()
      );

      return Promise.all([stopped, recorded]).then(() => this.data);
    },
   
    wait: (delayInMS) => {
      return new Promise((resolve) => setTimeout(resolve, delayInMS));
    },
    startVideo () {
        console.log(this);
      let preview = document.getElementById("preview");
      let recording = document.getElementById("recording");
    //   let startButton = document.getElementById("startButton");
    //   let stopButton = document.getElementById("stopButton");
      let downloadButton = document.getElementById("downloadButton");
      let recordingTimeMS = 5000
    //   let logElement = document.getElementById("log");
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        //   audio: true,
        })
        .then((stream) => {
          
          preview.srcObject = stream;
          downloadButton.href = stream;
          preview.captureStream =
            preview.captureStream || preview.mozCaptureStream;
          return new Promise((resolve) => (preview.onplaying = resolve));
        })
        .then( strem => this.startRecording(preview.captureStream(), recordingTimeMS)
            
            
        
        
        )
        .then((recordedChunks) => {
          let recordedBlob = new Blob(recordedChunks, {
            type: "video/webm",
          });
           let recording = document.getElementById("recording");
          recording.src = URL.createObjectURL(recordedBlob);
          downloadButton.href = recording.src;
          downloadButton.download = "RecordedVideo.webm";
          console.log(
            "Successfully recorded " +
              recordedBlob.size +
              " bytes of " +
              recordedBlob.type +
              " media."
          );
        })
        .catch((error) =>{
            console.log(error);
        });
    },
  },
  stop(){
      stream = document.getElementById("preview").srcObject
      stream.getTracks().forEach((track) => track.stop());
  }
};
</script>






<style scoped>
body {
  font: 14px "Open Sans", "Arial", sans-serif;
}

video {
  margin-top: 2px;
  border: 1px solid black;
}

.button {
  cursor: pointer;
  display: block;
  width: 160px;
  border: 1px solid black;
  font-size: 16px;
  text-align: center;
  padding-top: 2px;
  padding-bottom: 4px;
  color: white;
  background-color: darkgreen;
  text-decoration: none;
}

h2 {
  margin-bottom: 4px;
}

.left {
  margin-right: 10px;
  float: left;
  width: 160px;
  padding: 0px;
}

.right {
  margin-left: 10px;
  float: left;
  width: 160px;
  padding: 0px;
}

.bottom {
  clear: both;
  padding-top: 10px;
}
</style>
<template>
  <p>
    Click the "Start" button to begin video recording for a few seconds. You can
    stop the video by clicking the creatively-named "Stop" button. The
    "Download" button will download the received data (although it's in a raw,
    unwrapped form that isn't very useful).
  </p>
  <br />
  <div class="left">
    <button id="startButton" class="button" v-on:click="startVideo">
      Start
    </button>
    <h2>Preview</h2>
    <video id="preview" width="160" height="120" autoplay muted></video>
  </div>
  <div class="right">
    <div id="stopButton" class="button">Stop</div>
    <h2>Recording</h2>
    <video id="recording" width="160" height="120" controls></video>
    <a id="downloadButton" class="button"> Download </a>
  </div>
  <div class="bottom">
    <pre id="log"></pre>
  </div>
</template>

<script>

document.addEventListener("DOMContentLoaded", function(event) { 
   console.log(event);

        let preview = document.getElementById("preview");
      let recording = document.getElementById("recording");
      let startButton = document.getElementById("startButton");
      let stopButton = document.getElementById("stopButton");
      let downloadButton = document.getElementById("downloadButton");
      let logElement = document.getElementById("log");

      let recordingTimeMS = 5000;
      function log(msg) {
        logElement.innerHTML += msg + "\n";
      }
      function wait(delayInMS) {
        return new Promise((resolve) => setTimeout(resolve, delayInMS));
      }
      function startRecording(stream, lengthInMS) {
        let recorder = new MediaRecorder(stream);
        let data = [];

        recorder.ondataavailable = (event) => data.push(event.data);
        recorder.start();
        log(recorder.state + " for " + lengthInMS / 1000 + " seconds...");

        let stopped = new Promise((resolve, reject) => {
          recorder.onstop = resolve;
          recorder.onerror = (event) => reject(event.name);
        });

        let recorded = wait(lengthInMS).then(
          () => recorder.state == "recording" && recorder.stop()
        );

        return Promise.all([stopped, recorded]).then(() => data);
      }
      function stop(stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      startButton.addEventListener(
        "click",
        function () {
          navigator.mediaDevices
            .getUserMedia({
              video: true,
              audio: true,
            })
            .then((stream) => {
              preview.srcObject = stream;
              downloadButton.href = stream;
              preview.captureStream =
                preview.captureStream || preview.mozCaptureStream;
              return new Promise((resolve) => (preview.onplaying = resolve));
            })
            .then(() =>
              startRecording(preview.captureStream(), recordingTimeMS)
            )
            .then((recordedChunks) => {
              let recordedBlob = new Blob(recordedChunks, {
                type: "video/webm",
              });
              recording.src = URL.createObjectURL(recordedBlob);
              downloadButton.href = recording.src;
              downloadButton.download = "RecordedVideo.webm";

              log(
                "Successfully recorded " +
                  recordedBlob.size +
                  " bytes of " +
                  recordedBlob.type +
                  " media."
              );
            })
            .catch((log_er) =>{
                console.log(log_er);
            });
        },
        false
      );
      stopButton.addEventListener(
        "click",
        function () {
          stop(preview.srcObject);
        },
        false
      );
});
      
export default {
  data() {
    return {
     
    };
  },
  mounted() {
    // this.preview = document.getElementById("preview")
    // this.recording = document.getElementById("recording");
    // this.startButton = document.getElementById("startButton");
    // this.stopButton = document.getElementById("stopButton");
    // this.downloadButton = document.getElementById("downloadButton");
    // this.logElement = document.getElementById("log");
    
  },
  methods: {
    startRecording: (stream, lengthInMS) => {
      let recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => this.data.push(event.data);
      recorder.start();
      this.log(recorder.state + " for " + lengthInMS / 1000 + " seconds...");

      let stopped = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = (event) => reject(event.name);
      });

      let recorded = this.wait(lengthInMS).then(
        () => recorder.state == "recording" && recorder.stop()
      );

      return Promise.all([stopped, recorded]).then(() => this.data);
    },
    log: (msg) => {
      this.logElement.innerHTML += msg + "\n";
    },
    wait: (delayInMS) => {
      return new Promise((resolve) => setTimeout(resolve, delayInMS));
    },
    startVideo: () => {

      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then(stream => {
          console.log(this);
          this.preview.srcObject = stream;
          this.downloadButton.href = stream;
          this.preview.captureStream =
            this.preview.captureStream || this.preview.mozCaptureStream;
          return new Promise((resolve) => (this.preview.onplaying = resolve));
        })
        .then(() =>
          this.startRecording(
            this.preview.captureStream(),
            this.recordingTimeMS
          )
        )
        .then((recordedChunks) => {
          let recordedBlob = new Blob(recordedChunks, {
            type: "video/webm",
          });
          this.recording.src = URL.createObjectURL(recordedBlob);
          this.downloadButton.href = this.recording.src;
          this.downloadButton.download = "RecordedVideo.webm";

          this.log(
            "Successfully recorded " +
              recordedBlob.size +
              " bytes of " +
              recordedBlob.type +
              " media."
          );
        })
        .catch(this.log);
    },
  },
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
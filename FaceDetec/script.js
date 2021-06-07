
const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.mediaDevices.getUserMedia({video: {} }).then( stream => {
      console.log(stream);
      video.srcObject = stream;
  }).catch( err => {
      console.error(err);
  })
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})

window.onload = function () {
    const parts = [];
    let mediaRecorder;
  
    navigator.mediaDevices.getUserMedia({ audio: true, video: true}).then(stream => {
      document.getElementById('video').srcObject = stream;
      document.getElementById('btn').onclick = function () {
        console.log("clicked")
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(1000);
        mediaRecorder.ondataavailable = function (e) {
          parts.push(e.data);
  
        }
      }
    });
  
    document.getElementById('stopbtn').onclick = function () {
      mediaRecorder.stop();
      const blob = new Blob(parts, {
        type: "video/webm"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = 'test.webm';
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    }
  
  
    // const video = document.getElementById('video')
  
    // Promise.all([
    //   faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    //   faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    //   faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    //   faceapi.nets.faceExpressionNet.loadFromUri('/models')
    // ]).then(startVideo)
    
    // function startVideo() {
    //   navigator.mediaDevices.getUserMedia({video: {} }).then( stream => {
    //       console.log(stream);
    //       video.srcObject = stream;
    //   }).catch( err => {
    //       console.error(err);
    //   })
    // }
    
    // video.addEventListener('play', () => {
    //   const canvas = faceapi.createCanvasFromMedia(video)
    //   document.body.append(canvas)
    //   const displaySize = { width: video.width, height: video.height }
    //   faceapi.matchDimensions(canvas, displaySize)
    //   setInterval(async () => {
    //     const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    //     const resizedDetections = faceapi.resizeResults(detections, displaySize)
    //     canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    //     faceapi.draw.drawDetections(canvas, resizedDetections)
    //     faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    //     faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    //   }, 100)
    // })
  }
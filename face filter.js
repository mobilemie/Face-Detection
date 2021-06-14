let outputWidth;
let outputHeight;

let faceTracker; // Face Tracking
let videoInput;

let imgSpidermanMask; // Spiderman Mask Filter
let imgDogEarRight, imgDogEarLeft, imgDogNose; // Dog Face Filter

let selected = -1; // Default no filter

/*
 * **p5.js** library automatically executes the `preload()` function. Basically, it is used to load external files. In our case, we'll use it to load the images for our filters and assign them to separate variables for later use.
*/
function preload()
{
  // Spiderman Mask Filter asset
  imgSpidermanMask = loadImage("https://i.ibb.co/9HB2sSv/spiderman-mask-1.png");

  // Dog Face Filter assets
  imgDogEarRight = loadImage("https://i.ibb.co/bFJf33z/dog-ear-right.png");
  imgDogEarLeft = loadImage("https://i.ibb.co/dggwZ1q/dog-ear-left.png");
  imgDogNose = loadImage("https://i.ibb.co/PWYGkw1/dog-nose.png");
}

/**
 * In p5.js, `setup()` function is executed at the beginning of our program, but after the `preload()` function.
*/
function setup()
{
  const maxWidth = Math.max(windowWidth, windowHeight);
  pixelDensity(1);
  outputWidth = maxWidth * 0.95;
  outputHeight = maxWidth * 0.5; 

  createCanvas(outputWidth, outputHeight);

  // webcam capture
  videoInput = createCapture(VIDEO);
  videoInput.size(outputWidth, outputHeight);
  videoInput.hide();

  // select filter
  const sel = createSelect();
  const selectList = ['Spiderman Mask', 'Dog Filter']; // list of filters
  sel.option('Select Filter', -1); // Default no filter
  for (let i = 0; i < selectList.length; i++)
  {
    sel.option(selectList[i], i);
  }
  sel.changed(applyFilter);

  // tracker
  faceTracker = new clm.tracker();
  faceTracker.init();
  faceTracker.start(videoInput.elt);
}

// callback function
function applyFilter()
{
  selected = this.selected(); // change filter type
}

/*
 * In p5.js, draw() function is executed after setup(). This function runs inside a loop until the program is stopped.
*/
function draw()
{
  image(videoInput, 0, 0, outputWidth, outputHeight); // render video from webcam

  // apply filter based on choice
  switch(selected)
  {
    case '-1': break;
    case '0': drawSpidermanMask(); break;
    case '1': drawDogFace(); break;
  }
}

// Spiderman Mask Filter
function drawSpidermanMask()
{
  const positions = faceTracker.getCurrentPosition();
  if (positions !== false)
  {
    push();
    const wx = Math.abs(positions[13][0] - positions[1][0]) * 1.2; // The width is given by the face width, based on the geometry
    const wy = Math.abs(positions[7][1] - Math.min(positions[16][1], positions[20][1])) * 1.2; // The height is given by the distance from nose to chin, times 2
    translate(-wx/2, -wy/2);
    image(imgSpidermanMask, positions[62][0], positions[62][1], wx, wy); // Show the mask at the center of the face
    pop();
  }
}

// Dog Face Filter
function drawDogFace()
{
  const positions = faceTracker.getCurrentPosition();
  if (positions !== false)
  {
    if (positions.length >= 20) {
      push();
      translate(-100, -150); // offset adjustment
      image(imgDogEarRight, positions[20][0], positions[20][1]);
      pop();
    }

    if (positions.length >= 16) {
      push();
      translate(-20, -150); // offset adjustment
      image(imgDogEarLeft, positions[16][0], positions[16][1]);
      pop();
    }

    if (positions.length >= 62) {
      push();
      translate(-57, -20); // offset adjustment
      image(imgDogNose, positions[62][0], positions[62][1]);
      pop();
    }
  }
}

function windowResized()
{
  const maxWidth = Math.max(windowWidth, windowHeight);
  pixelDensity(1);
  outputWidth = maxWidth;
  outputHeight = maxWidth; // 4:3
  resizeCanvas(outputWidth, outputHeight);
}


// const videoElem = document.getElementById("video");
// const logElem = document.getElementById("log");
// const startElem = document.getElementById("start");
// const stopElem = document.getElementById("stop");
// Options for getDisplayMedia()

// startElem.addEventListener("click", function(evt) {
//   startRecording();
// }, false);
// stopElem.addEventListener("click", function(evt) {
//   recorder.stop()
// }, false);


// const start = document.getElementById("start");
// const stop = document.getElementById("stop");
// const video = document.querySelector("video");
// let recorder, stream;

// async function startRecording() {
//   stream = await navigator.mediaDevices.getDisplayMedia({
//     video: { mediaSource: "screen" }
//   });
//   recorder = new MediaRecorder(stream);

//   const chunks = [];
//   recorder.ondataavailable = e => chunks.push(e.data);
//   recorder.onstop = e => {
//     const completeBlob = new Blob(chunks, { type: "video/mp4" });
//     video.src = URL.createObjectURL(completeBlob);
//     const a = document.createElement('a');
//     document.body.appendChild(a);
//     a.href = completeBlob;
//     a.download = 'test.mp4';
//     a.click();
//       setTimeout(() => {
//         document.body.removeChild(a);
//         window.URL.revokeObjectURL(completeBlob);
//       }, 100);
//   };

//   recorder.start();
// }

// start.addEventListener("click", () => {
//   start.setAttribute("disabled", true);
//   stop.removeAttribute("disabled");

//   startRecording();
// });

// stop.addEventListener("click", () => {
//   stop.setAttribute("disabled", true);
//   start.removeAttribute("disabled");

//   recorder.stop();
//   stream.getVideoTracks()[0].stop();
// });


const start = document.getElementById("start");
const stop = document.getElementById("stop");
const video = document.querySelector("video");
let recorder, stream;

async function startRecording() {
  stream = await navigator.mediaDevices.getDisplayMedia({
    video: { mediaSource: "screen" }
  });
  recorder = new MediaRecorder(stream);

  const chunks = [];
  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = e => {
    const completeBlob = new Blob(chunks, { type: chunks[0].type });
    video.src = URL.createObjectURL(completeBlob);
  };

  recorder.start();
}

start.addEventListener("click", () => {
  start.setAttribute("disabled", true);
  stop.removeAttribute("disabled");

  startRecording();
});

stop.addEventListener("click", () => {
  stop.setAttribute("disabled", true);
  start.removeAttribute("disabled");

  recorder.stop();
  stream.getVideoTracks()[0].stop();
});



// function downloadBlob(blob, name = 'file.mp4') {
//   // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
//   const blobUrl = URL.createObjectURL(blob);

//   // Create a link element
//   const link = document.createElement("a");

//   // Set link's href to point to the Blob URL
//   link.href = blobUrl;
//   link.download = name;

//   // Append link to the body
//   document.body.appendChild(link);

//   // Dispatch click event on the link
//   // This is necessary as link.click() does not work on the latest firefox
//   link.dispatchEvent(
//     new MouseEvent('click', { 
//       bubbles: true, 
//       cancelable: true, 
//       view: window 
//     })
//   );

//   // Remove link from body
//   document.body.removeChild(link);
// }

// // Usage
// let jsonBlob = new Blob(['{"name": "test"}'])
// const completeBlob = new Blob(chunks, { type: chunks[0].type });
// downloadBlob(blob, 'myfile.json');


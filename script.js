let video;
let poseNet;
let poseArr = [];
let baseRes = [640, 480];
let isLoading = true;

// returns image resolution similar to the base resolution according to the height you pass in
function calcRes(height) {
   let scaleFactor = height/baseRes[1];
   let newRes = [baseRes[0]*scaleFactor, height];

   return newRes;
}

//////////////////////////////////////////////////////////////

function setup() {
   createCanvas(windowWidth, windowHeight);
   video = createCapture(VIDEO).size(...baseRes).hide();
   
   setupPoseNet();
}

function draw() {
   setupCanvas();
   
   drawPose(height);
}

//////////////////////////////////////////////////////////////

// applies inital transformations and controls loading message 
function setupCanvas() {
   clear();
   
   if (isLoading) {
      textAlign(CENTER, CENTER);
      textSize(30);
      text('Loading...', width/2, height/2);
   }

   // flip canvas horizontally
   scale(-1,1);
   translate(-width,0);
}

// loading poseNet model, poseNet listens for the "pose" event
function setupPoseNet() {
   poseNet = ml5.poseNet(video, () => {
      isLoading = false;
      console.log('model loaded, poseNet is ready');
   });

   poseNet.on('pose', poses => poses.length && (poseArr = poses));
}

// draws image and points over it
function drawPose(vidHeight) {
   let imageScaleFactor = vidHeight/baseRes[1];
   
   translate(width/2 - calcRes(vidHeight)[0]/2, height/2 - vidHeight/2); // centers image and points
   image(video, 0, 0, ...calcRes(vidHeight));
   
   // supports multiple poses in an image
   poseArr.forEach(({ pose }) => {
      pose && pose.keypoints.forEach(point => {
         if (point && point.score > 0.7) {
            circle(point.position.x*imageScaleFactor, point.position.y*imageScaleFactor, 10);
         }
      });
   });
}
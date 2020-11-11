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
   background(0);
   noStroke();

   if (isLoading) {
      textAlign(CENTER, CENTER);
      textSize(30);
      fill(255);
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
   let minConfidence = 0.2;
   let imageScaleFactor = vidHeight/baseRes[1];
   
   translate(width/2 - calcRes(vidHeight)[0]/2, height/2 - vidHeight/2); // centers image and points
   image(video, 0, 0, ...calcRes(vidHeight));
   
   // supports multiple poses in an image
   poseArr.length && poseArr.forEach(({ pose }) => {
      pose.keypoints.forEach(({ position, score }) => {
         if (score > minConfidence) {
            circle(position.x*imageScaleFactor, position.y*imageScaleFactor, 10);
         }
      });

      function connectParts(part1, part2) {
          if (pose[part1].confidence > minConfidence && pose[part2].confidence > minConfidence) {
             line(pose[part1].x*imageScaleFactor, pose[part1].y*imageScaleFactor, pose[part2].x*imageScaleFactor, pose[part2].y*imageScaleFactor);
          }
      }

      // pose skeleton
      push();

      stroke(255);
      strokeWeight(5);

      // body outline
      connectParts('leftShoulder', 'rightShoulder');
      connectParts('rightShoulder', 'rightHip');
      connectParts('rightHip', 'leftHip');
      connectParts('leftHip', 'leftShoulder');

      // left arm
      connectParts('leftShoulder', 'leftElbow');
      connectParts('leftElbow', 'leftWrist');

      // right arm
      connectParts('rightShoulder', 'rightElbow');
      connectParts('rightElbow', 'rightWrist');

      // left leg
      connectParts('leftHip', 'leftKnee');
      connectParts('leftKnee', 'leftAnkle');
      
      // right leg
      connectParts('rightHip', 'rightKnee');
      connectParts('rightKnee', 'rightAnkle');

      pop();
   });
}

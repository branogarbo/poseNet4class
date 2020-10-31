let video;
let poseNet;
let pose;
let vidRes;

function modelLoaded() {
   console.log('poseNet is ready');
}
function gotPoses(poses) {
   console.log(poses);

   if (poses.length > 0) {
      pose = poses[0].pose;
   }
}

function setup() {
   createCanvas(windowWidth, windowHeight);
   video = createCapture(VIDEO).size(900, AUTO);
   vidRes = video.size();
   video.hide();

   poseNet = ml5.poseNet(video, modelLoaded);
   poseNet.on('pose', gotPoses);

}

function draw() {
   background(10);
   image(video, 0, 0, vidRes.width, vidRes.height);

   fill(255);
   
   for (poseNode in pose) {
      if (pose && poseNode !== "keypoints" && pose[poseNode].confidence > 0.9) {
         circle(pose[poseNode].x, pose[poseNode].y, 10);
      }
   }
}
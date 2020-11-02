let video;
let poseNet;
let vidRes;
let poseArr = [];

function setup() {
   createCanvas(640, 480);
   video = createCapture(VIDEO).size(width, height);
   video.hide();

   poseNet = ml5.poseNet(video, () => console.log('model loaded, poseNet is ready'));
   poseNet.on('pose', poses => {
      if (poses.length > 0) {
         poseArr = poses;
      }
   });
}

function draw() {
   background(10);
   scale(-1,1);
   translate(-width,0);
   
   image(video, 0, 0, width, height);
   
   drawPoints();
}

function drawPoints() {
   poseArr.forEach(({ pose }) => {
      console.log(pose);

      pose && pose.keypoints.forEach(point => {
         if (point && point.score > 0.9) {
            circle(point.position.x, point.position.y, 10);
         }
      });

   });
}
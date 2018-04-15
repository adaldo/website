



class Landmark {

  constructor( position = new Vector(), color = [255,255,255] ) {
    this.position = position;
    this.color = color;
  }

  get x() { return this.position.x; }
  get y() { return this.position.y; }

  draw() {
    CONTEXT.beginPath();
    // CONTEXT.strokeStyle=rgbaStringFromRgbArray(this.color, 0.2);
    CONTEXT.fillStyle=rgbaStringFromRgbArray(this.color, 0.2);
    CONTEXT.rect(this.x-LANDMARK_SIZE.x/2, this.y-LANDMARK_SIZE.y/2, LANDMARK_SIZE.x, LANDMARK_SIZE.y);
    // CONTEXT.stroke();
    CONTEXT.fill();
    CONTEXT.closePath();
  }

};



const NUM_LANDMARKS = {x:100, y:100};
const LANDMARK_SIZE = {x:CANVAS.width/NUM_LANDMARKS.x, y:CANVAS.height/NUM_LANDMARKS.y};
let LANDMARKS = [];
let x = LANDMARK_SIZE.x/2;
let y = LANDMARK_SIZE.y/2;

for (let i=0; i<NUM_LANDMARKS.x; i++) {
  for (let j=0;j<NUM_LANDMARKS.y; j++) {
    LANDMARKS.push( new Landmark( new Vector(x, y) ) );
    y += LANDMARK_SIZE.y;
  }
  y = LANDMARK_SIZE.y/2;
  x += LANDMARK_SIZE.x;
}

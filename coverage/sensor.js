const SENSOR_SIZE = Math.sqrt(CANVAS.width*CANVAS.height)/50;
const SPEED = Math.sqrt(CANVAS.width*CANVAS.height)/2e4;
const ANGULAR_SPEED = 2e-6;
const MIN_VEL = SPEED/10;
const MIN_ANG_VEL = ANGULAR_SPEED/10;


let FOCUS = Math.sqrt(CANVAS.width*CANVAS.height)/30;
const FRONT = 1.0;
let REAR = 0.999;


class Sensor {

  constructor(
    color=colorIterator.next(),
    position=new Vector(randInt(CANVAS.width), randInt(CANVAS.height)),
    orientation=undefined,
    velocity=new Vector(),
    radius=SENSOR_SIZE,
  ) {

    this.position = position;
    if (orientation===undefined) {
      let angle = Math.random()*2*Math.PI;
      orientation = new Vector( Math.cos(angle), Math.sin(angle) );
    }
    this.orientation = orientation;
    this.velocity = velocity;
    this.angularVelocity = 0.0;

    this.landmarks = LANDMARKS.map(lmk => false);
    this.totalPenalty = 0.0;

    this.radius = radius;
    this.color = color;
    this.captive = false;
    this.orentationCaptive = false;
  };

  get x() { return this.position.x; }
  get y() { return this.position.y; }
  get dx() { return this.velocity.x; }
  get dy() { return this.velocity.y; }

  set x(val) { this.position.x = val; }
  set y(val) { this.position.y = val; }
  set dx(val) { this.velocity.x = val; }
  set dy(val) { this.velocity.y = val; }

  draw() {
    CONTEXT.beginPath();
    CONTEXT.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
    CONTEXT.fillStyle = rgbaStringFromRgbArray(this.color, 0.75);
    CONTEXT.fill();
    CONTEXT.lineWidth = 2;
    CONTEXT.strokeStyle = rgbaStringFromRgbArray(this.color, 1.0);
    CONTEXT.stroke();
    CONTEXT.closePath();
    CONTEXT.beginPath();
    CONTEXT.arc(this.x+FOCUS*this.orientation.x, this.y+FOCUS*this.orientation.y, this.radius/5, 0, 2*Math.PI, false);
    CONTEXT.fillStyle = rgbaStringFromRgbArray(this.color, 0.75);
    CONTEXT.fill();
    CONTEXT.lineWidth = 2;
    CONTEXT.strokeStyle = rgbaStringFromRgbArray(this.color, 1.0);
    CONTEXT.stroke();
    CONTEXT.closePath();
  }

  update() {
    this.computePenaltyAndVelocity();
    if (this.position.x+this.velocity.x > CANVAS.width-this.radius || this.position.x+this.velocity.x < this.radius) this.velocity.x = 0;
    if (this.position.y+this.velocity.y > CANVAS.height-this.radius || this.position.y+this.velocity.y < this.radius) this.velocity.y = 0;
    let partners = SENSORS.filter(sns => sns != this);
    if (this.velocity.normSquared < MIN_VEL && this.angularVelocity*this.angularVelocity < MIN_ANG_VEL && partners.length > 0) {
      let other = choose(partners);
      this.giveLandmarks(other);
    }
    if(!this.captive){
      this.position = this.position.add( this.velocity );
      this.orientation.rotate( this.angularVelocity );
      this.orientation.normalized;
    }
  }

  penalty(lmk) {
    let diff = this.position.clone().add( this.orientation.clone().mul(FOCUS) ).sub( lmk.position );
    if (diff.normSquared === 0) return 0;
    let num = this.orientation.clone().dot( diff );
    let den = diff.norm;
    return diff.normSquared*(FRONT + REAR*num/den);
  }

  penaltyAndGradients(lmk) {
    let diff = this.position.clone().add( this.orientation.clone().mul(FOCUS) ).sub( lmk.position );
    let den = diff.norm;
    if (den===0) return {penalty: 0.0, linearGradient: new Vector(), angularGradient: new Vector()};
    let num = this.orientation.clone().dot( diff );
    let lengthDeriv = diff.clone().div(den);
    let penalty = den*den*FRONT + den*REAR*num;
    let linearGradient = diff.clone().mul( 2*FRONT ).add( ( lengthDeriv.clone().mul(num).add( this.orientation.clone().mul( diff.norm ) ) ).mul(REAR) );
    let angularGradient = linearGradient.clone().mul(FOCUS).add( diff.clone().mul( REAR*diff.norm ) );
    return {penalty: penalty, linearGradient: linearGradient, angularGradient: angularGradient};
  }

  computePenaltyAndVelocity() {
    this.totalPenalty = 0.0;
    this.velocity = new Vector();
    this.angularVelocity = 0.0;
    let lmkCount = 0;
    for(let i=0; i<this.landmarks.length; i++){
      if (this.landmarks[i]) {
        let lmk = LANDMARKS[i];
        let result = this.penaltyAndGradients(lmk);
        this.velocity.sub( result.linearGradient );
        this.angularVelocity -= this.orientation.clone().cross( result.angularGradient );
        this.totalPenalty += result.penalty;
        lmkCount += 1;
      }
    }
    if (this.totalPenalty > 0) {
      this.velocity.mul( lmkCount*SPEED/this.totalPenalty );
      this.angularVelocity *= lmkCount*ANGULAR_SPEED/this.totalPenalty;
    }
  }

  transferLandmark(index, other) {
    this.landmarks[index] = false;
    other.landmarks[index] = true;
    LANDMARKS[index].color = other.color;
  }

  giveLandmarks(other) {
    // console.log("HERE!");
    for (let i=0;i<this.landmarks.length;i++) {
      if (this.landmarks[i]) {
        let lmk = LANDMARKS[i];
        if (other.penalty(lmk)<this.penalty(lmk)){
          this.transferLandmark(i,other);
        }
      }
    }
  }

  destroy() {
    for (let i=0;i<this.landmarks.length;i++) {
      let other = choose( SENSORS.filter( sns => sns != this ) );
      if (this.landmarks[i]) {
        let lmk = LANDMARKS[i];
        this.transferLandmark(i,other);
      }
    }
  }

};


const NUM_SENSORS = 6;
let SENSORS = [];
for (let i=0; i<NUM_SENSORS; i++) SENSORS.push( new Sensor() );

for(let i=0; i<LANDMARKS.length; i++) {
  let assignee = SENSORS[0];
  let lmk = LANDMARKS[i];
  assignee.landmarks[i] = true;
  lmk.color = assignee.color;
}

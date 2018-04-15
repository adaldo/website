const CANVAS = document.querySelector('canvas');
const CONTEXT = CANVAS.getContext('2d');

CANVAS.width = window.innerWidth/2;
CANVAS.height = window.innerHeight/2;


KTH_COLORS = [
  [25,84,166],
  [216,84,151],
  [250,185,25],
  [98,146,46],
  [157,16,45],
  [36,160,216],
  [176,201,43]
];
let colorIterator = {
  i: 0,
  next: function() {
    color = KTH_COLORS[this.i];
    this.i = (this.i+1) % KTH_COLORS.length;
    return color;
   }
};


function randInt(max=10,min=0) {
  return Math.floor( Math.random()*(max-min) + min );
}

function choose(palette) {
  index = randInt(palette.length);
  return palette[index];
}

function randomRgbArray() {
  red = randInt(256);
  green = randInt(256);
  blue = randInt(256);
  return [red, green, blue];
}

function rgbaStringFromRgbArray(array, alpha=1.0) {
  return `rgba(${array[0]}, ${array[1]}, ${array[2]}, ${alpha})`;
}


let mouse = new Vector();
let mouseDown = false;

function getMousePosition(canvas, evt) {
  let rect = canvas.getBoundingClientRect();
  let scaleX = canvas.width / rect.width;
  let scaleY = canvas.height / rect.height;
  return new Vector( (evt.clientX - rect.left) * scaleX, (evt.clientY - rect.top) * scaleY );
}

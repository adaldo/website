CANVAS.addEventListener('mousemove', function(event) {
  mouseDown = false;
  mouse = getMousePosition(CANVAS, event);
  for (let sns of SENSORS) {
    if (sns.orientationCaptive) {
      sns.orientation = mouse.clone().sub(sns.position).normalized;
      return;
    }
    if (sns.captive) {
      sns.position = mouse;
      return;
    }
  }
});

CANVAS.addEventListener('mousedown', function(event) {
  mouseDown = true;
  mouse = getMousePosition(CANVAS, event);
  for (let sns of SENSORS) {
    if ( sns.position.clone().add( sns.orientation.clone().mul(FOCUS) ).sub(mouse).normSquared < sns.radius*sns.radius ) {
      sns.orientationCaptive = true;
      return;
    }
  }
  for (let sns of SENSORS) {
    if ( sns.position.clone().sub( mouse ).normSquared < sns.radius*sns.radius ) {
      sns.captive = true;
      sns.position = mouse;
      return;
    }
  }
});

CANVAS.addEventListener('mouseup', function(event) {
  for (let sns of SENSORS) {
    sns.captive = false;
    sns.orientationCaptive = false;
  }
  if (mouseDown) { mouseClick(event); }
  mouseDown = false;
});

function mouseClick(event) {
  mouse = getMousePosition(CANVAS, event);
  for (let i=0; i<SENSORS.length; i++) {
    let sns = SENSORS[i];
    if ( sns.position.clone().sub( mouse ).normSquared < SENSOR_SIZE*SENSOR_SIZE ) {
      sns.destroy();
      SENSORS.splice(i,1);
      return;
    }
  }
}


let button = document.getElementById("addSensor");
button.addEventListener ("click", function() {
  SENSORS.push(new Sensor());
});

let focusSlider = document.getElementById("focus");
focusSlider.min = 0;
focusSlider.max = Math.sqrt(CANVAS.width*CANVAS.height);
focusSlider.step = 1;
focusSlider.value = FOCUS;
focusSlider.oninput = function() { FOCUS = this.value; }

let frontSlider = document.getElementById("front");
frontSlider.min = 0;
frontSlider.max = 1;
frontSlider.step = 1e-3;
frontSlider.value = 1-REAR;
frontSlider.oninput = function() { REAR = 1-this.value; }

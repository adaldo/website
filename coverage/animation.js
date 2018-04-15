const resultBox = document.getElementById("totalPenalty");

function animate() {
  requestAnimationFrame(animate);
  let totalPenalty = 0.0;
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
  for (let lmk of LANDMARKS) lmk.draw();
  for (let sns of SENSORS) {
    sns.update();
    sns.draw();
    totalPenalty += sns.totalPenalty;
  }
  resultBox.innerHTML = totalPenalty.toExponential(3);
  // console.log(SENSORS[0].velocity);
  // console.log(SENSORS[0].totalPenalty);
  // console.log(SENSORS[0].angularVelocity);
}

animate();

var canvas;
var ctx;

function start() {
  canvas = document.getElementById('sampleCanvas');
  ctx = canvas.getContext('2d');

  if (ctx == undefined) {
    console.log("ctx is undefined!!");
    return;
  }

  loop();
}

function loop() {
  clear();
  draw();
  setTimeout("loop()", 1000);
}

function draw() {
  draw_axis(axis);
  draw_orig_position();
  calc();
  draw_result();
  deg += 15;
}

function clear() {
  ctx.fillStyle = "#FFFFFF";
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();
}

var p = new THREE.Quaternion(2, 0, 0, 0);
var axis = new THREE.Vector3(0, 1, 0);
var p2 = new THREE.Quaternion();
var deg = 0;
function calc() {
  //var theta = Math.PI * 0.5;             // -> 4.440892098500626e-16, 0, 2, 0
  // var theta = 0.5 * 180 * Math.PI / 180; // -> 4.440892098500626e-16, 0, 2, 0
  // var theta = 45 * Math.PI / 180;        // -> 1.414213562373095, 0, 1.4142135623730951, 0

  var theta = deg * Math.PI / 180;
  var halfTheta = theta * 0.5;
  var q = new THREE.Quaternion(
      axis.x * Math.sin(halfTheta),
      axis.y * Math.sin(halfTheta),
      axis.z * Math.sin(halfTheta),
      Math.cos(halfTheta)
      );
  var r = new THREE.Quaternion();
  r.copy(q);
  r.conjugate();

  p2.copy(r);
  p2.multiply(p);
  p2.multiply(q);

  document.getElementById("axis").innerHTML = [axis.x, axis.y, axis.z].join(", ");
  document.getElementById("deg").innerHTML = deg;
  document.getElementById("rad").innerHTML = theta.toFixed("3");
  document.getElementById("p").innerHTML = [p.x, p.y, p.z, p.w].join(", ");
  document.getElementById("p2").innerHTML = [
    p2.x.toFixed(2),
    p2.y,
    p2.z.toFixed(2),
    p2.w
  ].join(", ");
}

function draw_axis(axis) {
  var margin = 10;

  // x
  ctx.strokeStyle = "#f1f1f1";
  ctx.beginPath();
  ctx.moveTo(margin, canvas.height / 2);
  ctx.lineTo(canvas.height - margin, canvas.height / 2);
  ctx.closePath();
  ctx.stroke();

  // y -> axis
  ctx.strokeStyle = "#606060";
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, margin);
  ctx.lineTo(canvas.width / 2, canvas.height - margin);
  ctx.closePath();
  ctx.stroke();
}

function draw_orig_position() {
  draw_on_orthogonal_coordinate(p, "#ffc7c7");
}

function draw_result() {
  draw_on_orthogonal_coordinate(p2, "#f85959");
}

function draw_on_orthogonal_coordinate(pos, color) {
  var zoom = 10;
  var drawing_pos = new THREE.Quaternion(0, 0, 0, 0);
  drawing_pos.x = pos.x * zoom + (canvas.width / 2);
  drawing_pos.y = pos.y + (canvas.height / 2);

  var rectSize = 5;
  ctx.fillStyle = color;
  ctx.fillRect(
      drawing_pos.x - rectSize / 2,
      drawing_pos.y - rectSize / 2,
      rectSize,
      rectSize);
}

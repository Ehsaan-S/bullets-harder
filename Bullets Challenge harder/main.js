//Canvas
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 600;

//Random functions
function RandomNum(min, max) {
  return Math.random() * (max - min) + min;
}
function getRandomColour() {
  return `#` + Math.floor(Math.random() * 16777215).toString(16);
}
let aPressed = false;
let dPressed = false;
let wPressed = false;
let sPressed = false;
let lastkeyPressed = "W";

//arrays
let targets = [];
let bullets = [];
// initial player
let player = {
  x: 400,
  y: 550,
  radius: 20,
  speed: 3,
  colour: "red",
};

//add targets
function addTargets(count) {
  for (let i = 0; i < count; i++) {
    targets.push({
      x: RandomNum(25, 775),
      y: RandomNum(25, 585),
      radius: RandomNum(10, 25),
      xspeed: RandomNum(-1, 1),
      yspeed: RandomNum(-1, 1),
      colour: getRandomColour(),
    });
  }
}
//add bullets
function addBullets(x, y) {
  bullets.push({
    x: x,
    y: y,
    radius: 4,
    xspeed: 3,
    yspeed: 3,
  });
}

// draw functions

function drawBullets() {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
  }
}

function drawPlayer(player) {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.colour;
  ctx.fill();

  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  if (lastkeyPressed === "W") {
    ctx.lineTo(player.x, player.y - player.radius);
  } else if (lastkeyPressed === "S") {
    ctx.lineTo(player.x, player.y + player.radius);
  } else if (lastkeyPressed === "A") {
    ctx.lineTo(player.x - player.radius, player.y);
  } else if (lastkeyPressed === "D") {
    ctx.lineTo(player.x + player.radius, player.y);
  }
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.closePath();
}

function drawtargets() {
  for (let i = 0; i < targets.length; i++) {
    let target = targets[i];
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fillStyle = target.colour;
    ctx.fill();
    ctx.closePath();
    target.x += target.xspeed;
    target.y += target.yspeed;
  }
}
//bounce targets
function bounceTargets() {
  for (let i = 0; i < targets.length; i++) {
    let target = targets[i];
    if (target.x + target.radius > cnv.width) {
      target.xspeed = -target.xspeed;
    }
    if (target.x - target.radius < 0) {
      target.xspeed = -target.xspeed;
    }
    if (target.y + target.radius > 500 - target.radius) {
      target.yspeed = -target.yspeed;
    }
    if (target.y - target.radius < 0) {
      target.yspeed = -target.yspeed;
    }
  }
}
//move Functions
function moveBullets() {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    if (lastkeyPressed === "W") {
      bullet.y += -bullet.yspeed;
    } if (lastkeyPressed === "S") {
      bullet.y += bullet.yspeed;
    }  if (lastkeyPressed === "A") {
      bullet.x += -bullet.xspeed;
    } if (lastkeyPressed === "D") {
      bullet.x += bullet.xspeed;
    }
  }
}
function movePlayer() {
  if (dPressed && player.x < cnv.width - player.radius) {
    player.x += player.speed;
  } else if (aPressed && player.x > player.radius) {
    player.x -= player.speed;
  } else if (wPressed && player.y - player.radius > 0) {
    player.y -= player.speed;
  } else if (sPressed && player.y + player.radius < cnv.height) {
    player.y += player.speed;
  }
}
function bulletBoundaryCollision() {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    if (bullet.y - bullet.radius < 0) {
      bullets.splice(i, 1);
    }
    if (bullet.y + bullet.radius > cnv.height) {
      bullets.splice(i, 1);
    }
    if (bullet.x + bullet.radius > cnv.width) {
      bullets.splice(i, 1);
    }
    if (bullet.x - bullet.radius < 0) {
      bullets.splice(i, 1);
    }
  }
}
//collison
function targetCollision() {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];

    for (let p = 0; p < targets.length; p++) {
      let target = targets[p];

      if (
        bullet.x + bullet.radius > target.x - target.radius &&
        bullet.x - bullet.radius < target.x + target.radius &&
        bullet.y + bullet.radius > target.y - target.radius &&
        bullet.y - bullet.radius < target.y + target.radius
      ) {
        bullets.splice(i, 1);
        targets.splice(p, 1);
      }
    }
  }
}

// key event listeners
document.addEventListener("keydown", keydownHandler);
function keydownHandler(e) {
  if (e.code === "KeyD") {
    dPressed = true;
    lastkeyPressed = "D";
  }
  if (e.code === "KeyA") {
    aPressed = true;
    lastkeyPressed = "A";
  }
  if (e.code === "KeyW") {
    wPressed = true;
    lastkeyPressed = "W";
  }
  if (e.code === "KeyS") {
    sPressed = true;
    lastkeyPressed = "S";
  }
}
document.addEventListener("keyup", keyupHandler);
function keyupHandler(e) {
  if (e.code === "KeyD") {
    dPressed = false;
  }
  if (e.code === "KeyA") {
    aPressed = false;
  }
  if (e.code === "KeyW") {
    wPressed = false;
  }
  if (e.code === "KeyS") {
    sPressed = false;
  }
}

document.addEventListener("mousedown", clickEvent);
function clickEvent() {
  addBullets(player.x, player.y);
}

//game loop
function gameLoop() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  drawPlayer(player);
  drawtargets();
  bounceTargets();
  movePlayer();
  drawBullets();
  moveBullets();
  bulletBoundaryCollision();
  targetCollision();

  requestAnimationFrame(gameLoop);
  d;
}
addTargets(20);
gameLoop();

var canvas = document.getElementById("gamearea");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2; //Her bestemmer vi farten på bolden i x og y retningen
var dy = -2;
var ballRadius = 10;
var paddleHeight = 25;
var paddleWidth = 167.5;
var paddleX = (canvas.width-paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5; //Her bestemmer vi hvor mange klodser vi ville have ved at sige hvor mange der skal være i en kolonne og hvor mange kolonner vi vil have
var brickColumnCount = 13;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);//Her laver vi controls til spillet ved at definere hvad der skal ske nå man trykker ned på pilvenstre eller pilhøjre
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() { //Her laver vi collisionDetection på klodserne og en wincondition ved at man smadre alle klodserne
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status == 1) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if(score == brickRowCount*brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload(); //Her genindlæser spillet siden så den kan starte forfra
            clearInterval(interval);
          }
        }
      }
    }
  }
}
function drawScore() { //Her laver vi scoren som man kan se øverst i venstre hjørne
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawball() { //Her bygger vi bolden ved at lave et arc der er 360 grader, ved at gøre det laver vi en cirkel og fylder den så med farve
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
function drawPaddle() { //Her bygger vi paddlen i spillet og bruger de variabler vi har i toppen
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawBricks() { //Her bygger spillet klodserne baseret på vores variabler brickRowCount og brickColumnCount
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() { //Her caller spillet alle de tidligere fumktioner vi har lavet og sætter dem ind i spillet en efter en
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawball()
  drawPaddle();
  drawScore();
  collisionDetection();

  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) { //Her foræller vi spillet at hvis boldens hibox er inde i enten højre eller venstre side af spilleboksen skal den ændre retning til det modsatte
    dx = -dx;
}

if(y + dy < ballRadius) { //Her fortæller vi spillet at hvis boldens hitbox er inde i toppen skal den skifte retning og hvis den rammer bunden er det game over
    dy = -dy;
} else if(y + dy > canvas.height-ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth) { //Her fortæller vi spillet at hvis bolden rammer paddlen skal det ikke være game over men den skal i stedet ændre retning til det modsatte
        dy = -dy
        dx += 0.25// Fart increase i x retningen hver gang bolden rammer paddlen
        dy -= 0.25// Fart increase i y retningen hver gang bolden rammer paddlen
    }
    else {
        alert("GAME OVER");
        document.location.reload();
        clearInterval(interval);
    }
}



    if(rightPressed) { //Her gør vi så paddlen ikke kan køre ud af banen
        paddleX += 12;
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(leftPressed) {
        paddleX -= 12;
        if (paddleX < 0){
            paddleX = 0;
        }
    }

  x += dx;
  y += dy;
}
var interval = setInterval(draw, 10); //Her sætter vi gamespeed

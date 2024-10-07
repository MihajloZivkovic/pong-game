var canvas;
var canvasContext;

var ballX = 0;
var ballSpeedX = 3;
var ballY = 0;
var ballSpeedY = 3;

var player1Score = 0;
var player2Score = 0;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 5;

const WINNING_SCORE = 5;
var winScreen = false;
var pause = true;


var difficulty = document.getElementById("difficulty");
var COMPUTER_STRENGTH = 1;

function getDifficulty(){
    COMPUTER_STRENGTH = difficulty.value;
}

function getDimensions(){
    canvas.width = document.getElementById("canvasDim").value;
    canvas.height = canvas.width - 200;
    if(canvas.width == 900){
        COMPUTER_STRENGTH += 1;
    }
    if(canvas.width == 700){
        COMPUTER_STRENGTH -= 1;
    }
}

function calculateMousePos(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top;
    return{
        x:mouseX,
        y:mouseY
    };
}

function handleMouseClick(evt){
    if(winScreen){
        player1Score = 0;
        player2Score = 0;
        winScreen = false;
    }
}

function pauseScreen(evt){
    if(pause){
        pause=false;
    }
    else{
        pause=true;
    }
}

window.onload = function(){
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");

    var framesPerSecond = 60;
    setInterval(function(){   
        moveEverything();
        drawEverything();
        console.log(paddle2Y);
    }, framesPerSecond/1000);
    canvas.addEventListener("mousedown", handleMouseClick);
    canvas.addEventListener("mousemove", 
        function(evt){
            var mousePos = calculateMousePos(evt);
            paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
        });
}

function ballReset(){
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
        winScreen = true;
    }
    firstBall();
}

function computerMovement() {
    var paddle2Center = paddle2Y + (PADDLE_HEIGHT / 2);

    if (paddle2Center < ballY -35) { 
        paddle2Y += Math.min(COMPUTER_STRENGTH, canvas.height - PADDLE_HEIGHT - paddle2Y); 
    }
    else if (paddle2Center > ballY +35) { 
        paddle2Y -= Math.min(COMPUTER_STRENGTH, paddle2Y); 
    }
}

function moveEverything(){
    if(winScreen || pause){
        return;
    }


    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if(ballX > canvas.width/2){
        computerMovement();
    }

    if(ballX < 0){
        //if hits paddle
       if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT){
        changeDirectionX();
        var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
        ballSpeedY = deltaY * 0.05;
       }
       //if misses paddle
       else{
            player2Score++;
            ballReset();
       }
    }

    if(ballX>canvas.width){
        //if hits paddle
        if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT){
            changeDirectionX();
            var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.05;
           }
        //if misses paddle
        else{
            player1Score++;
            ballReset();
        }
    }

    if(ballY > canvas.height || ballY < 0){
        changeDirectionY();
    }
}


function changeDirectionX(){
    ballSpeedX = -ballSpeedX;
}

function changeDirectionY(){
    ballSpeedY = -ballSpeedY;
}

function firstBall(){
    changeDirectionX()
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedY = 0;
}

function drawNet(){
    for(var i = 0; i <= canvas.height; i += 40){
        colorRect(canvas.width/2 - 1.5, i, 3, 20, "grey");
    }
}

function drawEverything(){
    //canvas
    colorRect(0,0,canvas.width,canvas.height,"black");
    //screen when someone wins
    if(pause && !winScreen){
        canvasContext.fillStyle ="yellow";
        canvasContext.fillText("Press 'Pause game' again to unpause", canvas.width/2 - 140, canvas.height/2 - 10);
        canvasContext.font = '15px verdana';
        return;
    }

    if(winScreen){
        canvasContext.fillStyle ="white";
        canvasContext.fillText("Click to reset", canvas.width/2 - 50, canvas.height/2 - 10);

        if(player1Score >= WINNING_SCORE){
            canvasContext.fillStyle ="green";
            canvasContext.fillText("Player won", canvas.width/2 - 60, canvas.height/2 - 40); 
        }
        else{
            canvasContext.fillStyle ="red";
            canvasContext.fillText("Computer won", canvas.width/2 - 60, canvas.height/2 - 40); 
        }
        return;
    }

    drawNet();

    //player paddle
    colorRect(5, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
    //opponent paddle
    colorRect(canvas.width-PADDLE_WIDTH*2, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
    //ball
    colorCircle(ballX,ballY,10,"white");
    //score
    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function colorCircle(centerX,centerY,radius,drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius,0, Math.PI * 2, false);
    canvasContext.fill();
}

function colorRect(leftX,topY,width,height,drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX,topY,width,height);
}
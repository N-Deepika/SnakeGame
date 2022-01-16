var changeSpeed = document.getElementById('changeSpeed'),
    startGame = document.getElementById('startGame');

startGame.addEventListener('click', function () {
    init();
});

changeSpeed.addEventListener('change', function (e) {
    speed = e.target.value;
}, false);
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    width = canvas.width,
    height = canvas.height,
    speed = 90,
    intervalId;

var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;
var score = 0;

var circle = function (x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);

    if ( fillCircle ) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

var Block = function (col, row) {
    this.col = col;
    this.row = row;
}

Block.prototype.drawSquare = function (color) {
    var x = this.col * blockSize;
    var y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
}

Block.prototype.drawCircle = function (color) {
    var centerX = this.col * blockSize + blockSize / 2;
    var centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize/2, true);
}

Block.prototype.equal = function (otherBlock) {
    return this.col == otherBlock.col && this.row == otherBlock.row;
}

var Snake = function () {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];

    this.direction = "right";
    this.nextDirection = "right";
}

Snake.prototype.draw = function () {
    for (var i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare("Green");
    }
}

Snake.prototype.move = function () {
    var head = this.segments[0];
    var newHead;

    this.direction = this.nextDirection;

    if ( this.direction == "right" ) {
        newHead = new Block(head.col + 1, head.row);
    } else if ( this.direction == "down" ) {
        newHead = new Block(head.col, head.row + 1);
    } else if ( this.direction == "left" ) {
        newHead = new Block(head.col - 1, head.row);
    } else if ( this.direction == "up" ) {
        newHead = new Block(head.col, head.row - 1);
    }

    if ( this.checkCollision(newHead) ) {
        gameOver();
        score = 0;
        return;
    }

    this.segments.unshift(newHead);

    if ( newHead.equal( apple.position ) ) {
        score++;
        apple.move();
    } else {
        this.segments.pop();
    }
}

Snake.prototype.checkCollision = function (head) {
    var leftCollsion = (head.col === 0);
    var topCollsion = (head.row === 0);
    var rightCollsion = (head.col === widthInBlocks - 1);
    var bottomCollsion = (head.row === heightInBlocks - 1);

    var wallCollision = leftCollsion || topCollsion || rightCollsion || bottomCollsion;

    var selfCollision = false;

    for ( var i = 0; i < this.segments.length; i++ ) {
        if ( head.equal( this.segments[i] ) ) {
            selfCollision = true;
        }
    }

    return wallCollision || selfCollision;
}

var directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
}

document.body.addEventListener('keydown', function (event) {
    var keyCode = event.keyCode ;
    var newDirection = directions[keyCode];
    if (newDirection != undefined) {
        snake.setDirection(newDirection);
    }
}, false);

Snake.prototype.setDirection = function (newDirection) {
    if ( this.direction == 'up' && newDirection == 'down' ) {
        return;
    }
    else if ( this.direction == 'left' && newDirection == 'right' ) {
        return;
    }
    else if ( this.direction == 'down' && newDirection == 'up' ) {
        return;
    }
    else if ( this.direction == 'right' && newDirection == 'left' ) {
        return;
    }

    this.nextDirection = newDirection;
}

var Apple = function () {
    this.position = new Block(10, 10);
}

Apple.prototype.draw = function() {
    this.position.drawCircle("red");
}

Apple.prototype.move = function () {
    var randomCol = Math.floor( Math.random() * ( widthInBlocks - 2 ) ) + 1;
    var randomRow = Math.floor( Math.random() * ( heightInBlocks - 2 ) ) + 1;
    this.position = new Block(randomCol, randomRow);
}

var apple = new Apple();
apple.move();
apple.draw();

var drawBorder = function () {
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
}

var drawScore = function () {
    ctx.font = "16px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score, blockSize, blockSize);
}

var gameOver = function () {
    clearInterval(intervalId);
    ctx.font = "60px Arial";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game over", width / 2, height /2 );
}

var snake = new Snake();
var apple = new Apple();

function init () {
    intervalId = setInterval(function () {
        ctx.clearRect(0, 0, 400, 400);
        drawScore();
        snake.move();
        snake.draw();
        apple.draw();
        drawBorder();
    }, 100);
}
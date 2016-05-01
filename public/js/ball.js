var w, h;
var speed = 50;
var context, myCanvas;
var bArr = [];

function loadData(tweetArr) {
    var lim = Math.min(13, tweetArr.length);
    for (var i = 0; i < lim; i++) {
        var tweet = tweetArr[i];
        var b = new ball(tweet['text'], tweet['name'], tweet['favorites'], tweet['followers']);
        bArr.push(b);
    }
    drawBalls();
}

function ball(text, user, likes, followers) {
    this.txt = text;
    this.user = user;
    this.likes = likes;
    this.followers = followers;
    this.rad = ((likes + followers) % 90) + 60;
    this.area = Math.PI * this.rad * this.rad;
    this.time = 0;
    var bCols = ["#99e6ff", "#80ccff", "#66a3ff", "#4d4dff", "#0040ff"];
    this.col = bCols[Math.floor(Math.random() * bCols.length)];

    this.x = Math.floor(Math.random() * (w - (2 * this.rad)) + this.rad);
    this.y = Math.floor(Math.random() * (h - (2 * this.rad)) + this.rad);

    var randX = Math.floor(Math.random() * 2);
    var randY = Math.floor(Math.random() * 2);
    if (randX == 1) this.dx = -1.5;
    else this.dx = 1.5;
    if (randY == 1) this.dy = -1.5;
    else this.dy = 1.5;
}

function init(canvas) {
  myCanvas = canvas.get(0);
  myCanvas.width = getWidth();
  myCanvas.height = 0.92 * getHeight();
  myCanvas.addEventListener("click", getMousePos, false);
  w = myCanvas.width;
  h = myCanvas.height;
  context = myCanvas.getContext('2d');
}

function drawBalls() {
    var arr = [];
    for (var i = 0; i < bArr.length; i++) {
        var ball = bArr[i];
        while (!checkValidPos(ball, arr)) {
            newPos(ball);
        }
        arr.push(ball);
    }
    bArr = arr;
    setInterval(draw, speed, arr);
}

function newPos(ball) {
    ball.x = Math.floor(Math.random() * (w - (2 * ball.rad)) + ball.rad);
    ball.y = Math.floor(Math.random() * (h - (2 * ball.rad)) + ball.rad);
}

function checkValidPos(b1, arr) {
    for (var i = 0; i < arr.length; i++) {
        var b2 = arr[i];
        if (overlaps(b1, b2)) {
            return false;
        }
    }
    return true;
}

function draw(arr) {
  context.clearRect(0,0, w, h);
  for (var i = 0; i < arr.length; i++) {
      var b = arr[i];
      context.beginPath();
      context.fillStyle=b.col;
      context.arc(b.x,b.y,b.rad,0,Math.PI*2,true);
      // b.rad += 0.1;
      context.closePath();
      context.fill();
      bounce(arr, i);

      // Boundary
      if(b.x + b.dx < b.rad || b.x + b.dx > w - b.rad) b.dx = -b.dx;
      if(b.y + b.dx < b.rad || b.y + b.dy > h - b.rad) b.dy = -b.dy;

      b.x+=b.dx;
      b.y+=b.dy;
  }
}

function bounce(arr, i) {
    var b1 = arr[i];
    for (var j = 0; j < arr.length; j++) {
        if (i != j) {
            var b2 = arr[j];
            makeBounce(b1, b2);
        }
    }
}

function makeBounce(b1, b2) {
    if (intersects(b1, b2)) {
           var dist = distance(b1, b2);
           if (dist < b1.rad + b2.rad) {
               var tempx = b1.dx;
               var tempy = b1.dy;
               b1.dx = b2.dx;
               b2.dx = tempx;
               b1.dy = b2.dy;
               b2.dy = tempy;
           }
    }
}

function distance(b1, b2) {
    return Math.sqrt(((b1.x - b2.x) * (b1.x - b2.x)) + ((b1.y - b2.y) * (b1.y - b2.y)));
}

function pDistance(x1, y1, x2, y2) {
    return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
}

function overlaps(b1, b2) {
    var dist = distance(b1, b2);
    if (dist <= b1.rad + b2.rad) {
        return true;
    }
    return false;
}

function intersects(b1, b2) {
    if (b1.x + b1.rad + b2.rad > b2.x
        && b1.x < b2.x + b1.rad + b2.rad
        && b1.y + b1.rad + b2.rad > b2.y
        && b1.y < b2.y + b1.rad + b2.rad) {
            return true;
    }
    return false;
}

function getMousePos(e) {
    var mouseX = e.clientX;
    var mouseY = e.clientY;
    var clickedBall = checkOnBall(mouseX, mouseY);
    if (clickedBall != null) {
        displayText(clickedBall);
    }
}

function checkOnBall(x, y) {
    for (var i = 0; i < bArr.length; i++) {
        var b = bArr[i];
        if (pDistance(x, y, b.x, b.y) < b.rad) {
            return b;
        }
    }
    return null;
}

function displayText(b) {
    alert(b.txt);
}

function getWidth() {
  if (window.innerHeight) {
    return window.innerWidth;
  }

  if (document.documentElement && document.documentElement.clientWidth) {
    return document.documentElement.clientWidth;
  }

  if (document.body) {
    return document.body.clientWidth;
  }
}
//
function getHeight() {
  if (window.innerHeight) {
    return window.innerHeight;
  }

  if (document.documentElement && document.documentElement.clientHeight) {
    return document.documentElement.clientHeight;
  }

  if (document.body) {
    return document.body.clientHeight;
  }
}

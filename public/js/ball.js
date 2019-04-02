var w, h;
var speed = 50;
var context, myCanvas;
var bArr = [];
var excessArr = [];
var animationId;
var landingPageId;
var waitTime = 36000;
var selectedBall = null;

function landingPage() {
    landingPageId = setInterval(drawLoad, 50);
    var radius = Math.min(w/2.5, h/2.5);
    var sb = new SimpleBall(w/2, h/2, radius);
    var ftSize = sb.rad/2;
    console.log(sb);

    function drawLoad() {
        context.clearRect(0,0, w, h);
        context.beginPath();
        context.fillStyle="#ff9966";

        context.arc(sb.x, sb.y, sb.rad, 0, Math.PI*2, true);
        context.closePath();
        context.fill();
        context.fillStyle = "#333";
        context.font = ftSize + "px helvetica";
        context.textAlign = "center";
        context.fillText("Twitgar", sb.x, sb.y);
        context.font = ftSize / 5 + "px helvetica"
        context.fillText("Simple visualizer for recent tweets", sb.x, sb.y + (sb.rad / 3.5));

        boundary(sb);

        sb.x+=sb.dx;
        sb.y+=sb.dy;
    }

    function SimpleBall(x, y, rad) {
        this.x = x;
        this.y = y;
        var randX = Math.floor(Math.random() * 2);
        var randY = Math.floor(Math.random() * 2);
        var dx = (Math.random()*0.5) + 1;
        var dy = (Math.random()*0.5) + 1;
        if (randX == 1) this.dx = -dx;
        else this.dx = dx;
        if (randY == 1) this.dy = -dy;
        else this.dy = dy;
        this.rad = rad;
    }
}

function loadData(tweetArr) {
  for (var i = 0; i < tweetArr.length; i++) {
    var tweet = tweetArr[i];
    var b = new ball(tweet['text'], tweet['name'], tweet['favorites'], tweet['followers']);
    b.url = tweet['url'];
    if (i < 12) {
        bArr.push(b);
    } else {
        excessArr.push(b);
    }
  }

  bArr.sort(function(a, b) {return a.rad < b.rad});
  for (var i = 0; i < bArr.length; i++) {
      bArr[i].time = i * ((Math.random() * 2000) + 1000);
  }
  drawBalls();
}

function ball(text, user, likes, followers) {
  this.txt = text;
  this.user = user;
  this.likes = likes;
  this.followers = followers;
  this.rad = ((likes + followers) % (w / 23)) + (w / 26);
  this.area = Math.PI * this.rad * this.rad;
  this.time = 0;
  this.grow = this.rad;
  this.newRad = this.rad;
  this.highlight = false;
  // #ffe066 #89e6ff
  var bCols = ["#ff6666", "#4dff88", "#56a3ff", "#ff9966", "#0041ff"];
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

function copyBall(b, b2) {
    b.txt = b2.txt;
    b.user = b2.user;
    b.likes = b2.likes;
    b.followers = b2.followers;
    b.grow = 1;
    b.newRad = b2.rad;
    b.area = b2.area;
    b.col = b2.col;
    b.time = 0;
    b.url = b2.url;
}

function init(canvas) {
  myCanvas = canvas.get(0);
  myCanvas.width = getWidth();
  myCanvas.height = 0.85 * getHeight();
  myCanvas.addEventListener("click", getMousePosClick);
  myCanvas.addEventListener("mousemove", getMousePos);
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
  animationId = setInterval(draw, speed, bArr);
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
    if (b.time >= waitTime) {
        b.rad -= 1.5;
        if (b.rad < 1) {
            // destroyBall(b);
            b.highlight = false;
            if (excessArr.length != 0) {
              copyBall(b, excessArr.shift());
            }
        }
    }

    if (b.grow < b.newRad) {
        b.rad += 0.3;
        b.grow += 0.3;
    }

    if (b.rad > 0) {
        b.time += speed;
        if (b.highlight) {
            context.beginPath();
            context.fillStyle = "#ccff00";
            context.arc(b.x, b.y, b.rad + 5, 0, Math.PI*2, true);
            context.closePath();
            context.fill();
        }
        context.beginPath();
        context.fillStyle = b.col;
        context.arc(b.x,b.y,b.rad,0,Math.PI*2,true);
        // b.rad += 0.1;
        context.closePath();
        context.fill();

        boundary(b);
        bounce(arr, i);

        b.x+=b.dx;
        b.y+=b.dy;
    }
  }
}

function boundary(b) {
    var visitedX = false;
    var visitedY = false;
    while (b.x + b.dx < b.rad) {
        b.x += 1;
        visitedX = true;
    }

     while (b.x + b.dx > w - b.rad) {
        b.x -= 1;
        visitedX = true;
     }

     while (b.y + b.dx < b.rad) {
         b.y += 1;
         visitedY = true;
     }

     while (b.y + b.dy > h - b.rad) {
         b.y -= 1;
         visitedY = true;
     }

     if (visitedX) {
         b.dx = -b.dx;
     }
     if (visitedY) {
         b.dy = -b.dy;
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
    var deltaX = b2.x - b1.x;
    var deltaY = b2.y - b1.y;

    var randX = Math.abs(b1.dx);
    var randY = Math.abs(b2.dy);
    if (overlaps(b1, b2)){
        if (deltaX >= 0 && deltaY >= 0) {
            b2.dx = randX;
            b1.dx = -b2.dx;
            b2.dy = randY;
            b1.dy = -b2.dy;
        } else if (deltaX >= 0 && deltaY <= 0) {
            b2.dx = randX;
            b1.dx = -b2.dx;
            b2.dy = -randY;
            b1.dy = -b2.dy;
        } else if (deltaX <= 0 && deltaY <= 0) {
            b2.dx = -randX;
            b1.dx = -b2.dx;
            b2.dy = -randY;
            b1.dy = -b2.dy;
        } else {
            b2.dx = -randX;
            b1.dx = -b2.dx;
            b2.dy = randY;
            b1.dy = -b2.dy;
        }
    }

    while (overlaps(b1, b2)) {
        b1.x += b1.dx;
        b2.x += b2.dx;
        b1.y += b1.dy;
        b2.y += b2.dy;
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
  var clickedBall = selectBall(mouseX, mouseY);
  if (clickedBall != null) {
    displayText(clickedBall);
  }
}

function getMousePosClick(e) {
  var mouseX = e.clientX;
  var mouseY = e.clientY;
  checkClick(mouseX, mouseY);
}

function checkClick(x, y) {
    for (var i = 0; i < bArr.length; i++) {
      var b = bArr[i];
      if (pDistance(x, y, b.x, b.y) < b.rad) {
        b.time = waitTime + 1000;
        if (b.url != undefined) {
          window.open(b.url);
        }
      }
    }
}


function selectBall(x, y) {
  for (var i = 0; i < bArr.length; i++) {
    var b = bArr[i];
    if (pDistance(x, y, b.x, b.y) < b.rad) {
      if (selectedBall) {
        selectedBall.highlight = false;
      }
      b.highlight = true;
      selectedBall = b;
      return b;
    }
  }
  return null;
}

function clear() {
  if (context) {
    context.clearRect(0, 0, myCanvas.width, myCanvas.height);
    clearInterval(animationId);
    clearInterval(landingPageId);
    bArr = [];
    excessArr = [];
  }
}

function displayText(b) {
  var invisibleDiv = document.getElementById('invisibleDiv');
  invisibleDiv.innerHTML = b.txt;
  invisibleDiv.style.width = w / 2.2 + "px";
  invisibleDiv.style.visibility = "visible";
}

// not being used
function destroyBall(b) {
    //animate b getting destroyed
    var newArr = [];
    for (var i = 0; i < bArr; i++) {
        var newBall = bArr[i];
        if (newBall !== b) {
            newArr.push(newBall);
        }
    }
    bArr = newArr;
    bArr.push(excessArr.shift());
}

function getNewBalls() {
    displayText({txt: "<div style=color:#ff9956;font-style:bold;font-size:26px>Hover over a ball to view tweet </br>Click to dismiss and open relevant link</div>"})
    var query = $('#text').val();
    if (query) {
      $.get( '/search', { text : query },
        function(data) {
          loadData(data);
        }
      );
    }
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

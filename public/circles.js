console.log('Client-side code running');

let score = 0;
let co = '#e84118';
let i = 0;

function Circle(x = 100, y = 100, r = 30, col = co) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.col = col;
  this.vx = 0.01;
  this.vy = 1;
}

Circle.prototype.move = function() {
  this.x += this.vx;
  this.y += this.vy;
};

Circle.prototype.draw = function() {
  fill(this.col);
  ellipse(this.x,this.y,this.r);
};

Circle.prototype.score = function() {
  textSize(20);
  text('Score: ' + score, 10, 30);
  fill(this.col);
}

let circles = [];
const numCircles = 31;

function setup() {
  createCanvas(640,480);
  background(0);

  for(let i = 0; i < numCircles; i++) {
    circles[i] = new Circle(random(0,width), random(0,height));
  }

  fetch('/score', {method: 'GET'})
  .then(function(response) {
    if(response.ok) return response.json();
    throw new Error('Request failed.');
  })
  .then(function(data) {
    if(data) {
      score = data.score;
    } else {
      score = 0;
    }
  })
  .catch(function(error) {
    console.log(error);
  });

  const button = document.getElementById('button');
  button.addEventListener('click', function(e) {
    console.log('button clicked');

    fetch('/score', {
    method: 'POST',
    body: JSON.stringify({score: score}),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(function(response) {
    if(response.ok) {
      console.log('Score were updated in the DB');
      return;
    }
    throw new Error('Request failed');
  })
  .catch(function(error) {
    console.log(error);
  });
});
  
}

function draw() {

  background("#2f3640");

  for(let i = 0; i < numCircles; i++) {
    circles[i].move();
    circles[i].draw();
    circles[i].score();
  }
}

function mousePressed() {

  for(let i = 0; i < numCircles; i++) {

    if(mouseX > (circles[i].x - circles[i].r) && mouseX < (circles[i].x + circles[i].r)) {

      if(mouseY < (circles[i].y + circles[i].r) && mouseY > (circles[i].y - circles[i].r)) {

      circles[i].col = 255;
      score = score + 10;

      console.log("clicked");
      console.log(score);

      // fetch('/clicked', {method:'POST'})
      // .then(function(response) {
      //   if(response.ok) {
      //     return;
      //   }
      //   throw new Error('Request failed.');
      // })
      // .catch(function(error) {
      //   console.log(error);
      // })
    }     
  }
}
}



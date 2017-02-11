//Array that holds each flame and its information
var flames = [];

//Object that holds information about each flame
function Flame() {
  //Generates the coordinates (relative to the logs) of the flame, and the size of the flame based on the coordinates
  this.x = randomInRange(-14, 14, true)/4;
  this.y = 0;
  this.size = 12 - Math.abs(this.x);

  //Sets the initial hue of the flame
  this.hue = randomInRange(0, 25, true);

  //Sets the offset of the flame, which determines how far side to side the flame is currently
  this.offset = randomInRange(-9, 9, true)/10;
  this.offset_step = 0.1;
  if (randomInRange(0, 1) > 0.5) this.offset_step = -0.1;

  //Update the position of the flame
  this.update = function() {
    //Updates the position of the flame
    this.y += 0.3;
    if (this.offset >= 1) this.offset_step = -0.1;
    else if (this.offset <= -1) this.offset_step = 0.1;
    this.offset += this.offset_step;

    //Updates the hue of the flame
    this.hue += 0.5;

    //Updates the size of the flame and deletes if size is too small
    this.size -= randomInRange(0.1, 0.2);
    var index = flames.indexOf(this);
    if (this.size <= 0) {
      if (index > -1) {
        flames.splice(index, 1);
        document.getElementById('flames').removeChild(document.getElementById('flames').children[index]);
        return;
      }
    }

    //Get the document element of this flames
    var document_flame = document.getElementById('flames').children[index];
    document_flame.style.left = (7.5 + this.x + this.offset) + 'vw';
    document_flame.style.top = (11 - this.y) + 'vw';
    document_flame.style.width = (this.size/5) + 'vw';
    document_flame.style.height = (this.size/5) + 'vw';
    document_flame.style.backgroundColor = 'hsl(' + Math.floor(this.hue) + ', 90%, 54%)';
  };

  var element = document.createElement('div');
  element.className = 'flame';
  element.style.position = 'absolute';
  element.style.left = (7.5 + this.x + this.offset) + 'vw';
  element.style.top = (11 - this.y) + 'vw';
  element.style.width = (this.size/5) + 'vw';
  element.style.height = (this.size/5) + 'vw';
  element.style.backgroundColor = this.color;
  document.getElementById('flames').appendChild(element);
};

//Variable that keeps track of the number of animation loops made
var loop_counter = 0;

//Main function of the program - draw the flames
function drawFlames() {
  //Creates new flames every so often
  if (loop_counter % 4 == 0) flames.push(new Flame());

  //Loop through existing flames and updates them
  for (var flame in flames) {
    flames[flame].update();
  }

  //Edits the loop counter
  loop_counter++;
  if (loop_counter >= 60) loop_counter = 0;
}

//Function that generates a random number in the specified range
function randomInRange(min, max, round) {
  var gen = Math.random() * (max - min) + min;
  if (round) gen = Math.floor(gen);
  return gen;
}

function start() {
  var now,
    dt = 0,
    last = timestamp(),
    step = 1/60,
    last_fps = timestamp(),
    fps = 0;

  function loop() {
    now = timestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
    while (dt > step) {
      dt = dt - step;
      drawFlames();
      fps++;
    }
    last = now;
    if (now - last_fps >= 1000) {
      console.log('FPS: ', fps);
      last_fps = now;
      fps = 0;
    }
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

//Function that returns the current timestamp
function timestamp() {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

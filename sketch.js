let c, draw;
let elements = [];
let compounds = [];

function setup() {
  c = document.getElementById("canvas");
  draw = c.getContext("2d");
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  for (let i = 0; i < 25; i++) {
    elements.push(new Element())
  }
  change();
  requestAnimationFrame(drawLoop)
}

function drawLoop() {
  draw.fillStyle = "rgb(31, 31, 31)"
  draw.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < elements.length; i++) {
    elements[i].show();
  }
  requestAnimationFrame(drawLoop)
}

function change() {
  compounds.splice(0, compounds.length);
  let ans = random(["element", "mixtureElem", "compound", "mixtureComp", "mixtureAll"]);
  // let ans = "element";
  let elems = shuffle([[1], [2], [3]]);
  let comps = shuffle([[1, 1, 2], [1, 3, 3], [1, 2, 3], [2, 2, 3], [1, 1, 3], [1, 2], [1, 3], [2, 3]]);
  if (ans == "element") {
    console.log("thingy")
    compounds.push(elems.pop());
    document.getElementById("1").onclick = () => {correctOrNot(true, 1)};
  }
  if (ans == "mixtureElem") {
    for (let i = 0; i < 3; i++) {
      compounds.push(elems.pop());
    }
    document.getElementById("2").onclick = () => {correctOrNot(true, 2)};
  }
  if (ans == "compound") {
    compounds.push(comps.pop());
    document.getElementById("3").onclick = () => {correctOrNot(true, 3)};
  }
  if (ans == "mixtureComp") {
    for (let i = 0; i < 3; i++) {
      compounds.push(comps.pop())
    }
    document.getElementById("4").onclick = () => {correctOrNot(true, 4)};
  }
  if (ans == "mixtureAll") {
    compounds.push(elems.pop());
    compounds.push(comps.pop());
    let x = shuffle(elems.concat(comps));
    for (let i = 0; i < 2; i++) {
      compounds.push(x.pop());
    }
    document.getElementById("5").onclick = () => {correctOrNot(true, 5)};
  }

  for (let i = 0; i < elements.length; i++) {
    elements[i].throw();
  }

  return ans;
}

const correctOrNot = (correct, id) => {
  console.log(correct);
  document.getElementById(id).onclick = () => {correctOrNot(false, id)};
  if (correct) {
    document.getElementById("correct-container").classList.toggle("anim2");
    setTimeout(() => {
      document.getElementById("correct-container").classList.toggle("anim2");
      change();
    }, 1000)
  } else {
    document.getElementById("incorrect-container").classList.toggle("anim2");
    setTimeout(() => {
      document.getElementById("incorrect-container").classList.toggle("anim2");
    }, 1000)
  }
}

const Element = function() {
  this.x = random(0, c.width);
  this.y = random(0, c.height);
  this.vx = 0;
  this.vy = 0;
  this.vr = random()*0.02;
  this.r = random()*Math.PI*2;
  this.type = random([[1], [2], [3]]);
  this.show = () => {
    let x = 0;
    let y = 0;
    draw.strokeStyle = "rgba(247, 255, 15, 1)";
    draw.lineWidth = "4";
    for (let i = 0; i < this.type.length; i++) {
      x = polarToCart([this.r, c.width/24])[0]+x;
      y = polarToCart([this.r, c.width/24])[1]+y;
      draw.beginPath()
      if (i+1 < this.type.length) {
        draw.moveTo(this.x, this.y);
        draw.lineTo(x+this.x, y+this.y);
      }
      draw.stroke();
    }
    x = 0;
    y = 0;
    for (let i = 0; i < this.type.length; i++) {
      draw.beginPath();
      this.fill(this.type[i])
      draw.arc(this.x+x, this.y+y, c.width/64, 0, Math.PI*2);
      x = polarToCart([this.r, c.width/24])[0]+x;
      y = polarToCart([this.r, c.width/24])[1]+y;
      draw.fill();
    }
    this.vx+=(random()-0.5)*0.2;
    this.vy+=(random()-0.5)*0.2;
    this.x+=this.vx;
    this.y+=this.vy;
    this.vx*=0.9;
    this.vy*=0.9;
    if (this.y > y.height) {
      this.y = 0;
    } else if (this.y < 0) {
      this.y = c.height;
    }
    this.r+=this.vr;
  }
  this.throw = () => {
    if (c.width/2 <= this.x) {
      this.vx+=100;
    } else {
      this.vx-=100;
    }
    setTimeout(() => {
      this.change();
    }, 1000)
  }
  this.send = () => {
    if (c.width/2 <= this.x) {
      this.vx-=100;
    } else {
      this.vx+=100;
    }
  }
  this.change = () => {
    this.type = random(compounds);
    this.send();
  }
  this.fill = (t) => {
    if (t == 1) {
      draw.fillStyle = "rgba(255, 107, 15, 1)"
    } else if (t == 2) {
      draw.fillStyle = "rgba(15, 255, 91, 1)"
    } else {
      draw.fillStyle = "rgba(247, 15, 255, 1)";
    }
  }
}

function polarToCart(x) {
  return [Math.cos(x[0])*x[1], Math.sin(x[0])*x[1]];
}

function random(x, y) {
  if (typeof x == "number" && typeof y == "number") {
    return Math.round(Math.random()*Math.abs(x-y))+x;
  }
  if (Array.isArray(x)) {
    return x[Math.floor(Math.random() * x.length)]
  }
  if (!x && !y) {
    return Math.random();
  }
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

setup();

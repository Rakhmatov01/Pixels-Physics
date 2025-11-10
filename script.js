// window.addEventListener("load", function () {
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const btn = document.getElementById("btn");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(e, x, y, color) {
    this.e = e;
    this.x = x;
    this.y = y;
    this.originX = Math.floor(x);
    this.originY = Math.floor(y);
    this.size = e.gap;
    this.color = color;
    this.vx = 0;
    this.vy = 0;
    this.ease = 0.1;
    this.dx = 0;
    this.dy = 0;
    this.distance = 0;
    this.force = 0;
    this.angle = 0;
    this.friction = 0.95;
  }
  draw(context) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.size, this.size);
  }
  update() {
    this.dx = this.e.mouse.x - this.x;
    this.dy = this.e.mouse.y - this.y;
    this.distance = this.dx * this.dx + this.dy * this.dy;
    this.force = -this.e.mouse.radius / this.distance;
    if (this.distance < this.e.mouse.radius) {
      // move pixel
      this.angle = Math.atan2(this.dy, this.dx);
      this.vx += this.force * Math.cos(this.angle);
      this.vy += this.force * Math.sin(this.angle);
    }
    this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
    this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
  }

  warp() {
    this.x = Math.random() * this.e.width;
    this.y = Math.random() * this.e.height;
    this.ease = 0.05;
  }
}

class Effect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.particlesArray = [];
    this.image = document.getElementById("image1");
    this.centerX = (width - this.image.width) * 0.5;
    this.centerY = (height - this.image.height) * 0.5;
    this.gap = 3;
    this.mouse = {
      radius: 3000,
      x: undefined,
      y: undefined,
    };

    window.addEventListener("mousemove", (event) => {
      this.mouse.x = event.x;
      this.mouse.y = event.y;
    });
  }
  init(context) {
    context.drawImage(this.image, this.centerX, this.centerY);
    const pixels = context.getImageData(0, 0, this.width, this.height).data;
    for (let y = 0; y < this.height; y += this.gap) {
      for (let x = 0; x < this.width; x += this.gap) {
        const index = (y * this.width + x) * 4;
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const alpha = pixels[index + 3];
        const color = "rgb(" + red + "," + green + "," + blue + ")";
        if (alpha > 0) {
          this.particlesArray.push(new Particle(this, x, y, color));
        }
      }
    }
  }

  draw(context) {
    this.particlesArray.forEach((particle) => particle.draw(context));
  }
  update() {
    this.particlesArray.forEach((particle) => particle.update());
  }
  warp() {
    this.particlesArray.forEach((particle) => particle.warp());
  }
}

const effect1 = new Effect(canvas.width, canvas.height);
effect1.init(ctx);
console.log(effect1.particlesArray);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect1.draw(ctx);
  effect1.update();
  requestAnimationFrame(animate);
}
animate();

// btn click
btn.addEventListener("click", function () {
  console.log("button clicked");
  effect1.warp();
});
// });

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworkscolors = ['#FF5C00', '#F2AA00', '#A66D9A', '#A66D9A', '#1F193D'];

function Fireworks(x, y, stopY, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.stopY = stopY;
    this.exploded = false;
    this.particles = [];

    this.draw = function () {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + 30);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = 'orange';
            ctx.stroke();
            ctx.lineWidth = 3;
        } else {
            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i].draw();
            }
        }
    }

    this.update = function () {
        if (this.y > this.stopY && !this.exploded) {
            this.y -= this.speed;
        } else if (!this.exploded) {
            this.explode();
        }

        if (this.exploded) {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                this.particles[i].update();
                if (this.particles[i].alpha <= 0) {
                    this.particles.splice(i, 1);
                }
            }
        }

        this.draw();
    }

    this.explode = function () {
        this.exploded = true;
        for (let i = 0; i < 100; i++) {
            this.particles.push(new Particle(this.x, this.y));
        }
    }
}

function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.length = Math.random() * 50 + 50;
    this.angle = Math.random() * 2 * Math.PI;
    this.speedX = Math.cos(this.angle);
    this.speedY = Math.sin(this.angle);
    this.color = fireworkscolors[Math.floor(Math.random() * fireworkscolors.length)];
    this.alpha = 3;

    this.draw = function () {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.length * this.speedX, this.y + this.length * this.speedY);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.restore();
    }

    this.update = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.02;
    }
}

const fireworksArray = [];

function launchFirework() {
    requestAnimationFrame(launchFirework);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < fireworksArray.length; i++) {
        fireworksArray[i].update();
    }
}
launchFirework();

canvas.addEventListener('click', function (event) {
    let x = event.clientX;
    let y = event.clientY;
    let speed = Math.random() * 5 + 1;
    fireworksArray.push(new Fireworks(x, innerHeight, y, speed));
});

setInterval(function () {
    let x = Math.random() * innerWidth;
    let speed = Math.random() * 5 + 1;
    fireworksArray.push(new Fireworks(x, innerHeight, Math.random() * innerHeight - 30, speed));
}, 3000);

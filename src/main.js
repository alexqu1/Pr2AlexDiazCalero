import './style.css';
import p5 from 'p5';
import { Haptics } from '@capacitor/haptics';

new p5((p) => {

  let games = [
    { name: "Zelda", type: "Aventura", desc: "Explora mundos y puzzles", color: [80, 200, 255] },
    { name: "Mario", type: "Plataformas", desc: "Salta niveles clásicos", color: [255, 80, 80] },
    { name: "Tetris", type: "Puzzle", desc: "Encaja piezas sin parar", color: [80, 255, 120] },
    { name: "Pacman", type: "Arcade", desc: "Come puntos y evita fantasmas", color: [255, 220, 80] },
    { name: "Batman", type: "Arcade", desc: "Derrota malos y Delicuentes ", color: [55, 220, 80] }
  ];

  let planets = [];
  let stars = [];
  let selected = null;
  let sound;

  const SIZE = 85;
  const MARGIN = SIZE;

  function getLastMonthName() {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toLocaleString('es-ES', { month: 'long' });
  }

  class Star {
    constructor() {
      this.reset();
      this.size = p.random(1, 3);
      this.speed = p.random(0.2, 1);
    }

    reset() {
      this.x = p.random(p.width);
      this.y = p.random(p.height);
    }

    update() {
      this.y += this.speed;
      if (this.y > p.height) {
        this.y = 0;
        this.x = p.random(p.width);
      }
    }

    draw() {
      p.noStroke();
      p.fill(255);
      p.circle(this.x, this.y, this.size);
    }
  }

  class Planet {
    constructor(game) {
      this.game = game;

      this.baseX = p.random(MARGIN, p.width - MARGIN);
      this.baseY = p.random(MARGIN, p.height - MARGIN);

      this.x = this.baseX;
      this.y = this.baseY;

      this.tx = this.x;
      this.ty = this.y;

      this.noiseOffsetX = p.random(1000);
      this.noiseOffsetY = p.random(4000);
    }

    update() {

      let targetX, targetY;

      if (!selected) {
        targetX = this.baseX;
        targetY = this.baseY;
      } else {
        if (selected === this) {
          targetX = p.width * 0.25;
        } else {
          targetX = p.width * 0.75;
        }
        targetY = this.baseY;
      }

      let floatX = p.noise(this.noiseOffsetX) * 20 - 10;
      let floatY = p.noise(this.noiseOffsetY) * 20 - 10;

      this.noiseOffsetX += 0.01;
      this.noiseOffsetY += 0.01;

      this.x += ((targetX + floatX) - this.x) * 0.08;
      this.y += ((targetY + floatY) - this.y) * 0.08;
    }

    draw() {
      this.update();

      p.noStroke();
      p.fill(this.game.color);

      p.circle(this.x, this.y, selected === this ? SIZE + 20 : SIZE);

      p.fill(0);
      p.textAlign(p.CENTER);
      p.textSize(12);
      p.text(this.game.name, this.x, this.y + 4);
    }

    hit(mx, my) {
      return p.dist(mx, my, this.x, this.y) < SIZE / 2;
    }
  }

  p.setup = () => {
    const canvas = p.createCanvas(window.innerWidth, window.innerHeight);

    canvas.elt.style.position = "fixed";
    canvas.elt.style.top = "0";
    canvas.elt.style.left = "0";
    canvas.elt.style.width = "100vw";
    canvas.elt.style.height = "100vh";

    sound = new Audio(window.location.origin + '/sound.mp3');

    for (let i = 0; i < 120; i++) {
      stars.push(new Star());
    }

    for (let i = 0; i < games.length; i++) {
      planets.push(new Planet(games[i]));
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  p.draw = () => {
    p.background(5, 5, 20);

    for (let s of stars) {
      s.update();
      s.draw();
    }

    p.fill(0, 255, 150);
    p.textAlign(p.CENTER);
    p.textSize(26);

    p.text(
      "TOP 5 JUEGOS - " + getLastMonthName().toUpperCase(),
      p.width / 2,
      40
    );

    for (let pl of planets) {
      pl.draw();
    }

    drawInfo();
  };

  function drawInfo() {
    if (!selected) return;

    let g = selected.game;
    let h = 100;

    p.noStroke();
    p.fill(0, 0, 0, 180);
    p.rect(0, p.height - h, p.width, h);

    p.fill(255);
    p.textAlign(p.LEFT);

    p.textSize(18);
    p.text(g.name, 20, p.height - 60);

    p.textSize(12);
    p.text("Tipo: " + g.type, 20, p.height - 40);

    p.text(g.desc, 20, p.height - 20, p.width - 40);
  }

  p.mousePressed = async () => {

    for (let pl of planets) {
      if (pl.hit(p.mouseX, p.mouseY)) {

        selected = (selected === pl) ? null : pl;

        try {
          sound.currentTime = 0;
          sound.play();
        } catch (e) {}

        try {
          await Haptics.vibrate();
        } catch (e) {}

        break;
      }
    }

    return false;
  };

});
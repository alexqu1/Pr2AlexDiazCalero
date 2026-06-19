import './style.css';
import p5 from 'p5';
import { Haptics } from '@capacitor/haptics';

new p5((p) => {

  let games = [];
  let planets = [];
  let stars = [];
  let selected = null;
  let sound;

  const API_KEY = "Aqui  iria el numero de api key";

  // ---------------- CONFIG (LOCALSTORAGE) ----------------
  let planetSize =
    Number(localStorage.getItem("planetSize")) || 85;

  let showStars =
    localStorage.getItem("showStars") !== "false";

  // ---------------- UTIL TEXTO ----------------
  function fitText(txt, maxChars) {
    if (!txt) return "";
    return txt.length > maxChars
      ? txt.slice(0, maxChars) + "..."
      : txt;
  }

  function getLastMonthName() {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toLocaleString('es-ES', { month: 'long' });
  }

  // ---------------- STARS ----------------
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

  // ---------------- PLANETS ----------------
  class Planet {
    constructor(game) {
      this.game = game;

      this.baseX = p.random(85, p.width - 85);
      this.baseY = p.random(85, p.height - 85);

      this.x = this.baseX;
      this.y = this.baseY;

      this.noiseOffsetX = p.random(1000);
      this.noiseOffsetY = p.random(4000);
    }

    draw() {
      this.update();

      let size =
        selected === this
          ? planetSize + 30
          : planetSize;

      // 🔥 glow
      p.drawingContext.shadowBlur = 25;
      p.drawingContext.shadowColor =
        `rgb(${this.game.color[0]},${this.game.color[1]},${this.game.color[2]})`;

      // 🎨 degradado simple
      for (let i = size; i > 0; i -= 4) {

        let alpha = p.map(i, 0, size, 30, 255);

        p.fill(
          this.game.color[0],
          this.game.color[1],
          this.game.color[2],
          alpha
        );

        p.noStroke();
        p.circle(this.x, this.y, i);
      }

      p.drawingContext.shadowBlur = 0;

      // 📝 texto blanco
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(11);
      p.text(fitText(this.game.name, 12), this.x, this.y);

      p.textSize(10);
      p.text("⭐ " + this.game.rating.toFixed(1), this.x, this.y + 18);
    }

    update() {

      let targetX, targetY;

      if (!selected) {
        targetX = this.baseX;
        targetY = this.baseY;
      } else {
        targetX =
          selected === this
            ? p.width * 0.25
            : p.width * 0.75;

        targetY = this.baseY;
      }

      let floatX = p.noise(this.noiseOffsetX) * 20 - 10;
      let floatY = p.noise(this.noiseOffsetY) * 20 - 10;

      this.noiseOffsetX += 0.01;
      this.noiseOffsetY += 0.01;

      this.x += ((targetX + floatX) - this.x) * 0.08;
      this.y += ((targetY + floatY) - this.y) * 0.08;
    }

    hit(mx, my) {
      return p.dist(mx, my, this.x, this.y) < planetSize / 2;
    }
  }

  // ---------------- API ----------------
  async function loadTopGames() {
    try {
      const res = await fetch(
        `https://corsproxy.io/?https://api.rawg.io/api/games?key=${API_KEY}&page_size=5&ordering=-rating`
      );

      const data = await res.json();

      games = data.results.map(g => ({
        name: g.name,
        type: g.genres?.[0]?.name || "Sin categoría",
        rating: g.rating || 0,
        color: [
          Math.random() * 255,
          Math.random() * 255,
          Math.random() * 255
        ]
      }));

      planets = games.map(g => new Planet(g));
      selected = null;

    } catch (err) {
      console.log("Fallback");
    }
  }

  // ---------------- SETUP ----------------
  p.setup = async () => {

    const canvas = p.createCanvas(
      window.innerWidth,
      window.innerHeight
    );

    canvas.elt.style.position = "fixed";
    canvas.elt.style.top = "0";
    canvas.elt.style.left = "0";

    sound = new Audio(window.location.origin + '/sound.mp3');

    for (let i = 0; i < 120; i++) {
      stars.push(new Star());
    }

    await loadTopGames();

    // ⚙️ DOM SETTINGS
    const btn =
      document.getElementById("settingsBtn");

    const panel =
      document.getElementById("settingsPanel");

    btn.onclick = () => {
      panel.classList.toggle("hidden");
    };

    const starCheck =
      document.getElementById("showStars");

    starCheck.checked = showStars;

    starCheck.onchange = () => {
      showStars = starCheck.checked;
      localStorage.setItem("showStars", showStars);
    };

    const sizeSlider =
      document.getElementById("planetSize");

    sizeSlider.value = planetSize;

    sizeSlider.oninput = () => {
      planetSize = Number(sizeSlider.value);
      localStorage.setItem("planetSize", planetSize);
    };
  };

  // ---------------- DRAW ----------------
  p.draw = () => {

    p.background(5, 5, 20);

    if (showStars) {
      for (let s of stars) {
        s.update();
        s.draw();
      }
    }

    p.fill(0, 255, 150);
    p.textAlign(p.CENTER);
    p.textSize(26);

    p.text(
      "TOP 5 JUEGOS - " +
      getLastMonthName().toUpperCase(),
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

    p.noStroke();
    p.fill(0, 0, 0, 180);
    p.rect(0, p.height - 100, p.width, 100);

    p.fill(255);
    p.textAlign(p.LEFT);

    p.textSize(18);
    p.text(g.name, 20, p.height - 60);

    p.textSize(12);
    p.text("Tipo: " + g.type, 20, p.height - 40);

    p.text("⭐ Rating: " + g.rating, 20, p.height - 20);
  }

  // ---------------- INPUT ----------------
  p.mousePressed = async () => {

    for (let pl of planets) {
      if (pl.hit(p.mouseX, p.mouseY)) {

        selected =
          selected === pl ? null : pl;

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
  };

});
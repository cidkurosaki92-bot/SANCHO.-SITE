const canvas = document.getElementById("matrix-bg");
const ctx = canvas.getContext("2d");
const output = document.getElementById("output");
const form = document.getElementById("cmd-form");
const input = document.getElementById("cmd-input");
const bgm = document.getElementById("bgm");

const members = ["cid", "zeko", "jerol", "gio", "leng", "leiko", "cy", "niah", "isha"];
const glyphs = "01SANCHO#$%@!*+-/<>?";
const fontSize = 16;
let columns = 0;
let drops = [];
let matrixSpeed = 1;

function resizeMatrix() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  columns = Math.floor(canvas.width / fontSize);
  drops = Array.from({ length: columns }, () => Math.random() * -40);
}

function drawMatrix() {
  ctx.fillStyle = "rgba(5, 0, 2, 0.11)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `bold ${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const char = glyphs[Math.floor(Math.random() * glyphs.length)];
    const x = i * fontSize;
    const y = drops[i] * fontSize;

    ctx.fillStyle = i % 5 === 0 ? "#ffffff" : "#ff1744";
    ctx.shadowColor = i % 5 === 0 ? "#ffffff" : "#ff002b";
    ctx.shadowBlur = i % 5 === 0 ? 14 : 10;
    ctx.fillText(char, x, y);

    if (y > canvas.height && Math.random() > 0.97) {
      drops[i] = 0;
    }
    drops[i] += matrixSpeed;
  }
  ctx.shadowBlur = 0;
  requestAnimationFrame(drawMatrix);
}

function printLine(text = "") {
  output.textContent += text + "\n";
  window.scrollTo(0, document.body.scrollHeight);
}

function startAudioAutoplay() {
  if (!bgm) return;
  bgm.loop = true;
  bgm.volume = 1.0;
  const playPromise = bgm.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      const unlock = () => {
        bgm.play().catch(() => {});
        document.removeEventListener("pointerdown", unlock);
        document.removeEventListener("keydown", unlock);
      };
      document.addEventListener("pointerdown", unlock, { once: true });
      document.addEventListener("keydown", unlock, { once: true });
    });
  }
}

function runCommand(raw) {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return;
  printLine(`sancho@root:~$ ${raw}`);

  if (cmd === "help") {
    printLine("Commands: help, members, matrix, cls");
  } else if (cmd === "members") {
    printLine("SANCHO (" + members.length + "): " + members.join(" | "));
  } else if (cmd === "matrix") {
    matrixSpeed = matrixSpeed === 1 ? 2.2 : 1;
    printLine("Matrix feed active. Intensity: " + (matrixSpeed > 1 ? "OVERDRIVE" : "STANDARD"));
  } else if (cmd === "cls") {
    output.textContent = "";
  } else {
    printLine(`Unknown command: ${cmd}. Type 'help'.`);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const val = input.value;
  input.value = "";
  runCommand(val);
});

window.addEventListener("resize", resizeMatrix);
resizeMatrix();
drawMatrix();
startAudioAutoplay();
printLine("SANCHO ONLINE // RED-WHITE MATRIX ACTIVE");

const sanchoAudio = document.getElementById("bgAudio") || new Audio("anghell.mp3");
sanchoAudio.loop = true;
sanchoAudio.muted = false;
sanchoAudio.volume = 1.0;
sanchoAudio.preload = "auto";

function playUnmutedSanchoAudio() {
  sanchoAudio.muted = false;
  sanchoAudio.volume = 1.0;
  const p = sanchoAudio.play();
  if (p && typeof p.then === "function") {
    p.then(() => {
      document.removeEventListener("pointerdown", playUnmutedSanchoAudio);
      document.removeEventListener("touchstart", playUnmutedSanchoAudio);
      document.removeEventListener("keydown", playUnmutedSanchoAudio);
    }).catch(() => {});
  }
}

window.addEventListener("DOMContentLoaded", playUnmutedSanchoAudio);
document.addEventListener("pointerdown", playUnmutedSanchoAudio, { passive: true });
document.addEventListener("touchstart", playUnmutedSanchoAudio, { passive: true });
document.addEventListener("keydown", playUnmutedSanchoAudio);

(() => {
  const applySubGlow = () => {
    const heading = Array.from(document.querySelectorAll("h1, h2, h3, div, p, span"))
      .find((el) => el.textContent && el.textContent.trim() === "SANCHO");
    if (!heading) return;

    let sibling = heading.nextElementSibling;
    while (sibling) {
      if (sibling.tagName !== "CANVAS" && sibling.tagName !== "AUDIO") {
        sibling.classList.add("sancho-subglow");
      }
      sibling = sibling.nextElementSibling;
    }
  };

  window.addEventListener("DOMContentLoaded", applySubGlow);
  applySubGlow();
})();

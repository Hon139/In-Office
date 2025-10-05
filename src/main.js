import { startGame } from "./js/start-game.js";          // your boot function (or the init you showed)
import { SocketNet } from "./js/net.js";       // your socket adapter (see step 4)

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

function initAvatarButtons() {
  // Render images into the .av buttons
  $$(".av").forEach((btn, i) => {
    const src = btn.dataset.src;
    console.log("load: " + src);

    // Preload so we can show a friendly fallback if it 404s
    const img = new Image();
    img.onload = () => { btn.style.backgroundImage = `url("${src}")`; };
    img.onerror = (e) => {
      console.warn("[avatar] failed to load:", src, e?.message || e);
      btn.textContent = "❓";
      btn.style.background = "#333";
    };
    img.src = src;

    btn.addEventListener("click", () => {
      $$(".av").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      btn.dataset.selected = "true";
    });
    if (i === 0) btn.click(); // default select first
  });
}

async function start() {
  const name = $("#name").value.trim() || "Guest";
  const sel = $(".av.selected");
  const avatar = sel?.dataset.src;

  if (!avatar) {
    $("#msg").textContent = "Pick a profile photo.";
    $("#msg").style.display = "block";
    return;
  }

  // expose for the game / net layer
  window.playerName = name;
    window.playerAvatar = "a1";

  if(avatar == "./data/img/avatars/a1.jpg") {
    window.playerAvatar = "a1";
  } else if(avatar == "./data/img/avatars/a2.jpg") {
    window.playerAvatar = "a2";
  } else if(avatar == "./data/img/avatars/a3.jpg") {
    window.playerAvatar = "a3";
  } else {
    window.playerAvatar = "a4";
  }

  // swap screens
  $("#landing").style.display = "none";
  $("#game-root").style.display = "block";

  // boot melonJS
  await startGame(); // if you don't have bootGame, export a startGame() that runs your me.video.init block

  // connect to server and include name+avatar
  const net = new SocketNet(window.CONFIG.WS_URL);
  await net.connect({ room: "main", name, avatar });
  window.net = net; // if your scenes read it
}

window.addEventListener("DOMContentLoaded", () => {
  initAvatarButtons();

  // keyboard submit
  $("#name").addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("#start").click();
  });

  $("#start").addEventListener("click", start);
});

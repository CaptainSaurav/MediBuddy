console.log("SCRIPT LOADED");

// ================= CONFIG =================
let avatarConfig = JSON.parse(localStorage.getItem("mediAvatar")) || {
  body: 1,
  hair: 0,
  eyes: "normal"
};

// ================= SET BODY =================
function setBody(num) {
  avatarConfig.body = num;

  const bodyLayer = document.getElementById("bodyLayer");
  if (bodyLayer) {
    bodyLayer.src = `images/body${num}.png`;
  }
}

// ================= SET HAIR =================
function setHair(num) {
  avatarConfig.hair = num;

  const hairLayer = document.getElementById("hairLayer");
  if (hairLayer) {
    hairLayer.src = `images/hair${num}.png`;
  }
}``
// ================= SET EMOTION =================
function setEmotion(type) {
  avatarConfig.eyes = type;

  const eyesLayer = document.getElementById("eyesLayer");
  if (!eyesLayer) return;

  eyesLayer.src = `images/eyes_${type}.png`;
}

// ================= SAVE =================
function saveAvatar() {

  const nicknameInput = document.getElementById("nickname");
  const nickname = nicknameInput ? nicknameInput.value.trim() : "";

  if (!nickname) {
    alert("Please choose a nickname for your Medi.");
    return;
  }

  avatarConfig.nickname = nickname;

  localStorage.setItem("mediAvatar", JSON.stringify(avatarConfig));

  window.location.href = "menu.html";
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {

  if (!avatarConfig.body) avatarConfig.body = 1;
  if (!avatarConfig.hair) avatarConfig.hair = 0;
  if (!avatarConfig.eyes) avatarConfig.eyes = "normal";

  const bodyLayer = document.getElementById("bodyLayer");
  const hairLayer = document.getElementById("hairLayer");
  const eyesLayer = document.getElementById("eyesLayer");

  if (bodyLayer) {
    bodyLayer.src = `images/body${avatarConfig.body}.png`;
  }

  if (hairLayer && avatarConfig.hair !== 0) {
    hairLayer.src = `images/hair${avatarConfig.hair}.png`;
  }

  if (eyesLayer) {
    eyesLayer.src = `images/eyes_${avatarConfig.eyes}.png`;
  }
randomBlink();
});
// ================= BLINK =================
function randomBlink() {

  const minDelay = 800;     // shortest blink gap (ms)
  const maxDelay = 6000;    // max 3 seconds 

  const delay = Math.random() * (maxDelay - minDelay) + minDelay;

  setTimeout(() => {

    const previousEmotion = avatarConfig.eyes;

    // only blink if not already closed
    if (previousEmotion !== "closed") {

      const eyesLayer = document.getElementById("eyesLayer");
      if (!eyesLayer) return;

      eyesLayer.src = "images/eyes_closed.png";

      // blink duration
      const blinkDuration = 50 + Math.random() * 150;

      setTimeout(() => {
        eyesLayer.src = `images/eyes_${previousEmotion}.png`;
      }, blinkDuration);
    }

    randomBlink(); // schedule next blink

  }, delay);
}

function signup() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter username and password.");
    return;
  }

  if (localStorage.getItem("mediUser")) {
    alert("User already exists. Please login.");
    return;
  }

  localStorage.setItem("mediUser", username);
  localStorage.setItem("mediPass", password);

  alert("Account created successfully!");
  window.location.href = "avatar.html";
}

// ================= LOGIN =================
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const storedUser = localStorage.getItem("mediUser");
  const storedPass = localStorage.getItem("mediPass");

  if (!storedUser) {
    alert("No account found. Please sign up.");
    return;
  }

  if (username === storedUser && password === storedPass) {
    window.location.href = "avatar.html";
  } else {
    alert("Incorrect username or password.");
  }
}
  console.log("SCRIPT LOADED");

  // ================= CONFIG =================
  let avatarConfig = JSON.parse(localStorage.getItem("mediAvatar")) || {
    body: 1,
    hair: 0,
    eyes: "normal"
  };

  // Inject warning animation styles
  const style = document.createElement("style");
  style.innerHTML = `
  @keyframes pulseDanger {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes shake {
    0%,100% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
  }

  .dangerPulse {
    animation: pulseDanger 1s infinite;
  }

  .dangerShake {
    animation: shake 0.5s infinite;
  }
  `;
  document.head.appendChild(style);

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
  }
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

    const minDelay = 1000;
    const maxDelay = 5000;

    const delay = Math.random() * (maxDelay - minDelay) + minDelay;

    setTimeout(() => {

      const eyes =
        document.getElementById("menuEyes") ||
        document.getElementById("eyesLayer");

      if (!eyes) {
        randomBlink();
        return;
      }

      const stats = JSON.parse(localStorage.getItem("mediStats")) || {
        hunger: 100,
        thirst: 100,
        sleep: 100
      };

      let emotion = getCurrentEmotion(stats);

      // Don't blink if asleep
      if (emotion !== "closed") {

        eyes.src = "images/eyes_closed.png";

        setTimeout(() => {
          eyes.src = `images/eyes_${emotion}.png`;
        }, 120);
      }

      randomBlink();

    }, delay);
  }
  //==== SIGN UP ====
 function signup() {

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter username and password.");
    return;
  }

  // Get all users or create empty object
  let users = JSON.parse(localStorage.getItem("mediUsers")) || {};

  if (users[username]) {
    alert("Username already taken.");
    return;
  }

  // Save new user
  users[username] = password;
  localStorage.setItem("mediUsers", JSON.stringify(users));

  alert("Account created successfully!");
  window.location.href = "avatar.html";
} 
  // ================= LOGIN =================
  function login() {

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  let users = JSON.parse(localStorage.getItem("mediUsers")) || {};

  if (!users[username]) {
    alert("No account found. Please sign up.");
    return;
  }

  if (users[username] === password) {
    localStorage.setItem("currentUser", username);
    window.location.href = "avatar.html";
  } else {
    alert("Incorrect username or password.");
  }
}
  // ================= MINI HUD =================
  function updateMiniHUD(stats) {
    if (!document.getElementById("miniHUD")) return;

    ["hunger", "thirst", "sleep"].forEach(stat => {

      const bar = document.getElementById(stat + "Bar");
      const text = document.getElementById(stat + "Text");

      if (!bar) return;

      const value = stats[stat];

      bar.style.width = value + "%";
      if (text) text.innerText = Math.round(value) + "%";

      // Remove previous warning classes
      bar.classList.remove("dangerPulse", "dangerShake");

      // Warning logic
      if (value <= 15) {
        bar.classList.add("dangerPulse", "dangerShake");
        bar.classList.remove("bg-blue-400", "bg-red-400", "bg-purple-400");
        bar.classList.add("bg-red-600");
      }
      else if (value <= 30) {
        bar.classList.remove("bg-blue-400", "bg-purple-400");
        bar.classList.add("bg-red-400");
      }
    });
    
    updateEmotionFromStats(stats);
  }

  function getCurrentEmotion(stats) {

    if (stats.sleep < 25) return "closed";
    if (stats.hunger < 25 || stats.thirst < 25) return "sad";

    return "normal";
  }
  // ================= EMOTION UPDATE =================
  function updateEmotionFromStats(stats) {

  const avatarEyes = document.getElementById("menuEyes") || 
                     document.getElementById("eyesLayer")||
                     document.getElementById("careEyes") ||
                     document.getElementById("sleepEyes");

  if (!avatarEyes) return;

  let emotion = "normal";

  // 💤 Sleep lowest priority (exhaustion overrides happy)
  if (stats.sleep < 25) {
    emotion = "closed";
  }
  // 😢 Needs
  else if (stats.hunger < 25 || stats.thirst < 25) {
    emotion = "sad";
  }
  // 😄 HAPPY MODE
  else if (
    stats.hunger >= 60 &&
    stats.thirst >= 60 &&
    stats.sleep >= 60
  ) {
    emotion = "happy";
  }

  avatarEyes.src = `images/eyes_${emotion}.png`;
}
  // ================= GLOBAL STAT ENGINE =================

  function getStats() {
    let stats = JSON.parse(localStorage.getItem("mediStats"));

    if (!stats) {
      stats = { hunger: 100, thirst: 100, sleep: 100 };
      localStorage.setItem("mediStats", JSON.stringify(stats));
    }

    return stats;
  }

  function saveStats(stats) {
    localStorage.setItem("mediStats", JSON.stringify(stats));
  }

  function updateAllHUD(stats) {

    ["hunger", "thirst", "sleep"].forEach(stat => {

      const bar = document.getElementById(stat + "Bar");
      if (!bar) return;

      const value = stats[stat];

      bar.style.width = value + "%";

      // Remove previous warning classes
      bar.classList.remove("dangerPulse", "dangerShake");

      if (value <= 15) {
        bar.classList.add("dangerPulse", "dangerShake");
      }

    });

    // Update mini HUD if it exists
    updateMiniHUD(stats);

    // ALWAYS update avatar emotion
    updateEmotionFromStats(stats);
  }
  function startStatDecay() {

  const decayPerSecond = {
    hunger: 0.8,   // medium
    thirst: 1.5,   // fastest
    sleep: 0.4     // slowest
  };

  let lastTime = Date.now();

  function tick() {

    const now = Date.now();
    const deltaSeconds = (now - lastTime) / 1000;
    lastTime = now;

    // 🔥 ALWAYS READ FRESH STATS
    let stats = JSON.parse(localStorage.getItem("mediStats")) || {
      hunger: 80,
      thirst: 90,
      sleep: 75
    };

    stats.hunger = Math.max(0, stats.hunger - decayPerSecond.hunger * deltaSeconds);
    stats.thirst = Math.max(0, stats.thirst - decayPerSecond.thirst * deltaSeconds);
    stats.sleep  = Math.max(0, stats.sleep  - decayPerSecond.sleep  * deltaSeconds);

    localStorage.setItem("mediStats", JSON.stringify(stats));

    updateMiniHUD(stats);

    if (document.getElementById("hungerBar") && 
        !document.getElementById("miniHUD")) {

      document.getElementById("hungerBar").style.width = stats.hunger + "%";
      document.getElementById("thirstBar").style.width = stats.thirst + "%";
      document.getElementById("sleepBar").style.width  = stats.sleep  + "%";
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

  document.addEventListener("DOMContentLoaded", () => {

    const stats = getStats();
    updateAllHUD(stats);

    // Only start decay if stats system exists
    if (document.getElementById("hungerBar") ||
        document.getElementById("miniHUD")) {
      startStatDecay();
      loadSleepAvatar();
    }

    randomBlink();
  });

  // ================= LOAD SMALL AVATAR (SLEEP PAGE) =================
function loadSleepAvatar() {

  const avatar = JSON.parse(localStorage.getItem("mediAvatar"));
  if (!avatar) return;

  const body = document.getElementById("sleepBody");
  const hair = document.getElementById("sleepHair");
  const eyes = document.getElementById("sleepEyes");

  if (!body || !eyes) return;

  body.src = `images/body${avatar.body}.png`;

  if (avatar.hair && avatar.hair !== 0) {
    hair.src = `images/hair${avatar.hair}.png`;
  }

  eyes.src = `images/eyes_${avatar.eyes}.png`;
} 
// ================= LOGOUT =================
function logout() {

  // Remove only session-related things
  localStorage.removeItem("mediAvatar");
  localStorage.removeItem("mediStats");

  // Optional: also remove login info
  // Uncomment below if you want full account reset
  // localStorage.removeItem("mediUser");
  // localStorage.removeItem("mediPass");

  window.location.href = "index.html";
}
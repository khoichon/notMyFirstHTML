function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
window.sleep = sleep

if (localStorage.getItem("notTheEnd") == "true" && !sessionStorage.getItem("notTheEnd")){
  localStorage.removeItem("notTheEnd");
  window.location.href = "./part6.html";
};


function openmsginfo(title,message) {
  // Position the popup at the center of the screen
  let left = (screen.width - 300) / 2;
  let top = (screen.height - 120) / 2;
  let popup = window.open("./popups/msgbox/info.html", "msgbox", "width=300,height=120,left=" + left + ",top=" + top)

  // Wait for the user to click "OK"
  return new Promise((resolve)=> {
    // wait until the user clicks "OK"
    if (!popup) {
      reject("Popup blocked");
    }
    popup.onload = function() {
      popup.document.title = title;
      popup.document.getElementById("message").innerHTML = message;
      popup.document.getElementById("ok").onclick = function() {
        popup.close();
        resolve();
      }
    }
  })
}

function openmsgquestion(title, message) {
  let left = (screen.width - 300) / 2;
  let top = (screen.height - 120) / 2;
  let popup = window.open("./popups/msgbox/question.html", "msgbox", "width=300,height=120,left=" + left + ",top=" + top);

  return new Promise((resolve, reject) => {
    if (!popup) return reject("Popup blocked");

    // Poll until the popup DOM is ready
    let interval = setInterval(() => {
      if (popup.document && popup.document.getElementById("yes") && popup.document.getElementById("no") && popup.document.getElementById("message")) {
        clearInterval(interval);
        popup.document.title = title;
        popup.document.getElementById("message").innerHTML = message;

        popup.document.getElementById("yes").onclick = () => {
          popup.close();
          resolve(true);
        };
        popup.document.getElementById("no").onclick = () => {
          popup.close();
          resolve(false);
        };
      }
    }, 50); // check every 50ms
  });
}


// ahh not the SPEEDRUN TIMER HANDLER!!!!!!
// This is the speedrun timer handler
// It will be used to time the player's speedrun
// It will be stored in localStorage
// It will be displayed in the top right corner of the screen
// It will be formatted as HH:MM:SS.MS
// It will be updated every 10ms
// It will be started when the player loads the page
document.addEventListener("DOMContentLoaded", () => {
  let path = window.location.pathname.includes('%20')
    ? '/part9.html'
    : window.location.pathname;
  if (localStorage.getItem("speedrun") !== "true") return;

  // create timer display
  const div = document.createElement("div");
  div.id = "speedrun";
  div.style.position = "fixed";
  div.style.top = "0";
  div.style.right = "0";
  div.style.background = "black";
  div.style.color = "white";
  div.style.padding = "10px";
  div.style.fontFamily = "monospace";
  div.style.zIndex = "9999";
  document.body.appendChild(div);

  let paused = false;

  // initialize main timer
  let start = Number(localStorage.getItem("speedrun_main"));

  if (!start || isNaN(start)) {
    start = Date.now();
    localStorage.setItem("speedrun_main", start);
  }

  // initialize split storage
  if (!localStorage.getItem("speedrun_split")) {
    localStorage.setItem("speedrun_split", JSON.stringify({}));
  }

  let splits = JSON.parse(localStorage.getItem("speedrun_split"));

  if (!splits[path]) {
    let splitStart = splits[path];

    if (!splitStart || isNaN(splitStart)) {
      splits[path] = Date.now();
      localStorage.setItem("speedrun_split", JSON.stringify(splits));
    }
    localStorage.setItem("speedrun_split", JSON.stringify(splits));
  }

  // format milliseconds -> HH:MM:SS.MMM
  function format(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor((ms % 3600000) / 60000);
    let s = Math.floor((ms % 60000) / 1000);
    let msr = ms % 1000;

    return (
      String(h).padStart(2,"0") + ":" +
      String(m).padStart(2,"0") + ":" +
      String(s).padStart(2,"0") + "." +
      String(msr).padStart(3,"0")
    );
  }

  function update() {

    if (paused) return;
    

    const mainStart = parseInt(localStorage.getItem("speedrun_main"), 10);
    let path = window.location.pathname.includes('%20') 
    ? '/part9.html' 
    : window.location.pathname;

    if (!splits[path]) {
      splits[path] = Date.now();
      localStorage.setItem("speedrun_split", JSON.stringify(splits));
    }

    const splitStart = splits[path];

    const mainTime = Date.now() - mainStart;
    const splitTime = Date.now() - splitStart;

    if (localStorage.getItem("speedrun_splits") === "true") {
      div.innerHTML =
        format(mainTime) + "<br>" +
        format(splitTime);
    } else {
      div.textContent = format(mainTime);
    }

  }

  setInterval(update, 16); // ~60fps

  // expose controls globally
  window.pauseSpeedrun = () => paused = true;
  window.resumeSpeedrun = () => paused = false;

});
let path = window.location.pathname.includes('%20') 
? '/part9.html' 
: window.location.pathname;

if (path.endsWith("index.html")) {
  path = "/";
}

// Pause timer when the user unloads and resume timer when the user loads
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden"){
    pauseSpeedrun();
  }
  else {if (document.visibilityState === "visible") {
    resumeSpeedrun();
  }}
});

// When user cursor hovers over the speedrun div hide it (use css)
document.addEventListener("DOMContentLoaded", () => {
  const element = document.getElementById("speedrun");
  if (!element) return;

  element.addEventListener('mouseenter', () => {
    element.style.display = 'none'; // Style to apply on hover
  });

  element.addEventListener('mouseleave', () => {
    element.style.display = 'inline-block'; // Revert style when leaving
  });

});



// alright now add an cursor effect to show a circular gradient from 100% (at cursor) to 0% (at 100px away). The colour is #ffff00
// This is a very simple effect, but it looks nice
// Can be enabled and disabled at will through window.enableCursorEffect() and window.disableCursorEffect()
// You can edit properties with window.editCursorEffect(col,distance,opacity)
// also create a canvas element to the screen for this effect
function enableCursorEffect() {
  if (window.cursorEffectEnabled) return;
  window.cursorEffectEnabled = true;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  window.cursorEffect = {
    col: "#ffff00",
    distance: 200,
    opacity: 1,
    canvas,
    ctx,
    lastX: 0,
    lastY: 0
  };

  function draw(x, y) {
    const { col, distance, opacity, ctx, canvas } = window.cursorEffect;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, distance);
    gradient.addColorStop(0, col + Math.round(opacity * 255).toString(16).padStart(2, "0"));
    gradient.addColorStop(1, col + "00");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  window.cursorEffect.draw = draw;

  window.cursorEffect.mousemove = (e) => {
    if (!window.cursorEffectEnabled) return;

    window.cursorEffect.lastX = e.clientX;
    window.cursorEffect.lastY = e.clientY;

    draw(e.clientX, e.clientY);
  };

  window.cursorEffect.resize = () => {
    if (!window.cursorEffectEnabled) return;

    const { canvas } = window.cursorEffect;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    draw(window.cursorEffect.lastX, window.cursorEffect.lastY);
  };

  window.addEventListener("mousemove", window.cursorEffect.mousemove);
  window.addEventListener("resize", window.cursorEffect.resize);
}

function disableCursorEffect() {
  if (!window.cursorEffectEnabled) return;

  window.cursorEffectEnabled = false;

  document.body.removeChild(window.cursorEffect.canvas);
  window.removeEventListener("mousemove", window.cursorEffect.mousemove);
  window.removeEventListener("resize", window.cursorEffect.resize);
}

function editCursorEffect(col, distance, opacity) {
  if (!window.cursorEffectEnabled) return;

  if (col !== undefined) window.cursorEffect.col = col;
  if (distance !== undefined) window.cursorEffect.distance = distance;
  if (opacity !== undefined) window.cursorEffect.opacity = opacity;

  const { lastX, lastY, draw } = window.cursorEffect;
  draw(lastX, lastY); // redraw immediately
}

window.enableCursorEffect = enableCursorEffect;
window.disableCursorEffect = disableCursorEffect;
window.editCursorEffect = editCursorEffect;




// Typewriter!!!
function typewriterHTML(html, element, speed, append = false) {
    return new Promise((resolve) => {

        if (!append) {
            element.innerHTML = html;
        } else {
            element.insertAdjacentHTML("beforeend", html);
        }

        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        textNodes.forEach(node => {
            if (!node.originalText) {
                node.originalText = node.nodeValue;
                node.nodeValue = "";
            }
        });

        let nodeIndex = 0;
        let charIndex = 0;

        function type() {
            if (nodeIndex >= textNodes.length) {
                resolve();
                return;
            }

            let currentNode = textNodes[nodeIndex];

            if (charIndex < currentNode.originalText.length) {
                currentNode.nodeValue += currentNode.originalText.charAt(charIndex);
                charIndex++;
                setTimeout(type, speed);
            } else {
                nodeIndex++;
                charIndex = 0;
                type();
            }
        }

        type();
    });
}


// okay time for more cursor effects yay :>
const _cursorTextQueue = [];
let _cursorTextRunning = false;

async function cursorTextPopup(text, col = "#ffffff") {
  _cursorTextQueue.push({ text, col });
  if (_cursorTextRunning) return;
  _cursorTextRunning = true;

  while (_cursorTextQueue.length > 0) {
    const { text, col } = _cursorTextQueue.shift();
    await _runCursorTextPopup(text, col);
  }
  
  _cursorTextRunning = false;
}

async function _runCursorTextPopup(text, col) {
  // use cursorEffect canvas if available, otherwise make one
  let canvas, ctx;

  if (window.cursorEffect?.canvas) {
    canvas = window.cursorEffect.canvas;
    ctx = window.cursorEffect.ctx;
  } else {
    canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;top:0;left:0;pointer-events:none;z-index:9999;";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
  }

  function getPos() {
    const x = window.cursorEffect?.lastX ?? canvas.width / 2;
    const y = window.cursorEffect?.lastY ?? canvas.height / 2;
    return { x, y };
  }

  function draw(opacity) {
    const { x, y } = getPos();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
    ctx.font = "40px monospace";
    ctx.fillStyle = col;
    ctx.fillText(text, x, y);
    ctx.globalAlpha = 1;

    // redraw cursor glow on top if it's active
    if (window.cursorEffectEnabled && window.cursorEffect) {
      const { col: glowCol, distance, opacity: glowOpacity } = window.cursorEffect;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, distance);
      gradient.addColorStop(0, glowCol + Math.round(glowOpacity * 255).toString(16).padStart(2, "0"));
      gradient.addColorStop(1, glowCol + "00");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  // fade in
  for (let opacity = 0; opacity <= 1; opacity += 0.05) {
    draw(opacity);
    await sleep(30);
  }

  // fade out
  for (let opacity = 1; opacity >= 0; opacity -= 0.05) {
    draw(opacity);
    await sleep(30);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
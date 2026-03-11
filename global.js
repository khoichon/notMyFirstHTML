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

  if (!splits[window.location.pathname]) {
    let splitStart = splits[window.location.pathname];

    if (!splitStart || isNaN(splitStart)) {
      splits[window.location.pathname] = Date.now();
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
    let path = window.location.pathname;

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
let path = window.location.pathname;

if (path.endsWith("index.html")) {
  path = "/";
}

// Pause timer when the user unloads (use visibilitychange instead))
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden"){
    pauseSpeedrun();
  }
});




// Check if the user ever passed a part where you have to exit the page (eg. part5), if not, then redirect them to the index


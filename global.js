function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


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

function openmsgquestion(title,message) {
  // Position the popup at the center of the screen
  let left = (screen.width - 300) / 2;
  let top = (screen.height - 120) / 2;
  let popup = window.open("./popups/msgbox/question.html", "msgbox", "width=300,height=120,left=" + left + ",top=" + top)
  // Wait for the user to click either "Yes" or "No" before retuning the result
  return new Promise((resolve,reject)=>{
    if (!popup) {
      reject("Popup blocked");
    }
    popup.onload = function() {
      popup.document.title = title;
      popup.document.getElementById("message").innerHTML = message;
      popup.document.getElementById("yes").onclick = function() {
        popup.close();
        resolve(true);
      }
      popup.document.getElementById("no").onclick = function() {
        popup.close();
        resolve(false);
      }
    }
  });
}
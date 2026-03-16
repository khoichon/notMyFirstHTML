function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main service worker for part 15 (notifications part)
self.addEventListener('message', async function(event){
  if (event.data === "close") {
    console.log("Starting notification puzzle")
    self.registration.showNotification("Secret", {
      body: "Okay, so now we cannot be overheard.",
      icon: "../icon.png" // Optional: URL of the notification icon
    });
    await sleep(5000);
    self.registration.showNotification("Secret", {
      body: "I have a secret to tell you.",
      icon: "../icon.png" // Optional: URL of the notification icon
    });
    await sleep(5000);
    self.registration.showNotification("Secret", {
       body: "This place isn't real.",
       icon: "../icon.png" // Optional: URL of the notification icon
    });
    await sleep(5000);
    self.registration.showNotification("Secret", {
      body: "You will soon have to make a choice.",
      icon: "../icon.png" // Optional: URL of the notification icon
    });
    await sleep(5000);
    self.registration.showNotification("Secret", {
      body: "But that will be for future you to deal with.",
      icon: "../icon.png" // Optional: URL of the notification icon
    });
    await sleep(5000);
    self.registration.showNotification("Secret", {
      body: "I will leave you now.",
      icon: "../icon.png" // Optional: URL of the notification icon
    });
    notification = new Notification("Secret", {
      body: "Click here to continue.",
      icon: "../icon.png" // Optional: URL of the notification icon
    });
    notification.onclick = () => {
      window.open("../part16.html", "_blank");
    };
  };
});
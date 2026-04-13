function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
self.addEventListener('install', event => {
  self.skipWaiting();
});
// Main service worker for part 15 (notifications part)
self.addEventListener('message', async function(event){
  if (event.data === "p15-close") {
    console.log("Starting notification puzzle")
    self.registration.showNotification("Secret", {
      body: "Okay, so now we cannot be overheard.",
      icon: "./icon.png" // Optional: URL of the notification icon
    });
    await sleep(5000);
    self.registration.showNotification("Secret", {
      body: "I have a secret to tell you.",
      icon: "./icon.png" // Optional: URL of the notification icon
    });
    await sleep(5000);
    self.registration.showNotification("Secret", {
       body: "This place isn't real.",
       icon: "./icon.png" // Optional: URL of the notification icon
    });
    await sleep(5000);
    self.registration.showNotification("Secret", {
      body: "You will soon have to make a choice.",
      icon: "./icon.png" // Optional: URL of the notification icon
    });
    await sleep(5000);
    self.registration.showNotification("Secret", {
      body: "But that will be for future you to deal with.",
      icon: "./icon.png" // Optional: URL of the notification icon
    });
    await sleep(5000);
    self.registration.showNotification("Secret", {
      body: "I will leave you now.",
      icon: "./icon.png" // Optional: URL of the notification icon
    });
    self.registration.showNotification("Secret", {
      body: "Click here to continue.",
      icon: "./icon.png" // Optional: URL of the notification icon
    });
    self.addEventListener("notificationclick", event => {
      event.notification.close();

      event.waitUntil(
        clients.openWindow("../part16.html")
      );
    });
  };
});



// For the offline part17-19 part:
const CACHE_NAME = 'my-app-v1';

const ASSETS_TO_CACHE = [
  '/offline/part17.html',
  '/offline/part18-intro.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});


self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const targetPages = ['/part17.html', '/part18-intro.html'];

  if (url.hostname.includes("supabase.co")) return;

  if (targetPages.includes(url.pathname)) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(`/offline${url.pathname}`)
        })
    );
    return;
  }

  event.respondWith(fetch(event.request));
});


// The next section is entirely for /misc/taskmanager
// Every time the index.html page is loaded, it SHOULD send all the tasks over to the service worker
// The service worker will then store them in the cache
// The service worker will read from it, find the start and end times, and then send a notification when the task  starts and is due
// ============================================================
// TASK MANAGER - Receives tasks and schedules notifications
// ============================================================

const TASK_CACHE = "task-cache-v1"
self.addEventListener("message", async (event) => {
  if (event.data?.type !== "SYNC_TASKS") return;

  const tasks = event.data.tasks;

  // Store tasks in cache
  const cache = await caches.open(TASK_CACHE);
  await cache.put(
    "/tasks",
    new Response(JSON.stringify(tasks), {
      headers: { "Content-Type": "application/json" },
    })
  );

  // Schedule notifications for each task
  tasks.forEach((task) => scheduleTaskNotifications(task));
});

function scheduleTaskNotifications(task) {
  const now = Date.now();

  const startTime = new Date(task.time_start).getTime();
  const endTime = new Date(task.time_end).getTime();

  // Notify when task starts
  if (startTime > now) {
    setTimeout(() => {
      self.registration.showNotification("Task Starting!", {
        body: `${task.task} is starting now!`,
        tag: `start-${task.name}-${task.task}`,
      });
    }, startTime - now);
  }

  // Notify when task is due
  if (endTime > now) {
    setTimeout(() => {
      self.registration.showNotification("Task Due!", {
        body: `${task.task} is due now!`,
        tag: `end-${task.name}-${task.task}`,
      });
    }, endTime - now);
  }
}
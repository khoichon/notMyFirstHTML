const SUPABASE_URL = "https://digtgktzyxonguxhhdri.supabase.co/rest/v1";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ3Rna3R6eXhvbmd1eGhoZHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NDkzNzksImV4cCI6MjA4ODAyNTM3OX0.YYSwTR1Ns_zs7n5Brp6qTGZ1MYD_avfseMi1aGRcHGc";

const headers = {
  "apikey": API_KEY,
  "Authorization": `Bearer ${API_KEY}`,
  "Content-Type": "application/json"
};

async function sbRequest(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/${path}`, {
    headers,
    ...options
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

async function createTask(data) {
  return sbRequest("tasks_story", {
    method: "POST",
    headers: {
      ...headers,
      Prefer: "return=representation"
    },
    body: JSON.stringify(data)
  });
}

async function getTasks() {
  return sbRequest("tasks_story");
}

async function getTaskById(id) {
  return sbRequest(`tasks_story?id=eq.${id}`);
}

async function getTasksByName(name) {
  return sbRequest(`tasks_story?name=eq.${encodeURIComponent(name)}`);
}

async function updateTask(id, data) {
  return sbRequest(`tasks_story?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

async function deleteTask(id) {
  return sbRequest(`tasks_story?id=eq.${id}`, {
    method: "DELETE"
  });
}

async function getTasksBetween(start, end) {
  return sbRequest(
    `tasks_story?time_start=gte.${start}&time_end=lte.${end}`
  );
}

async function getTasksSorted(field = "time_start", dir = "asc") {
  return sbRequest(`tasks_story?order=${field}.${dir}`);
}

async function getLatestTasks(limit = 10) {
  return sbRequest(`tasks_story?order=created_at.desc&limit=${limit}`);
}

async function searchTasks(text) {
  return sbRequest(`tasks_story?task=ilike.*${encodeURIComponent(text)}*`);
}

async function queryTasks(query) {
  return sbRequest(`tasks_story?${query}`);
}
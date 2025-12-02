// src/api/api.js

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export async function uploadTimetable(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }

  return res.json(); // { success, totalEntries, clashes }
}

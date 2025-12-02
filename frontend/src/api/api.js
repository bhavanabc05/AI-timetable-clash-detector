// const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

// export async function uploadTimetable(file) {
//   const form = new FormData();
//   form.append("file", file);

//   const res = await fetch(`${API_BASE}/api/detect/upload`, {
//     method: "POST",
//     body: form,
//   });

//   if (!res.ok) {
//     const msg = await res.text();
//     throw new Error(msg || "Upload failed");
//   }

//   return res.json();
// }

// export async function fetchSuggestions(timetable, clashes) {
//   const res = await fetch(`${API_BASE}/api/suggest/fix`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ timetable, clashes }),
//   });

//   if (!res.ok) {
//     const msg = await res.text();
//     throw new Error(msg || "Suggestion fetch failed");
//   }

//   return res.json();
// }

// frontend/src/api/api.js
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

/**
 * Upload CSV and detect clashes
 */
export async function uploadTimetable(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/api/detect/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Upload failed");
  }

  return res.json();
}

/**
 * Fetch AI suggestions for detected clashes
 */
export async function fetchSuggestions(timetable, clashes) {
  const res = await fetch(`${API_BASE}/api/suggest/fix`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timetable: timetable || [],
      clashes: clashes || [],
    }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Suggestion fetch failed");
  }

  return res.json();
}
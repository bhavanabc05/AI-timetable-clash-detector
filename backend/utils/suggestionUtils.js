// suggestionUtils.js

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

function findFreeRoom(timetable, day, startMin, endMin, excludeRoom, reservedRooms) {
  const rooms = new Set(timetable.map((t) => t.room));

  // fallback rooms
  ["101", "102", "103", "104", "105", "Lab-1"].forEach((r) => rooms.add(r));

  for (const room of rooms) {
    if (room === excludeRoom) continue;
    if (reservedRooms.has(room)) continue;

    const occupied = timetable.some(
      (entry) =>
        entry.room === room &&
        entry.day === day &&
        overlaps(entry.startMin, entry.endMin, startMin, endMin)
    );

    if (!occupied) return room;
  }
  return null;
}

function canPlaceAtSlot(timetable, day, startMin, endMin, teacher, reservedRooms) {
  const teacherBusy = timetable.some(
    (e) =>
      e.teacher === teacher &&
      e.day === day &&
      overlaps(e.startMin, e.endMin, startMin, endMin)
  );

  if (teacherBusy) return null;

  return findFreeRoom(timetable, day, startMin, endMin, null, reservedRooms);
}

function findNextFreeSlotForTeacher(
  timetable,
  teacher,
  startDay,
  origStartMin,
  origEndMin,
  reservedRooms
) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let startIndex = days.indexOf(startDay);

  if (startIndex === -1) startIndex = 0;

  const duration = origEndMin - origStartMin;
  const step = 30;

  for (let d = 0; d < days.length; d++) {
    const day = days[(startIndex + d) % days.length];
    let candidateStart = d === 0 ? origEndMin + step : 8 * 60;

    for (; candidateStart + duration <= 18 * 60; candidateStart += step) {
      const end = candidateStart + duration;
      const room = canPlaceAtSlot(timetable, day, candidateStart, end, teacher, reservedRooms);
      if (room) {
        return {
          day,
          startMin: candidateStart,
          endMin: end,
          startStr: minutesToStr(candidateStart),
          endStr: minutesToStr(end),
          room,
        };
      }
    }
  }

  return null;
}

function tryFindSwap(timetable, A, B, reservedRooms) {
  return null; // simplified for now
}

function minutesToStr(m) {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

module.exports = {
  findFreeRoom,
  findNextFreeSlotForTeacher,
  tryFindSwap,
  overlaps,
};

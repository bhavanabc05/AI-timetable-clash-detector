module.exports = function detectClashes(timetable) {
  let clashes = [];

  // Group by day
  const grouped = {};
  timetable.forEach((entry) => {
    if (!grouped[entry.day]) grouped[entry.day] = [];
    grouped[entry.day].push(entry);
  });

  // Check for clashes day-wise
  for (let day in grouped) {
    const dayEntries = grouped[day];

    for (let i = 0; i < dayEntries.length; i++) {
      for (let j = i + 1; j < dayEntries.length; j++) {

        const A = dayEntries[i];
        const B = dayEntries[j];

        const overlap = A.startMin < B.endMin && B.startMin < A.endMin;
        if (!overlap) continue;

        // Teacher clash
        if (A.teacher === B.teacher) {
          clashes.push({
            type: "Teacher Clash",
            day,
            entries: [A, B],
          });
        }

        // Room clash
        if (A.room === B.room) {
          clashes.push({
            type: "Room Clash",
            day,
            entries: [A, B],
          });
        }

        // Year clash
        if (A.year === B.year) {
          clashes.push({
            type: "Year Clash",
            day,
            entries: [A, B],
          });
        }
      }
    }
  }

  return clashes;
};

const { parse } = require("csv-parse");

module.exports = function parseCsv(buffer) {
  return new Promise((resolve, reject) => {
    parse(
      buffer,
      {
        // 1. Normalize headers to lowercase to handle "Day", "day", "DAY" etc.
        columns: (header) => header.map((column) => column.trim().toLowerCase()), 
        trim: true,
        skip_empty_lines: true,
      },
      (err, records) => {
        if (err) return reject(err);

        // Convert times to minutes for easier clash detection
        const formatted = records.map((r) => ({
          // 2. Now access properties using lowercase keys safely
          course: r.course,
          teacher: r.teacher,
          year: r.year,
          room: r.room,
          day: r.day,
          start: r.start,
          end: r.end,
          resource: r.resource || null,

          startMin: convertToMinutes(r.start),
          endMin: convertToMinutes(r.end),
        }));

        resolve(formatted);
      }
    );
  });
};

function convertToMinutes(time) {
  if (!time) return 0; // Safety check
  const [h, m] = time.split(":");
  return parseInt(h) * 60 + parseInt(m);
}
const { parse } = require("csv-parse");

module.exports = function parseCsv(buffer) {
  return new Promise((resolve, reject) => {
    parse(
      buffer,
      {
        columns: true,
        trim: true,
        skip_empty_lines: true,
      },
      (err, records) => {
        if (err) return reject(err);

        // Convert times to minutes for easier clash detection
        const formatted = records.map((r) => ({
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
  const [h, m] = time.split(":");
  return parseInt(h) * 60 + parseInt(m);
}

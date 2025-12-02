const express = require("express");
const router = express.Router();
const {
  findFreeRoom,
  findNextFreeSlotForTeacher,
  tryFindSwap,
} = require("../utils/suggestionUtils");

/*
  We will:
  ✔ Avoid repeating suggestions for the same class
  ✔ Reserve rooms when used
  ✔ Merge repeated clashes into one suggestion
*/

router.post("/fix", (req, res) => {
  try {
    const { timetable, clashes } = req.body;

    if (!Array.isArray(timetable) || !Array.isArray(clashes)) {
      return res.status(400).json({
        error: "Invalid payload. Expect { timetable: [...], clashes: [...] }",
      });
    }

    const suggestions = [];
    const suggestedFor = new Set(); // store course names we already suggested
    const reservedRooms = new Set(); // avoid reusing suggested rooms

    for (const clash of clashes) {
      if (!clash?.entries || clash.entries.length < 2) continue;

      const [A, B] = clash.entries;
      const clashDesc = clash.type || "Clash";

      // We always try fixing the SECOND entry (B) first
      const target = B;

      // If we already suggested a fix for this class, skip
      if (suggestedFor.has(target.course)) continue;

      // -----------------------------
      // 1) Try room fix (same time)
      // -----------------------------
      const altRoom = findFreeRoom(
        timetable,
        target.day,
        target.startMin,
        target.endMin,
        target.room,
        reservedRooms
      );

      if (altRoom) {
        suggestions.push({
          clashType: clashDesc,
          issue: `${clashDesc} involving ${target.course}`,
          fix: `Move "${target.course}" → room ${altRoom} (${target.day} ${target.start}-${target.end})`,
          confidence: 0.9,
        });

        suggestedFor.add(target.course);
        reservedRooms.add(altRoom);
        continue;
      }

      // -----------------------------
      // 2) Try teacher next free slot
      // -----------------------------
      const nextSlot = findNextFreeSlotForTeacher(
        timetable,
        target.teacher,
        target.day,
        target.startMin,
        target.endMin,
        reservedRooms
      );

      if (nextSlot) {
        suggestions.push({
          clashType: clashDesc,
          issue: `${clashDesc} involving ${target.course}`,
          fix: `Move "${target.course}" → ${nextSlot.day} ${nextSlot.startStr}-${nextSlot.endStr} (room ${nextSlot.room})`,
          confidence: 0.8,
        });

        suggestedFor.add(target.course);
        reservedRooms.add(nextSlot.room);
        continue;
      }

      // -----------------------------
      // 3) Try swapping
      // -----------------------------
      const swap = tryFindSwap(timetable, A, B, reservedRooms);
      if (swap) {
        suggestions.push({
          clashType: clashDesc,
          issue: `${clashDesc} involving ${swap.original.course}`,
          fix: `Swap "${swap.original.course}" ↔ "${swap.swapWith.course}"`,
          confidence: 0.7,
        });

        suggestedFor.add(swap.original.course);
        continue;
      }

      // -----------------------------
      // 4) Fallback (no auto fix)
      // -----------------------------
      if (!suggestedFor.has(target.course)) {
        suggestions.push({
          clashType: clashDesc,
          issue: `${clashDesc} involving ${target.course}`,
          fix: `Manual reschedule suggested for "${target.course}"`,
          confidence: 0.3,
        });
        suggestedFor.add(target.course);
      }
    }

    return res.json({ suggestions });
  } catch (err) {
    console.error("Suggestion Error:", err);
    return res.status(500).json({ error: "Suggestion engine failed" });
  }
});

module.exports = router;

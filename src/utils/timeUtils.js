// src/utils/timeUtils.js - Chronomancy Horological Time Math & Formatting

/**
 * Converts a 24h time string ("HH:MM" e.g. "07:30" or "16:45") to minutes from midnight
 */
export function timeStringToMinutes(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  if (parts.length < 2) return 0;
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

/**
 * Converts minutes from midnight (0 - 1439) to a 24h string ("HH:MM")
 */
export function minutesToTimeString(totalMinutes) {
  const norm = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Formats a 24h time string into 12h (with AM/PM) or 24h format
 */
export function formatDisplayTime(timeStr, format = '12h') {
  if (!timeStr) return '';
  if (timeStr.toLowerCase() === 'now' || timeStr.toLowerCase().includes('slot')) return timeStr;
  
  if (format === '24h') {
    return timeStr;
  }

  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;

  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // '0' becomes '12'

  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Calculates duration in minutes between start time and end time
 */
export function calculateDurationBetween(startTimeStr, endTimeStr) {
  const startMin = timeStringToMinutes(startTimeStr);
  let endMin = timeStringToMinutes(endTimeStr);
  if (endMin < startMin) {
    endMin += 1440; // spans across midnight
  }
  return endMin - startMin;
}

/**
 * Computes end time string by adding duration (min) to start time string
 */
export function computeEndTime(startTimeStr, durationMinutes) {
  const startMin = timeStringToMinutes(startTimeStr);
  return minutesToTimeString(startMin + durationMinutes);
}

/**
 * Builds an interleaved timeline array containing both logged blocks and 
 * collapsible 30-minute unallocated void gaps, similar to coding syntax blocks.
 */
export function buildTimelineWithGaps(schedule, options = {}) {
  const {
    slotSizeMinutes = 30,
    dayStartMinutes = 390, // 06:30 AM
    dayEndMinutes = 1380   // 23:00 PM (11:00 PM night wind-down)
  } = options;

  if (!schedule || schedule.length === 0) return [];

  // Sort valid schedule blocks chronologically
  const sortedBlocks = [...schedule]
    .filter(b => b.time && b.duration)
    .map(b => {
      const startMin = timeStringToMinutes(b.time);
      const endMin = startMin + b.duration;
      return {
        ...b,
        startMin,
        endMin,
        isGap: false
      };
    })
    .sort((a, b) => a.startMin - b.startMin);

  if (sortedBlocks.length === 0) return [];

  const timelineItems = [];
  const effectiveStart = Math.min(dayStartMinutes, sortedBlocks[0].startMin);
  let cursorMin = effectiveStart;

  sortedBlocks.forEach((block, idx) => {
    // If there is an unallocated gap of at least 15 minutes before this block
    if (block.startMin > cursorMin) {
      const gapTotalMinutes = block.startMin - cursorMin;
      
      if (gapTotalMinutes >= 15) {
        let chunkCursor = cursorMin;
        while (chunkCursor < block.startMin) {
          const remaining = block.startMin - chunkCursor;
          const chunkDuration = remaining >= (slotSizeMinutes + 10) ? slotSizeMinutes : remaining;
          const chunkStartStr = minutesToTimeString(chunkCursor);
          const chunkEndStr = minutesToTimeString(chunkCursor + chunkDuration);

          timelineItems.push({
            isGap: true,
            id: `gap-${chunkStartStr}-${chunkEndStr}`,
            time: chunkStartStr,
            endTime: chunkEndStr,
            duration: chunkDuration,
            prevBlockTitle: sortedBlocks[idx - 1]?.title || 'Day Dawn',
            nextBlockTitle: block.title
          });

          chunkCursor += chunkDuration;
        }
      }
    }

    // Add the logged block
    timelineItems.push(block);
    cursorMin = Math.max(cursorMin, block.endMin);
  });

  // Gap after the last logged block up to dayEndMinutes
  if (cursorMin < dayEndMinutes && (dayEndMinutes - cursorMin) >= 15) {
    let chunkCursor = cursorMin;
    while (chunkCursor < dayEndMinutes) {
      const remaining = dayEndMinutes - chunkCursor;
      const chunkDuration = remaining >= (slotSizeMinutes + 10) ? slotSizeMinutes : remaining;
      const chunkStartStr = minutesToTimeString(chunkCursor);
      const chunkEndStr = minutesToTimeString(chunkCursor + chunkDuration);

      timelineItems.push({
        isGap: true,
        id: `gap-${chunkStartStr}-${chunkEndStr}`,
        time: chunkStartStr,
        endTime: chunkEndStr,
        duration: chunkDuration,
        prevBlockTitle: sortedBlocks[sortedBlocks.length - 1]?.title || 'Evening Block',
        nextBlockTitle: 'Rest & Night Wind-down'
      });

      chunkCursor += chunkDuration;
    }
  }

  return timelineItems;
}

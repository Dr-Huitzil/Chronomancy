// src/utils/solarLunarUtils.js - Astronomical Horology: Timezone, Daylight Savings, Solar Arc & Moon Phases

/**
 * Detects client timezone and Daylight Saving Time (DST) status
 */
export function getTimezoneInfo() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  
  const now = new Date();
  const jan = new Date(now.getFullYear(), 0, 1);
  const jul = new Date(now.getFullYear(), 6, 1);
  const stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  const isDST = now.getTimezoneOffset() < stdOffset;

  const offsetHours = -now.getTimezoneOffset() / 60;
  const offsetSign = offsetHours >= 0 ? '+' : '';
  const offsetStr = `UTC${offsetSign}${offsetHours}`;

  return {
    timeZone,
    isDST,
    offsetStr,
    label: `${timeZone.split('/')[1]?.replace('_', ' ') || timeZone} (${offsetStr}${isDST ? ' • DST Active' : ' • Standard Time'})`
  };
}

/**
 * Calculates estimated solar daylight progression for the current date
 */
export function getSolarDaylightProgress(now = new Date(), timeFormat = '12h') {
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  
  // Approximate sunrise / sunset model for ~36° - 38° N latitude (California / Temperate US)
  // Winter solstice: ~07:15 sunrise, 16:55 sunset (~9.6h)
  // Summer solstice: ~05:45 sunrise, 20:30 sunset (~14.7h)
  const solarAngle = ((dayOfYear - 172) / 365) * 2 * Math.PI;
  const daylightHours = 12 + 2.6 * Math.cos(solarAngle);
  const sunriseDec = 12 - daylightHours / 2;
  const sunsetDec = 12 + daylightHours / 2;

  const currentHourDec = now.getHours() + now.getMinutes() / 60;
  const isDay = currentHourDec >= sunriseDec && currentHourDec <= sunsetDec;

  let progressPercent = 0;
  if (isDay) {
    progressPercent = Math.min(100, Math.max(0, ((currentHourDec - sunriseDec) / daylightHours) * 100));
  } else if (currentHourDec > sunsetDec) {
    const nightDuration = 24 - daylightHours;
    progressPercent = Math.min(100, Math.max(0, ((currentHourDec - sunsetDec) / nightDuration) * 100));
  } else {
    const nightDuration = 24 - daylightHours;
    const hoursSinceMidnight = currentHourDec;
    progressPercent = Math.min(100, Math.max(0, (((24 - sunsetDec) + hoursSinceMidnight) / nightDuration) * 100));
  }

  const formatDecToTime = (dec) => {
    const h = Math.floor(dec);
    const m = Math.floor((dec - h) * 60);
    if (timeFormat === '24h') {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const sunriseMinutes = Math.round(sunriseDec * 60);
  const sunsetMinutes = Math.round(sunsetDec * 60);

  return {
    isDay,
    sunriseTime: formatDecToTime(sunriseDec),
    sunsetTime: formatDecToTime(sunsetDec),
    sunriseMinutes,
    sunsetMinutes,
    daylightHours: daylightHours.toFixed(1),
    progressPercent: Math.round(progressPercent)
  };
}

/**
 * Calculates the exact Moon Phase based on synodic lunar cycle math
 * Reference epoch: Known New Moon on Jan 11, 2024 at 11:57 UTC
 */
export function calculateMoonPhase(date = new Date()) {
  const epoch = new Date(Date.UTC(2024, 0, 11, 11, 57)).getTime();
  const synodicMonthMs = 29.53058867 * 24 * 60 * 60 * 1000;
  
  const diffMs = date.getTime() - epoch;
  const phaseCycle = ((diffMs % synodicMonthMs) + synodicMonthMs) % synodicMonthMs;
  const phaseFraction = phaseCycle / synodicMonthMs; // 0.0 to 1.0

  // Illumination calculation (0% at New Moon, 100% at Full Moon)
  const illumination = Math.round((1 - Math.cos(phaseFraction * 2 * Math.PI)) / 2 * 100);

  let phaseName = 'New Moon';
  let phaseSvgType = 'new'; // 'new', 'waxing-crescent', 'first-quarter', 'waxing-gibbous', 'full', 'waning-gibbous', 'third-quarter', 'waning-crescent'
  let moonEmoji = '🌑';

  if (phaseFraction >= 0.03 && phaseFraction < 0.22) {
    phaseName = 'Waxing Crescent';
    phaseSvgType = 'waxing-crescent';
    moonEmoji = '🌒';
  } else if (phaseFraction >= 0.22 && phaseFraction < 0.28) {
    phaseName = 'First Quarter';
    phaseSvgType = 'first-quarter';
    moonEmoji = '🌓';
  } else if (phaseFraction >= 0.28 && phaseFraction < 0.47) {
    phaseName = 'Waxing Gibbous';
    phaseSvgType = 'waxing-gibbous';
    moonEmoji = '🌔';
  } else if (phaseFraction >= 0.47 && phaseFraction < 0.53) {
    phaseName = 'Full Moon';
    phaseSvgType = 'full';
    moonEmoji = '🌕';
  } else if (phaseFraction >= 0.53 && phaseFraction < 0.72) {
    phaseName = 'Waning Gibbous';
    phaseSvgType = 'waning-gibbous';
    moonEmoji = '🌖';
  } else if (phaseFraction >= 0.72 && phaseFraction < 0.78) {
    phaseName = 'Third Quarter';
    phaseSvgType = 'third-quarter';
    moonEmoji = '🌗';
  } else if (phaseFraction >= 0.78 && phaseFraction < 0.97) {
    phaseName = 'Waning Crescent';
    phaseSvgType = 'waning-crescent';
    moonEmoji = '🌘';
  }

  return {
    phaseFraction,
    illumination,
    phaseName,
    phaseSvgType,
    moonEmoji,
    lunarAgeDays: (phaseFraction * 29.53).toFixed(1)
  };
}

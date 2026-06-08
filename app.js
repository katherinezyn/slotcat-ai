const landingView = document.querySelector("#landing-view");
const loadingView = document.querySelector("#loading-view");
const resultsView = document.querySelector("#results-view");
const requestForm = document.querySelector("#request-form");
const sampleButton = document.querySelector("#sample-button");
const backButton = document.querySelector("#back-button");
const requestInput = document.querySelector("#meeting-request");
const editSetupButton = document.querySelector("#edit-setup-button");
const setupEditor = document.querySelector("#setup-editor");
const summaryCadence = document.querySelector("#summary-cadence");
const summaryDuration = document.querySelector("#summary-duration");
const summaryHours = document.querySelector("#summary-hours");
const summaryFairness = document.querySelector("#summary-fairness");
const summaryGuardrail = document.querySelector("#summary-guardrail");
const meetingCountInput = document.querySelector("#meeting-count-input");
const frequencyInput = document.querySelector("#frequency-input");
const durationInput = document.querySelector("#duration-input");
const hoursInput = document.querySelector("#hours-input");
const favoredLocationInput = document.querySelector("#favored-location-input");
const locationPromptInput = document.querySelector("#location-prompt-input");
const locationUpdateButton = document.querySelector("#location-update-button");
const locationsList = document.querySelector("#locations-list");
const userTimezoneLabel = document.querySelector("#user-timezone-label");
const recommendationTitle = document.querySelector("#recommendation-title");
const windowList = document.querySelector("#window-list");
const scheduleTable = document.querySelector("#schedule-table");
const copyPlanButton = document.querySelector("#copy-plan-button");
const ribbonTitle = document.querySelector("#ribbon-title");
const ribbonList = document.querySelector("#ribbon-list");
const timeScrubber = document.querySelector("#time-scrubber");
const scrubberFace = document.querySelector("#scrubber-face");
const scrubberTimeLabel = document.querySelector("#scrubber-time-label");
const scrubberTicks = document.querySelector("#scrubber-ticks");

const samplePrompt =
  "Plan 3 monthly meetings for teams in Beijing, US Eastern, UK, and US Pacific. Rotate off-hours fairly.";
const initialRequestText = requestInput.value;
let hasClearedSamplePrompt = false;

function normalizePromptText(text) {
  return text.trim().replace(/\s+/g, " ");
}

function clearSamplePromptOnFirstFocus() {
  if (hasClearedSamplePrompt) return;

  const currentText = normalizePromptText(requestInput.value);
  const initialText = normalizePromptText(initialRequestText);
  const sampleText = normalizePromptText(samplePrompt);

  if (currentText === initialText || currentText === sampleText) {
    requestInput.value = "";
  }

  hasClearedSamplePrompt = true;
}

const planDetails = {
  balance: {
    title: "Best Balance",
    rows: [
      { session: "1", utc: "14:30", beijing: ["22:30", "late"], east: ["10:30", "work"], uk: ["15:30", "work"], west: ["07:30", "edge"], burden: "Beijing late, West early" },
      { session: "2", utc: "14:30", beijing: ["22:30", "late"], east: ["10:30", "work"], uk: ["15:30", "work"], west: ["07:30", "edge"], burden: "Lowest average discomfort" },
      { session: "3", utc: "14:30", beijing: ["22:30", "late"], east: ["10:30", "work"], uk: ["15:30", "work"], west: ["07:30", "edge"], burden: "No timezone enters midnight hours" },
    ],
  },
  rotate: {
    title: "Guardrail Rotation",
    rows: [
      { session: "1", utc: "14:00", beijing: ["22:00", "late"], east: ["10:00", "work"], uk: ["15:00", "work"], west: ["07:00", "edge"], burden: "Beijing late, West early" },
      { session: "2", utc: "15:00", beijing: ["23:00", "late"], east: ["11:00", "work"], uk: ["16:00", "work"], west: ["08:00", "edge"], burden: "Beijing later, West less early" },
      { session: "3", utc: "14:30", beijing: ["22:30", "late"], east: ["10:30", "work"], uk: ["15:30", "work"], west: ["07:30", "edge"], burden: "Shared edge without midnight hours" },
    ],
  },
  protect: {
    title: "Protect Work Hours",
    rows: [
      { session: "1", utc: "15:00", beijing: ["23:00", "late"], east: ["11:00", "work"], uk: ["16:00", "work"], west: ["08:00", "edge"], burden: "Beijing late" },
      { session: "2", utc: "15:00", beijing: ["23:00", "late"], east: ["11:00", "work"], uk: ["16:00", "work"], west: ["08:00", "edge"], burden: "Avoids deep sleep hours" },
      { session: "3", utc: "15:00", beijing: ["23:00", "late"], east: ["11:00", "work"], uk: ["16:00", "work"], west: ["08:00", "edge"], burden: "Most attendees stay in workday" },
    ],
  },
};

const exceptionPlanDetails = {
  balance: {
    title: "Best Balance",
    rows: [
      { session: "1", utc: "14:30", beijing: ["22:30", "late"], east: ["10:30", "work"], uk: ["15:30", "work"], west: ["07:30", "edge"], burden: "Default guardrail preserved" },
      { session: "2", utc: "14:30", beijing: ["22:30", "late"], east: ["10:30", "work"], uk: ["15:30", "work"], west: ["07:30", "edge"], burden: "No deep off-hour exception used" },
      { session: "3", utc: "14:30", beijing: ["22:30", "late"], east: ["10:30", "work"], uk: ["15:30", "work"], west: ["07:30", "edge"], burden: "Lowest average discomfort" },
    ],
  },
  rotate: {
    title: "Prompt Exception",
    rows: [
      { session: "1", utc: "14:00", beijing: ["22:00", "late"], east: ["10:00", "work"], uk: ["15:00", "work"], west: ["07:00", "edge"], burden: "Guardrail-safe baseline" },
      { session: "2", utc: "23:00", beijing: ["07:00 +1", "edge"], east: ["19:00", "edge"], uk: ["00:00 +1", "sleep"], west: ["16:00", "work"], burden: "Prompt exception allows UK midnight" },
      { session: "3", utc: "15:00", beijing: ["23:00", "late"], east: ["11:00", "work"], uk: ["16:00", "work"], west: ["08:00", "edge"], burden: "Returns to humane-hours rule" },
    ],
  },
  protect: {
    title: "Protect Work Hours",
    rows: [
      { session: "1", utc: "15:00", beijing: ["23:00", "late"], east: ["11:00", "work"], uk: ["16:00", "work"], west: ["08:00", "edge"], burden: "No exception needed" },
      { session: "2", utc: "15:00", beijing: ["23:00", "late"], east: ["11:00", "work"], uk: ["16:00", "work"], west: ["08:00", "edge"], burden: "Keeps more people in workday" },
      { session: "3", utc: "15:00", beijing: ["23:00", "late"], east: ["11:00", "work"], uk: ["16:00", "work"], west: ["08:00", "edge"], burden: "Avoids default blocked window" },
    ],
  },
};

let activePlanDetails = planDetails;
let currentLocations = [
  { label: "China", timezone: "Asia/Shanghai" },
  { label: "US Eastern", timezone: "America/New_York" },
  { label: "United Kingdom", timezone: "Europe/London" },
  { label: "US Pacific", timezone: "America/Los_Angeles" },
];

const knownLocations = [
  { patterns: ["new york", "nyc", "us eastern", "eastern time", "east coast", "est", "edt", "美东", "纽约"], label: "US Eastern", timezone: "America/New_York" },
  { patterns: ["washington dc", "washington d.c.", "boston", "atlanta", "miami", "orlando", "philadelphia", "pittsburgh", "detroit", "charlotte", "raleigh", "durham", "durham nc", "chapel hill", "north carolina", "nc", "toronto", "montreal"], label: "US Eastern", timezone: "America/New_York" },
  { patterns: ["chicago", "us central", "central time", "cst", "cdt", "芝加哥", "美中"], label: "US Central", timezone: "America/Chicago" },
  { patterns: ["dallas", "austin", "houston", "minneapolis", "nashville", "new orleans", "st louis", "kansas city"], label: "US Central", timezone: "America/Chicago" },
  { patterns: ["mexico city", "mexico"], label: "Mexico", timezone: "America/Mexico_City" },
  { patterns: ["denver", "salt lake city", "phoenix", "boise", "us mountain", "mountain time", "mst", "mdt"], label: "US Mountain", timezone: "America/Denver" },
  { patterns: ["san francisco", "sf", "los angeles", "la", "seattle", "portland", "san diego", "san jose", "vancouver", "us pacific", "pacific time", "west coast", "pst", "pdt", "美西", "旧金山", "洛杉矶", "西雅图"], label: "US Pacific", timezone: "America/Los_Angeles" },
  { patterns: ["london", "uk", "united kingdom", "英国", "伦敦"], label: "United Kingdom", timezone: "Europe/London" },
  { patterns: ["dublin", "ireland"], label: "Ireland", timezone: "Europe/Dublin" },
  { patterns: ["paris", "france", "法国", "巴黎"], label: "France", timezone: "Europe/Paris" },
  { patterns: ["berlin", "germany", "德国", "柏林"], label: "Germany", timezone: "Europe/Berlin" },
  { patterns: ["amsterdam", "netherlands"], label: "Netherlands", timezone: "Europe/Amsterdam" },
  { patterns: ["brussels", "belgium"], label: "Belgium", timezone: "Europe/Brussels" },
  { patterns: ["zurich", "switzerland"], label: "Switzerland", timezone: "Europe/Zurich" },
  { patterns: ["madrid", "spain"], label: "Spain", timezone: "Europe/Madrid" },
  { patterns: ["rome", "italy"], label: "Italy", timezone: "Europe/Rome" },
  { patterns: ["stockholm", "sweden"], label: "Sweden", timezone: "Europe/Stockholm" },
  { patterns: ["copenhagen", "denmark"], label: "Denmark", timezone: "Europe/Copenhagen" },
  { patterns: ["helsinki", "finland"], label: "Finland", timezone: "Europe/Helsinki" },
  { patterns: ["warsaw", "poland"], label: "Poland", timezone: "Europe/Warsaw" },
  { patterns: ["istanbul", "turkey"], label: "Turkey", timezone: "Europe/Istanbul" },
  { patterns: ["tel aviv", "israel"], label: "Israel", timezone: "Asia/Jerusalem" },
  { patterns: ["dubai", "uae", "abu dhabi"], label: "UAE", timezone: "Asia/Dubai" },
  { patterns: ["riyadh", "saudi", "saudi arabia"], label: "Saudi Arabia", timezone: "Asia/Riyadh" },
  { patterns: ["beijing", "shanghai", "china", "北京", "上海", "中国"], label: "China", timezone: "Asia/Shanghai" },
  { patterns: ["hong kong", "香港"], label: "Hong Kong", timezone: "Asia/Hong_Kong" },
  { patterns: ["taipei", "taiwan", "台北", "台湾"], label: "Taiwan", timezone: "Asia/Taipei" },
  { patterns: ["singapore", "新加坡"], label: "Singapore", timezone: "Asia/Singapore" },
  { patterns: ["tokyo", "japan", "日本", "东京"], label: "Japan", timezone: "Asia/Tokyo" },
  { patterns: ["seoul", "korea", "south korea", "韩国", "首尔"], label: "South Korea", timezone: "Asia/Seoul" },
  { patterns: ["bangalore", "bengaluru", "india", "印度", "班加罗尔"], label: "India", timezone: "Asia/Kolkata" },
  { patterns: ["mumbai", "delhi", "new delhi", "hyderabad", "pune", "chennai"], label: "India", timezone: "Asia/Kolkata" },
  { patterns: ["jakarta", "indonesia"], label: "Indonesia", timezone: "Asia/Jakarta" },
  { patterns: ["bangkok", "thailand"], label: "Thailand", timezone: "Asia/Bangkok" },
  { patterns: ["ho chi minh", "saigon", "vietnam"], label: "Vietnam", timezone: "Asia/Ho_Chi_Minh" },
  { patterns: ["manila", "philippines"], label: "Philippines", timezone: "Asia/Manila" },
  { patterns: ["kuala lumpur", "malaysia"], label: "Malaysia", timezone: "Asia/Kuala_Lumpur" },
  { patterns: ["sydney", "australia", "悉尼"], label: "Australia", timezone: "Australia/Sydney" },
  { patterns: ["melbourne"], label: "Australia", timezone: "Australia/Melbourne" },
  { patterns: ["brisbane"], label: "Australia", timezone: "Australia/Brisbane" },
  { patterns: ["auckland", "new zealand"], label: "New Zealand", timezone: "Pacific/Auckland" },
  { patterns: ["sao paulo", "são paulo", "brazil"], label: "Brazil", timezone: "America/Sao_Paulo" },
  { patterns: ["buenos aires", "argentina"], label: "Argentina", timezone: "America/Argentina/Buenos_Aires" },
  { patterns: ["santiago", "chile"], label: "Chile", timezone: "America/Santiago" },
  { patterns: ["bogota", "colombia"], label: "Colombia", timezone: "America/Bogota" },
  { patterns: ["lima", "peru"], label: "Peru", timezone: "America/Lima" },
  { patterns: ["cairo", "egypt"], label: "Egypt", timezone: "Africa/Cairo" },
  { patterns: ["johannesburg", "south africa"], label: "South Africa", timezone: "Africa/Johannesburg" },
  { patterns: ["nairobi", "kenya"], label: "Kenya", timezone: "Africa/Nairobi" },
  { patterns: ["lagos", "nigeria"], label: "Nigeria", timezone: "Africa/Lagos" },
];

function showView(view) {
  [landingView, loadingView, resultsView].forEach((item) => item.classList.add("hidden"));
  view.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showResultsWithLoading() {
  const promptLocations = parseLocationsFromPrompt(requestInput.value);
  locationPromptInput.value = requestInput.value;
  renderLocations(promptLocations);
  applyPromptGuardrailMode();
  showView(loadingView);
  window.setTimeout(() => {
    renderRecommendedWindows();
    renderTimeScrubber();
    showView(resultsView);
  }, 1300);
}

function promptAllowsBlockedHours(prompt) {
  const normalized = prompt.toLowerCase();
  const hasBlockedTime = /00:|01:|02:|03:|04:|05:|06:|midnight|overnight|凌晨|半夜|深夜|早上[0-6]|[0-6]\s*(am|点)/.test(normalized);
  const hasExplicitPermission = /allow|allowed|must|need|required|specific|指定|必须|需要|可以|允许|安排/.test(normalized);
  return hasBlockedTime && hasExplicitPermission;
}

function applyPromptGuardrailMode() {
  const allowsException = promptAllowsBlockedHours(requestInput.value);
  activePlanDetails = allowsException ? exceptionPlanDetails : planDetails;

  if (summaryGuardrail) {
    summaryGuardrail.textContent = allowsException
      ? "Prompt exception: blocked hours allowed"
      : "No 00:00-07:00 by default";
  }
}

function parseLocationsFromPrompt(prompt) {
  const normalized = prompt.toLowerCase();
  const matches = [];

  knownLocations.forEach((location) => {
    const isMatch = location.patterns.some((pattern) => matchesLocationPattern(normalized, pattern));
    const alreadyAdded = matches.some((item) => item.timezone === location.timezone && item.label === location.label);
    if (isMatch && !alreadyAdded) {
      matches.push({ label: location.label, timezone: location.timezone });
    }
  });

  return matches.length ? matches : [
    { label: "China", timezone: "Asia/Shanghai" },
    { label: "US Eastern", timezone: "America/New_York" },
    { label: "United Kingdom", timezone: "Europe/London" },
    { label: "US Pacific", timezone: "America/Los_Angeles" },
  ];
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesLocationPattern(normalizedPrompt, pattern) {
  const normalizedPattern = pattern.toLowerCase();

  if (/[\u4e00-\u9fff]/.test(normalizedPattern)) {
    return normalizedPrompt.includes(normalizedPattern);
  }

  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalizedPattern)}([^a-z0-9]|$)`).test(normalizedPrompt);
}

function renderLocations(locations) {
  currentLocations = locations;
  locationsList.innerHTML = locations
    .map((location) => `
      <div>
        <span class="location-flag">${getLocationFlag(location)}</span>
        <span class="location-copy"><strong>${location.label}</strong></span>
      </div>
    `)
    .join("");
  renderFavoredLocationOptions();
}

function getLocationFlag(location) {
  const timezone = location.timezone;
  const label = location.label.toLowerCase();
  if (timezone.startsWith("America/")) return "🇺🇸";
  if (timezone === "Europe/London" || label.includes("london") || label.includes("kingdom")) return "🇬🇧";
  if (timezone === "Asia/Shanghai" || label.includes("beijing") || label.includes("shanghai")) return "🇨🇳";
  if (timezone === "Asia/Tokyo") return "🇯🇵";
  if (timezone === "Asia/Seoul") return "🇰🇷";
  if (timezone === "Asia/Singapore") return "🇸🇬";
  if (timezone.startsWith("Australia/")) return "🇦🇺";
  return "🌐";
}

function updateLocationsFromPrompt() {
  const locations = parseLocationsFromPrompt(locationPromptInput.value);
  renderLocations(locations);
  refreshRecommendations();
}

function renderFavoredLocationOptions() {
  const selected = favoredLocationInput.value || "rotate";
  favoredLocationInput.innerHTML = [
    `<option value="rotate">Rotate burden fairly</option>`,
    `<option value="balanced">No preference · best for everyone</option>`,
    ...currentLocations.map((location) => `<option value="${location.label}">${location.label}</option>`),
  ].join("");

  if (selected === "rotate" || selected === "balanced" || currentLocations.some((location) => location.label === selected)) {
    favoredLocationInput.value = selected;
  }
}

function formatUTCForLocalTime(utcTime) {
  const [hours, minutes] = utcTime.split(":").map(Number);
  const date = new Date(Date.UTC(2026, 5, 3, hours, minutes));

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatMinutesAsClock24(totalMinutes) {
  const boundedMinutes = Math.max(0, Math.min(1440, totalMinutes));
  const hours = Math.floor(boundedMinutes / 60);
  const minutes = boundedMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function formatMinutesAsLocalLabel(totalMinutes) {
  return formatMinutesAsClock24(totalMinutes);
}

function getTimeZoneOffsetMinutes(timezone, date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const zonedTimestamp = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );

  return (zonedTimestamp - date.getTime()) / 60000;
}

function formatLocalMinutesForTimezone(localMinutes, timezone) {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const hours = Math.floor(localMinutes / 60);
  const minutes = localMinutes % 60;
  const localWallClockGuess = new Date(Date.UTC(2026, 5, 3, hours, minutes));
  const userOffset = getTimeZoneOffsetMinutes(userTimezone, localWallClockGuess);
  const instant = new Date(localWallClockGuess.getTime() - (userOffset * 60000));

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(instant);
}

function formatUTCForTimezone(utcTime, timezone) {
  const [hours, minutes] = utcTime.split(":").map(Number);
  const date = new Date(Date.UTC(2026, 5, 3, hours, minutes));

  return new Intl.DateTimeFormat([], {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatTimezoneDisplayName(timezone) {
  const timezoneLabels = {
    "America/New_York": "US Eastern",
    "America/Chicago": "US Central",
    "America/Denver": "US Mountain",
    "America/Los_Angeles": "US Pacific",
    "Europe/London": "United Kingdom",
    "Asia/Shanghai": "China",
    "Asia/Tokyo": "Japan",
    "Asia/Seoul": "South Korea",
  };

  return timezoneLabels[timezone] || timezone;
}

function getComfortClass(localTime) {
  const minutes = localTimeToMinutesValue(localTime);
  const { start, end } = getWorkingHourRange();

  if (minutes >= start && minutes < end) return "work";
  if (minutes < 420) return "sleep";
  if (minutes < start) return "early";
  if (minutes >= end) return "late";

  return "sleep";
}

function localTimeToMinutesValue(localTime) {
  const cleanTime = localTime.replace(/\s*\+1/g, "");
  const [hours, minutes = 0] = cleanTime.split(":").map(Number);
  return ((hours % 24) * 60) + minutes;
}

function isBlockedLocalTime(localTime) {
  return localTimeToMinutesValue(localTime) < 420;
}

function parseTimeToMinutes(value, fallback) {
  const normalized = value.trim().toLowerCase();
  const match = normalized.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);

  if (!match) return fallback;

  let hours = Number(match[1]);
  const minutes = Number(match[2] || 0);
  const meridiem = match[3];

  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;

  return ((hours % 24) * 60) + minutes;
}

function getWorkingHourRange() {
  const [startValue = "9:00", endValue = "18:00"] = (hoursInput.value || "9:00-18:00").split("-");
  const start = parseTimeToMinutes(startValue, 540);
  const end = parseTimeToMinutes(endValue, 1080);

  return end > start ? { start, end } : { start: 540, end: 1080 };
}

function updateScrubberColorStops() {
  const { start, end } = getWorkingHourRange();
  const root = document.documentElement;

  root.style.setProperty("--sleep-end", `${(420 / 1440) * 100}%`);
  root.style.setProperty("--work-start", `${(start / 1440) * 100}%`);
  root.style.setProperty("--work-end", `${(end / 1440) * 100}%`);
}

function generateCandidateUTCTimes() {
  return Array.from({ length: 48 }, (_, index) => {
    const totalMinutes = index * 30;
    return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
  });
}

function scoreCandidateForTarget(utc, targetLocation, requireTargetWork = true) {
  const localTimes = currentLocations.map((location) => ({
    ...location,
    time: formatUTCForTimezone(utc, location.timezone),
  }));
  const target = localTimes.find((location) => location.label === targetLocation.label);

  if (!target) return null;
  if (requireTargetWork && getComfortClass(target.time) !== "work") return null;
  if (localTimes.some((location) => isBlockedLocalTime(location.time))) return null;

  return localTimes.reduce((score, location) => {
    const comfort = getComfortClass(location.time);
    const targetBoost = location.label === targetLocation.label ? 3 : 0;
    if (comfort === "work") return score + 4 + targetBoost;
    if (comfort === "edge") return score + 2;
    if (comfort === "late") return score + 1;
    return score - 8;
  }, 0);
}

function findBestCandidateForTarget(targetLocation) {
  const candidates = generateCandidateUTCTimes();
  const strictBest = candidates
    .map((utc) => ({ utc, score: scoreCandidateForTarget(utc, targetLocation, true) }))
    .filter((candidate) => candidate.score !== null)
    .sort((a, b) => b.score - a.score)[0];

  if (strictBest) return strictBest.utc;

  const fallbackBest = candidates
    .map((utc) => ({ utc, score: scoreCandidateForTarget(utc, targetLocation, false) }))
    .filter((candidate) => candidate.score !== null)
    .sort((a, b) => b.score - a.score)[0];

  return fallbackBest?.utc || "14:30";
}

function scoreCandidateForEveryone(utc, requireAllWork = true) {
  const localTimes = currentLocations.map((location) => ({
    ...location,
    time: formatUTCForTimezone(utc, location.timezone),
  }));
  const comfortList = localTimes.map((location) => getComfortClass(location.time));

  if (localTimes.some((location) => isBlockedLocalTime(location.time))) return null;
  if (requireAllWork && comfortList.some((comfort) => comfort !== "work")) return null;

  return comfortList.reduce((score, comfort) => {
    if (comfort === "work") return score + 5;
    if (comfort === "edge") return score + 2;
    if (comfort === "late") return score + 1;
    return score - 10;
  }, 0);
}

function findBestCandidateForEveryone() {
  const candidates = generateCandidateUTCTimes();
  const allWorkBest = candidates
    .map((utc) => ({ utc, score: scoreCandidateForEveryone(utc, true) }))
    .filter((candidate) => candidate.score !== null)
    .sort((a, b) => b.score - a.score)[0];

  if (allWorkBest) return allWorkBest.utc;

  const humaneBest = candidates
    .map((utc) => ({ utc, score: scoreCandidateForEveryone(utc, false) }))
    .filter((candidate) => candidate.score !== null)
    .sort((a, b) => b.score - a.score)[0];

  return humaneBest?.utc || "14:30";
}

function generateRotationSequence(count) {
  return Array.from({ length: count }, (_, index) => {
    const targetLocation = currentLocations[index % currentLocations.length];
    return findBestCandidateForTarget(targetLocation);
  });
}

function getPlanUTCSequence(planKey, count) {
  const preference = favoredLocationInput.value;
  const favoredLocation = preference === "rotate" || preference === "balanced"
    ? null
    : currentLocations.find((location) => location.label === favoredLocationInput.value);

  if (preference === "balanced") {
    return Array.from({ length: count }, () => findBestCandidateForEveryone());
  }

  if (favoredLocation) {
    return Array.from({ length: count }, () => findBestCandidateForTarget(favoredLocation));
  }

  if (planKey === "rotate") {
    return generateRotationSequence(count);
  }

  const sequences = {
    balance: ["14:30"],
    rotate: ["14:00", "14:30", "15:00"],
    protect: ["15:00"],
  };
  const sequence = sequences[planKey] || sequences.rotate;
  return Array.from({ length: count }, (_, index) => sequence[index % sequence.length]);
}

function buildPlanRows(planKey) {
  const count = frequencyInput.value === "one-time" ? 1 : Math.max(1, Number(meetingCountInput.value) || 1);
  return getPlanUTCSequence(planKey, count).map((utc, index) => {
    const locations = currentLocations.map((location) => {
      const time = formatUTCForTimezone(utc, location.timezone);
      return {
        ...location,
        time,
        comfort: getComfortClass(time),
      };
    });
    const burdenLocations = locations
      .filter((location) => location.comfort !== "work")
      .map((location) => location.label);
    const favoredLocation = favoredLocationInput.value === "rotate" || favoredLocationInput.value === "balanced"
      ? null
      : locations.find((location) => location.label === favoredLocationInput.value);
    const favoredNote = favoredLocation && favoredLocation.comfort === "work"
      ? `${favoredLocation.label} protected`
      : "";

    return {
      session: String(index + 1),
      utc,
      locations,
      burden: favoredNote || (burdenLocations.length ? burdenLocations.join(", ") : "All inside work hours"),
    };
  });
}

function renderLocalRecommendationTimes() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (userTimezoneLabel) {
    userTimezoneLabel.textContent = `Shown in your local time · ${formatTimezoneDisplayName(timezone)}`;
  }

  document.querySelectorAll("[data-local-time]").forEach((item) => {
    item.textContent = formatUTCForLocalTime(item.dataset.localTime);
  });

  document.querySelectorAll("[data-local-times]").forEach((item) => {
    item.textContent = item.dataset.localTimes
      .split(",")
      .map((time) => formatUTCForLocalTime(time.trim()))
      .join(" / ");
  });
}

function refreshRecommendations() {
  renderRecommendedWindows();
  renderTimeScrubber();
}

function addMinutesToUTC(utcTime, minutesToAdd) {
  const [hours, minutes] = utcTime.split(":").map(Number);
  const date = new Date(Date.UTC(2026, 5, 3, hours, minutes + minutesToAdd));
  return `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
}

function renderRecommendedWindows() {
  const rows = buildPlanRows("rotate");
  const duration = Number(durationInput.value) || 60;
  const isOneTime = frequencyInput.value === "one-time";
  const hasBlockedRotation = favoredLocationInput.value === "rotate"
    && currentLocations.some((location) => location.timezone.startsWith("Asia/"))
    && currentLocations.some((location) => location.timezone === "America/Los_Angeles");

  recommendationTitle.textContent = "Our Recommendations";

  windowList.innerHTML = rows.map((row) => {
    const start = formatUTCForLocalTime(row.utc);
    const end = formatUTCForLocalTime(addMinutesToUTC(row.utc, duration));
    const label = isOneTime ? "Recommended window" : `Session ${row.session}`;
    const burdenTags = row.locations
      .filter((location) => location.comfort !== "work")
      .map((location) => `
        <span class="burden-tag ${location.comfort}">
          <span class="tag-icon" aria-hidden="true">${comfortClassToIcon(location.comfort)}</span>
          <strong>${location.label}</strong>
          <em>${comfortClassToText(location.comfort)}</em>
        </span>
      `)
      .join("");

    return `
      <article class="window-card">
        <span class="session-number">${row.session}</span>
        <div class="window-card-main">
          <span>${label}</span>
          <strong>${start} - ${end} <small>(your time)</small></strong>
        </div>
        ${burdenTags ? `<div class="burden-tags">${burdenTags}</div>` : ""}
      </article>
    `;
  }).join("");

  renderScheduleTable(rows);
}

function comfortClassToIcon(comfort) {
  return {
    edge: "☀️",
    early: "☀️",
    late: "🌙",
    sleep: "🌙",
  }[comfort] || "✦";
}

function getTimeCellAttributes(location) {
  if (location.comfort === "work") return "";

  const status = comfortClassToText(location.comfort);
  const tooltip = location.comfort === "sleep" ? "Sleep" : "Burden";
  return `tabindex="0" data-tooltip="${tooltip}" aria-label="${tooltip}: ${location.label} is ${status.toLowerCase()}"`;
}

function renderScheduleTable(rowsData) {
  const template = `58px minmax(82px, 0.78fr) repeat(${currentLocations.length}, minmax(80px, 1fr))`;
  const locationHeaders = currentLocations.map((location) => `<span>${location.label}</span>`).join("");
  const rows = rowsData.map((row) => `
    <div class="schedule-row" role="row" style="grid-template-columns: ${template}">
      <span>${row.session}</span>
      <strong>${formatUTCForLocalTime(row.utc)}</strong>
      ${row.locations.map((location) => `<span class="${location.comfort} location-time-pill" ${getTimeCellAttributes(location)}>${location.time}</span>`).join("")}
    </div>
  `).join("");

  scheduleTable.innerHTML = `
    <div class="schedule-row schedule-header" role="row" style="grid-template-columns: ${template}">
      <span>Session</span>
      <span>Your time</span>
      ${locationHeaders}
    </div>
    ${rows}
  `;
}

function buildEmailPlanText() {
  const rows = buildPlanRows("rotate");
  const duration = Number(durationInput.value) || 60;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const cadence = frequencyInput.value === "one-time"
    ? "one-time meeting"
    : `${rows.length} recurring meeting${rows.length === 1 ? "" : "s"}`;
  const lines = [
    "Hi team,",
    "",
    `Here is the proposed local-time meeting plan for our ${cadence}.`,
    `Times are shown in each location's local time. My reference time zone is ${timezone}.`,
    "",
  ];

  rows.forEach((row) => {
    const start = formatUTCForLocalTime(row.utc);
    const end = formatUTCForLocalTime(addMinutesToUTC(row.utc, duration));
    lines.push(`Session ${row.session}: ${start}-${end} (${timezone})`);
    row.locations.forEach((location) => {
      const status = comfortClassToText(location.comfort);
      const note = location.comfort === "work" ? "" : ` - ${status}`;
      lines.push(`- ${location.label}: ${location.time}${note}`);
    });
    lines.push("");
  });

  lines.push("Please confirm whether these windows work on your calendar.");
  return lines.join("\n").trim();
}

async function copyEmailPlan() {
  const text = buildEmailPlanText();
  const originalText = copyPlanButton.textContent;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      copyTextWithFallback(text);
    }
    copyPlanButton.textContent = "Copied";
  } catch (error) {
    try {
      copyTextWithFallback(text);
      copyPlanButton.textContent = "Copied";
    } catch (fallbackError) {
      copyPlanButton.textContent = "Copy failed";
    }
  }

  window.setTimeout(() => {
    copyPlanButton.textContent = originalText;
  }, 1600);
}

function copyTextWithFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const didCopy = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!didCopy) {
    throw new Error("Fallback copy failed");
  }
}

function comfortClassToText(className) {
  return {
    work: "Work",
    early: "Early morning",
    late: "Late night",
    sleep: "Sleep",
  }[className] || "Local";
}

function localTimeToPercent(localTime) {
  const cleanTime = localTime.replace(/\s*\+1/g, "");
  const [hours, minutes = 0] = cleanTime.split(":").map(Number);
  const totalMinutes = (hours * 60) + minutes;
  return Math.max(0, Math.min(100, (totalMinutes / 1440) * 100));
}

function renderTimeScrubber() {
  updateScrubberColorStops();
  renderScrubberTicks();
  const selectedMinutes = Number(timeScrubber.value);
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  scrubberTimeLabel.textContent = `${formatMinutesAsLocalLabel(selectedMinutes)} (your time · ${formatTimezoneDisplayName(userTimezone)})`;
  const userTime = `${String(Math.floor(selectedMinutes / 60)).padStart(2, "0")}:${String(selectedMinutes % 60).padStart(2, "0")}`;
  const userMood = getComfortClass(userTime);
  const userMoodType = isBlockedLocalTime(userTime) ? "sleep" : userMood === "work" ? "work" : "burden";
  scrubberFace.dataset.mood = userMoodType;
  scrubberFace.dataset.emoji = getMoodEmoji(userMoodType);
  scrubberFace.style.left = `${selectedMinutes / 1440 * 100}%`;

  ribbonList.innerHTML = currentLocations.map((location) => {
    const time = formatLocalMinutesForTimezone(selectedMinutes, location.timezone);
    const comfort = getComfortClass(time);
    const mood = isBlockedLocalTime(time) ? "sleep" : comfort === "work" ? "work" : "burden";

    return `
    <div class="ribbon-row">
      <div class="region"><span class="region-flag">${getLocationFlag(location)}</span><span class="region-copy"><strong>${location.label}</strong><span>${time} · ${comfortClassToScrubberText(comfort)}</span></span></div>
      <div class="ribbon ${comfort === "work" ? "is-work" : isBlockedLocalTime(time) ? "is-sleep" : "has-burden"}">
        <i class="sleep-zone"></i><i class="work-zone"></i><i class="burden-zone"></i><b class="time-face" data-mood="${mood}" data-emoji="${getMoodEmoji(mood)}" style="left: ${localTimeToPercent(time)}%"></b>
      </div>
    </div>
  `;
  }).join("");
}

function comfortClassToScrubberText(className) {
  return {
    work: "Working hours",
    early: "Early morning",
    late: "Late night",
    sleep: "Sleeping time",
  }[className] || "Local";
}

function renderScrubberTicks() {
  const { start, end } = getWorkingHourRange();
  const ticks = [
    { label: "00:00", minutes: 0, align: "left" },
    { label: "07:00", minutes: 420 },
    { label: formatMinutesAsClock24(start), minutes: start },
    { label: formatMinutesAsClock24(end), minutes: end },
    { label: "24:00", minutes: 1440, align: "right" },
  ];

  scrubberTicks.innerHTML = ticks.map((tick) => `
    <span class="${tick.align ? `is-${tick.align}` : ""}" style="left: ${(tick.minutes / 1440) * 100}%">${tick.label}</span>
  `).join("");
}

function getMoodEmoji(mood) {
  return {
    work: "😄",
    burden: "😐",
    sleep: "😴",
  }[mood] || "😐";
}

function syncFrequencyWithMeetingCount() {
  const count = Math.max(1, Number(meetingCountInput.value) || 1);
  frequencyInput.value = count === 1 ? "one-time" : "recurring";
}

requestForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showResultsWithLoading();
});

requestInput.addEventListener("focus", clearSamplePromptOnFirstFocus);
requestInput.addEventListener("pointerdown", clearSamplePromptOnFirstFocus);

sampleButton.addEventListener("click", () => {});

backButton.addEventListener("click", () => showView(landingView));

editSetupButton.addEventListener("click", () => {
  const isEditing = !setupEditor.classList.contains("hidden");

  if (isEditing) {
    syncFrequencyWithMeetingCount();
    const count = Math.max(1, Number(meetingCountInput.value) || 1);
    const frequency = frequencyInput.value;
    const duration = durationInput.value;
    const hours = hoursInput.value || "9:00-18:00";
    const favoredLocation = favoredLocationInput.value;

    const cadenceLabel = frequency === "one-time"
      ? "1 one-time meeting"
      : `${count} recurring meetings`;
    summaryCadence.textContent = cadenceLabel;
    summaryDuration.textContent = `${duration} minutes`;
    summaryHours.textContent = `${hours} local work hours`;
    summaryFairness.textContent = favoredLocation === "rotate"
      ? "Rotate burden fairly"
      : favoredLocation === "balanced"
        ? "Best for everyone"
        : `Favor ${favoredLocation}`;
    updateLocationsFromPrompt();
    updateScrubberColorStops();
    renderTimeScrubber();
    setupEditor.classList.add("hidden");
    editSetupButton.textContent = "Edit setup";
  } else {
    setupEditor.classList.remove("hidden");
    editSetupButton.textContent = "Save setup";
  }
});

locationUpdateButton.addEventListener("click", updateLocationsFromPrompt);
copyPlanButton.addEventListener("click", copyEmailPlan);
favoredLocationInput.addEventListener("change", refreshRecommendations);
timeScrubber.addEventListener("input", renderTimeScrubber);

frequencyInput.addEventListener("change", () => {
  if (frequencyInput.value === "one-time") {
    meetingCountInput.value = "1";
  } else if (Number(meetingCountInput.value) < 2) {
    meetingCountInput.value = "2";
  }
  refreshRecommendations();
});

meetingCountInput.addEventListener("input", () => {
  syncFrequencyWithMeetingCount();
  refreshRecommendations();
});

renderLocalRecommendationTimes();
renderLocations(currentLocations);
syncFrequencyWithMeetingCount();
refreshRecommendations();

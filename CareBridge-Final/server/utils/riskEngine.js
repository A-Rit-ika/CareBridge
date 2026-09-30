// Rules-based early-warning score, loosely inspired by NEWS2-style scoring.
// It is decision SUPPORT: thresholds must be approved by the treating clinician,
// and every amber/red result is reviewed by a human.

export const DEFAULT_THRESHOLDS = {
  tempMax: 100.4, // °F
  spo2Min: 92,
  hrMin: 50,
  hrMax: 110,
  sysMin: 90,
  sysMax: 160,
  glucoseMax: 250
};

export const RED_FLAGS = ['chest_pain', 'breathless', 'fainting', 'heavy_bleeding', 'confusion'];
export const WARNINGS = ['wound_discharge', 'vomiting', 'swelling', 'dizziness', 'cough'];

const LABELS = {
  chest_pain: 'Chest pain',
  breathless: 'Trouble breathing',
  fainting: 'Fainting',
  heavy_bleeding: 'Heavy bleeding',
  confusion: 'Confusion',
  wound_discharge: 'Wound leaking or red',
  vomiting: 'Vomiting',
  swelling: 'New swelling',
  dizziness: 'Dizziness',
  cough: 'Bad cough'
};

const isNum = (v) => typeof v === 'number' && !Number.isNaN(v);

export function assessCheckin(c, patient = {}) {
  const t = { ...DEFAULT_THRESHOLDS, ...(patient.thresholds?.toObject?.() ?? patient.thresholds ?? {}) };
  // drop undefined overrides so defaults still apply
  Object.keys(t).forEach((k) => t[k] == null && (t[k] = DEFAULT_THRESHOLDS[k]));

  const reasons = [];
  let total = 0;
  let worstSingle = 0;
  let redFlag = false;
  const add = (points, text) => {
    total += points;
    worstSingle = Math.max(worstSingle, points);
    reasons.push(text);
  };

  if (isNum(c.temperature)) {
    if (c.temperature >= t.tempMax + 1.5) add(2, `High fever (${c.temperature}°F)`);
    else if (c.temperature > t.tempMax) add(1, `Fever (${c.temperature}°F)`);
  }
  if (isNum(c.spo2)) {
    if (c.spo2 < t.spo2Min - 4) add(3, `Very low oxygen (${c.spo2}%)`);
    else if (c.spo2 < t.spo2Min) add(2, `Low oxygen (${c.spo2}%)`);
  }
  if (isNum(c.heartRate)) {
    if (c.heartRate > t.hrMax + 20 || c.heartRate < t.hrMin - 10) add(2, `Pulse far outside range (${c.heartRate}/min)`);
    else if (c.heartRate > t.hrMax || c.heartRate < t.hrMin) add(1, `Pulse outside range (${c.heartRate}/min)`);
  }
  if (isNum(c.systolic)) {
    const bp = `${c.systolic}/${isNum(c.diastolic) ? c.diastolic : '?'}`;
    if (c.systolic > t.sysMax + 30 || c.systolic < t.sysMin - 20) add(3, `Blood pressure dangerously off (${bp})`);
    else if (c.systolic > t.sysMax || c.systolic < t.sysMin) add(1, `Blood pressure outside range (${bp})`);
  }
  if (isNum(c.glucose)) {
    if (c.glucose > t.glucoseMax + 150) add(2, `Very high blood sugar (${c.glucose})`);
    else if (c.glucose > t.glucoseMax) add(1, `High blood sugar (${c.glucose})`);
    else if (c.glucose < 70) add(2, `Low blood sugar (${c.glucose})`);
  }
  if (isNum(c.pain)) {
    if (c.pain >= 7) add(2, `Severe pain (${c.pain}/10)`);
    else if (c.pain >= 5) add(1, `Moderate pain (${c.pain}/10)`);
  }
  for (const s of c.symptoms || []) {
    if (RED_FLAGS.includes(s)) {
      redFlag = true;
      total += 3;
      reasons.push(`Red-flag symptom: ${LABELS[s]}`);
    } else if (WARNINGS.includes(s)) {
      add(1, `Symptom: ${LABELS[s]}`);
    }
  }
  if (c.medicinesTaken === false) add(1, 'Missed medicines today');

  let level = 'green';
  if (redFlag || worstSingle >= 3 || total >= 5) level = 'red';
  else if (total >= 2) level = 'amber';

  return { level, score: total, reasons };
}

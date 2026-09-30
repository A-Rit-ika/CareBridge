import assert from 'node:assert/strict';
import { assessCheckin } from './riskEngine.js';

const ok = { temperature: 98.6, spo2: 97, heartRate: 80, systolic: 120, diastolic: 80, pain: 2, symptoms: [], medicinesTaken: true };

assert.equal(assessCheckin(ok).level, 'green');
assert.equal(assessCheckin({ ...ok, temperature: 100.8, medicinesTaken: false }).level, 'amber');
assert.equal(assessCheckin({ ...ok, spo2: 90 }).level, 'amber');
assert.equal(assessCheckin({ ...ok, spo2: 86 }).level, 'red');
assert.equal(assessCheckin({ ...ok, symptoms: ['chest_pain'] }).level, 'red');
assert.equal(assessCheckin({ ...ok, systolic: 200 }).level, 'red');
assert.equal(assessCheckin({ ...ok, spo2: 93 }, { thresholds: { spo2Min: 95 } }).level, 'amber'); // patient-specific limit
assert.equal(assessCheckin({}).level, 'green'); // missing readings never crash
console.log('riskEngine: all tests passed');

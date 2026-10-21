import test from "node:test";
import assert from "node:assert/strict";

import {
  calculatePrediction,
  calculateRates,
  formatDurationFromMinutes,
  parseTimeToSeconds,
  parseXP,
  sumXpForLevels,
} from "../src/calculator.js";
import { BASE_EXP_TABLE, JOB_TABLES } from "../src/experience-data.js";

test("parseTimeToSeconds aceita HH:MM e HH:MM:SS", () => {
  assert.equal(parseTimeToSeconds("01:02"), 3_720);
  assert.equal(parseTimeToSeconds("23:59:58"), 86_398);
});

test("parseTimeToSeconds rejeita horários fora dos limites", () => {
  assert.throws(() => parseTimeToSeconds("24:00"), /Hora inválida/);
  assert.throws(() => parseTimeToSeconds("12:60"), /Hora inválida/);
  assert.throws(() => parseTimeToSeconds("12:30:60"), /Hora inválida/);
});

test("parseXP aceita separadores visuais e rejeita valores inválidos", () => {
  assert.equal(parseXP("1.250.000"), 1_250_000);
  assert.equal(parseXP("340 000"), 340_000);
  assert.throws(() => parseXP(""), /XP inválida/);
  assert.throws(() => parseXP("-100"), /XP inválida/);
});

test("calculateRates calcula ganhos e taxas para o mesmo dia", () => {
  const result = calculateRates({
    startTime: "10:00:00",
    endTime: "10:30:00",
    startBase: "1.000.000",
    endBase: "1.300.000",
    startJob: "200.000",
    endJob: "260.000",
  });

  assert.deepEqual(result, {
    elapsedSeconds: 1_800,
    base: { gained: 300_000, perMinute: 10_000, perHour: 600_000 },
    job: { gained: 60_000, perMinute: 2_000, perHour: 120_000 },
  });
});

test("calculateRates trata a passagem pela meia-noite", () => {
  const result = calculateRates({
    startTime: "23:55",
    endTime: "00:05",
    startBase: "1000",
    endBase: "2000",
    startJob: "500",
    endJob: "700",
  });

  assert.equal(result.elapsedSeconds, 600);
  assert.equal(result.base.perHour, 6_000);
  assert.equal(result.job.perMinute, 20);
});

test("calculateRates rejeita intervalo zero e XP regressiva", () => {
  const valid = {
    startTime: "10:00",
    endTime: "10:10",
    startBase: "1000",
    endBase: "1100",
    startJob: "500",
    endJob: "550",
  };

  assert.throws(
    () => calculateRates({ ...valid, endTime: "10:00" }),
    /tempo não pode ser zero/i,
  );
  assert.throws(
    () => calculateRates({ ...valid, endBase: "900" }),
    /Ponto 2.*menor/i,
  );
});

test("sumXpForLevels soma somente os níveis do intervalo", () => {
  assert.equal(sumXpForLevels([100, 200, 300], 1, 3), 300);
  assert.equal(sumXpForLevels([100, 200, 300], 2, 4), 500);
  assert.throws(() => sumXpForLevels([100, 200, 300], 3, 2), /maior/);
});

test("calculatePrediction desconta o progresso atual e estima o tempo", () => {
  assert.deepEqual(
    calculatePrediction({ totalNeeded: 10_000, currentXP: 2_500, ratePerMinute: 500 }),
    { totalNeeded: 10_000, currentXP: 2_500, remaining: 7_500, minutes: 15 },
  );

  assert.deepEqual(
    calculatePrediction({ totalNeeded: 10_000, currentXP: null, ratePerMinute: null }),
    { totalNeeded: 10_000, currentXP: null, remaining: 10_000, minutes: null },
  );
});

test("formatDurationFromMinutes normaliza o arredondamento de segundos", () => {
  assert.equal(formatDurationFromMinutes(59.999), "1h 0m 0s");
  assert.equal(formatDurationFromMinutes(2.5), "2m 30s");
});

test("tabelas de EXP preservam o contrato publicado", () => {
  const describe = (values) => ({
    length: values.length,
    first: values[0],
    last: values.at(-1),
    sum: values.reduce((total, value) => total + value, 0),
  });

  assert.deepEqual(describe(BASE_EXP_TABLE), {
    length: 99,
    first: 10_000,
    last: 333_965_000,
    sum: 6_438_417_500,
  });
  assert.deepEqual(describe(JOB_TABLES[1]), {
    length: 49,
    first: 19_500,
    last: 538_500,
    sum: 12_674_000,
  });
  assert.deepEqual(describe(JOB_TABLES[2]), {
    length: 49,
    first: 457_000,
    last: 12_347_000,
    sum: 264_705_500,
  });
  assert.deepEqual(describe(JOB_TABLES[3]), {
    length: 69,
    first: 1_188_000,
    last: 184_057_500,
    sum: 4_686_303_000,
  });
  assert.deepEqual(describe(JOB_TABLES[4]), {
    length: 59,
    first: 2_121_000,
    last: 640_286_000,
    sum: 14_887_319_500,
  });
});

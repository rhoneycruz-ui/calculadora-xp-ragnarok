const INVALID_TIME = "Hora inválida. Use HH:MM ou HH:MM:SS.";

export function parseTimeToSeconds(value) {
  const text = String(value).trim();
  if (!/^\d{1,2}:\d{2}(?::\d{2})?$/.test(text)) {
    throw new Error(INVALID_TIME);
  }

  const [hours, minutes, seconds = 0] = text.split(":").map(Number);
  if (hours > 23 || minutes > 59 || seconds > 59) {
    throw new Error(INVALID_TIME);
  }

  return hours * 3_600 + minutes * 60 + seconds;
}

export function parseXP(value) {
  const text = String(value).trim();
  if (!text || !/^[\d.,\s]+$/.test(text)) {
    throw new Error("XP inválida. Informe somente números.");
  }

  const normalized = text.replace(/[.,\s]/g, "");
  if (!normalized || !/^\d+$/.test(normalized)) {
    throw new Error("XP inválida. Informe somente números.");
  }

  const parsed = Number.parseInt(normalized, 10);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error("XP inválida. Informe um valor positivo.");
  }
  return parsed;
}

export function calculateRates({
  startTime,
  endTime,
  startBase,
  endBase,
  startJob,
  endJob,
}) {
  const startSeconds = parseTimeToSeconds(startTime);
  const endSeconds = parseTimeToSeconds(endTime);
  const elapsedSeconds = (endSeconds - startSeconds + 86_400) % 86_400;

  if (elapsedSeconds === 0) {
    throw new Error("O tempo não pode ser zero.");
  }

  const baseGained = parseXP(endBase) - parseXP(startBase);
  const jobGained = parseXP(endJob) - parseXP(startJob);
  if (baseGained < 0 || jobGained < 0) {
    throw new Error("A XP do Ponto 2 não pode ser menor que a do Ponto 1.");
  }

  const elapsedMinutes = elapsedSeconds / 60;
  return {
    elapsedSeconds,
    base: {
      gained: baseGained,
      perMinute: baseGained / elapsedMinutes,
      perHour: (baseGained / elapsedMinutes) * 60,
    },
    job: {
      gained: jobGained,
      perMinute: jobGained / elapsedMinutes,
      perHour: (jobGained / elapsedMinutes) * 60,
    },
  };
}

export function sumXpForLevels(table, fromLevel, toLevel) {
  if (!Number.isInteger(fromLevel) || !Number.isInteger(toLevel) || toLevel <= fromLevel) {
    throw new Error("O nível desejado deve ser maior que o nível atual.");
  }
  if (fromLevel < 1 || toLevel > table.length + 1) {
    throw new Error("Intervalo de níveis fora da tabela disponível.");
  }

  return table.slice(fromLevel - 1, toLevel - 1).reduce((total, xp) => total + xp, 0);
}

export function calculatePrediction({ totalNeeded, currentXP, ratePerMinute }) {
  const normalizedCurrent = currentXP === null ? null : Math.max(0, currentXP);
  const remaining = Math.max(0, totalNeeded - (normalizedCurrent ?? 0));
  const minutes = ratePerMinute && ratePerMinute > 0 ? remaining / ratePerMinute : null;

  return {
    totalNeeded,
    currentXP: normalizedCurrent,
    remaining,
    minutes,
  };
}

export function formatDurationFromMinutes(minutes) {
  const totalSeconds = Math.max(0, Math.round(minutes * 60));
  const hours = Math.floor(totalSeconds / 3_600);
  const remainingSeconds = totalSeconds % 3_600;
  const mins = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return hours > 0
    ? `${hours}h ${mins}m ${seconds}s`
    : `${mins}m ${seconds}s`;
}

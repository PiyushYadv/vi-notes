type KeystrokeTiming = {
  holdTime: number;
  gapTime: number;
};

export function calcTypingSpeed(data: KeystrokeTiming[]) {
  if (data.length === 0) return { cps: 0, wpm: 0 };

  const totalTimeMs = data.reduce(
    (sum, d) => sum + d.holdTime + d.gapTime,
    0
  );

  const totalChars = data.length;

  const seconds = totalTimeMs / 1000;

  const cps = totalChars / seconds; // chars per second
  const wpm = (cps * 60) / 5; // standard: 1 word = 5 chars

  return { cps,wpm };
}
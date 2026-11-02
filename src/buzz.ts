export function buzz(pattern: number | number[] = 20) {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    // Some browsers throw if vibration is blocked.
  }
}

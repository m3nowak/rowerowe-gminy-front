const OVERREACH = 0.05;

export function pointToPointTransitionTarget(
  source: [number, number],
  target: [number, number],
): [number, number] {
  const dx = target[0] - source[0];
  const dy = target[1] - source[1];
  return [target[0] + dx * OVERREACH, target[1] + dy * OVERREACH];
}

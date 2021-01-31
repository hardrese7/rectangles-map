/**
 * Returns the angle in degrees between the opposite and adjacent sides
 * @param opposite The opposite side length
 * @param adjacent The adjacent side length
 */
export function calculateRightTriangleAngle(
  opposite: number,
  adjacent: number,
): number {
  return (Math.atan(opposite / adjacent) * 180) / Math.PI;
}

export function showError(text: string): void {
  // eslint-disable-next-line no-alert
  alert(text);
}

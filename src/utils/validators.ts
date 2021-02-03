export function mustBeNumber(
  value: unknown,
  min: number | null = null,
  max: number | null = null,
): void {
  if (typeof value !== 'number') {
    throw TypeError(`${value} must be of type number`);
  }
  if (max && value > max) {
    throw RangeError(`${value} must be less or equal to ${max}`);
  }
  if (min && value < min) {
    throw RangeError(`${value} $must be less or equal to ${min}`);
  }
}

export function mustBeHexColor(value: unknown): void {
  if (typeof value !== 'string') {
    throw TypeError(`must be of type string but was ${typeof value}`);
  }
  const hexRegexp = /^#([0-9A-F]{3}){1,2}$/i;
  if (!hexRegexp.test(value)) {
    throw Error(
      `must be correct hex(length = 3 or 6) with leading # but was ${value}`,
    );
  }
}

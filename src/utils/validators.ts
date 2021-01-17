export function validateObjectPropertyIsNumber<T>(
  obj: T,
  propertyName: keyof T,
  min: number | null = null,
  max: number | null = null,
): boolean {
  const num = obj[propertyName];
  if (typeof num !== 'number') {
    throw Error(`${propertyName} must be of type number but was ${typeof num}`);
  }
  if (max && num > max) {
    throw Error(
      `${propertyName} must be less or equal to ${max} but was ${num}`,
    );
  }
  if (min && num < min) {
    throw Error(
      `${propertyName} must be less or equal to ${min} but was ${num}`,
    );
  }
  return true;
}

export function validateObjectPropertyIsColor<T>(
  obj: T,
  propertyName: keyof T,
): boolean {
  const color = obj[propertyName];
  if (typeof color !== 'string') {
    throw Error(
      `${propertyName} must be of type number but was ${typeof color}`,
    );
  }
  const hexRegexp = /^#([0-9A-F]{3}){1,2}$/i;
  if (!hexRegexp.test(color)) {
    throw Error(
      `${propertyName} must be correct hex(length = 3 or 6) with leading # but was ${color}`,
    );
  }
  return true;
}

export function validateObjectPropertyIsNumber(
  num: number | unknown,
  propertyName: string,
  min: number | null = null,
  max: number | null = null,
): boolean {
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

export function validateObjectPropertyIsColor(
  color: string | unknown,
  propertyName: string,
): boolean {
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

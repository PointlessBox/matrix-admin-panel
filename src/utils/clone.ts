export const clone = <T>(value: T): T => {
  let result: T = value;
  if (typeof value === 'object') result = JSON.parse(JSON.stringify(value));
  return result;
};

export const isEmpty = val => val && typeof val === "object" && Object.keys(val).length === 0;
export const isObject = val => val != null && typeof val === 'object' && Array.isArray(val) === false;
export const isNullOfUndefined = (v: any) => v === null || v === undefined;
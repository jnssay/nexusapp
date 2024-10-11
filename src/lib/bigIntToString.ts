// bigIntToString.ts

/**
 * Recursively converts all BigInt values in an object to strings.
 *
 * @param obj - The object to process.
 * @returns A new object with BigInt values converted to strings.
 */
export function bigIntToString(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(bigIntToString);

    const newObj: any = {};
    for (const key in obj) {
        const value = obj[key];
        if (typeof value === 'bigint') {
            newObj[key] = value.toString();
        } else if (typeof value === 'object') {
            newObj[key] = bigIntToString(value);
        } else {
            newObj[key] = value;
        }
    }
    return newObj;
}

// bigIntToString.ts

/**
 * Recursively converts all BigInt values in an object to strings.
 *
 * @param obj - The object to process.
 * @returns A new object with BigInt values converted to strings.
 */
export function bigIntToString(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    if (Array.isArray(obj)) {
        return obj.map((item) => bigIntToString(item));
    }

    if (typeof obj === 'object') {
        const result: any = {};
        for (const key of Object.keys(obj)) {
            const value = obj[key];
            if (typeof value === 'bigint') {
                result[key] = value.toString(); // Convert BigInt to string
            } else if (Object.prototype.toString.call(value) === '[object Date]') {
                result[key] = value.toISOString(); // Convert DateTime to ISO string
            } else if (typeof value === 'object' && value !== null) {
                result[key] = bigIntToString(value); // Recursively handle nested objects
            } else {
                result[key] = value;
            }
        }
        return result;
    }

    return obj;
}

import {ApplicationException} from "@/lib/types/application-exception.ts";
import {COMMON_RESPONSE} from "@/lib/types/error-type.ts";

type Constructor<T> = new () => T;

export function simpleObjCover<T extends object>(
    fromObj: Record<string, unknown>,
    TargetClass: Constructor<T>,
): T {
    if (!fromObj || typeof fromObj !== 'object') throw new ApplicationException(COMMON_RESPONSE.INVALID_PARAMS);

    const targetObj = new TargetClass() as T & Record<keyof T, unknown>;
    const resultObj = new TargetClass() as T & Record<keyof T, unknown>;
    const resultRecord = resultObj as Record<keyof T, unknown>;
    const schemaKeys = Object.keys(targetObj) as Array<keyof T>;

    for (const key of schemaKeys) {
        const rawValue = fromObj[key as string];

        if (rawValue === undefined) continue;

        const targetValue = targetObj[key];
        const targetType = typeof targetValue;

        if (targetType === 'number') {
            resultRecord[key] = isNaN(Number(rawValue)) ? 0 : Number(rawValue);
        } else if (targetType === 'string') {
            resultRecord[key] = String(rawValue);
        } else if (targetType === 'boolean') {
            resultRecord[key] = rawValue === 'true' || rawValue === 1 || rawValue === true;
        } else if (Array.isArray(targetValue)) {
            resultRecord[key] = Array.isArray(rawValue) ? [...rawValue] : [rawValue];
        } else if (targetValue instanceof Date) {
            const dateVal = rawValue instanceof Date
                ? rawValue
                : rawValue
                    ? new Date(rawValue as string | number)
                    : targetValue;
            resultRecord[key] = isNaN(dateVal.getTime()) ? targetValue : dateVal;
        } else if (targetType === 'object' && targetValue !== null) {
            resultRecord[key] = typeof rawValue === 'object' && !Array.isArray(rawValue)
                ? { ...rawValue }
                : targetValue;
        } else {
            resultRecord[key] = rawValue;
        }
    }

    return resultObj as T;
}
